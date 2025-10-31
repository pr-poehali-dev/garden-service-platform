'''
Business: Unified CMS API for managing all site content entities
Args: event - dict with httpMethod, body, path, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with CRUD operations results
'''
import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL not found')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def json_serial(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f'Type {type(obj)} not serializable')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('path', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        
        path_parts = [p for p in path.split('/') if p]
        
        if len(path_parts) < 1:
            return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Invalid path'})}
        
        entity_type = path_parts[0]
        entity_id = path_parts[1] if len(path_parts) > 1 else None
        
        if entity_type == 'services':
            result = handle_services(conn, method, entity_id, event)
        elif entity_type == 'posts':
            result = handle_posts(conn, method, entity_id, event)
        elif entity_type == 'team':
            result = handle_team(conn, method, entity_id, event)
        elif entity_type == 'settings':
            result = handle_settings(conn, method, entity_id, event)
        else:
            result = {'statusCode': 404, 'body': {'error': 'Unknown entity type'}}
        
        conn.close()
        
        return {
            'statusCode': result.get('statusCode', 200),
            'headers': headers,
            'body': json.dumps(result.get('body', {}), default=json_serial)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }

def handle_services(conn, method: str, entity_id: Optional[str], event: Dict) -> Dict:
    cursor = conn.cursor()
    
    if method == 'GET':
        if entity_id:
            cursor.execute(
                "SELECT * FROM services WHERE id = %s AND removed_at IS NULL",
                (entity_id,)
            )
            item = cursor.fetchone()
            if not item:
                return {'statusCode': 404, 'body': {'error': 'Not found'}}
            return {'statusCode': 200, 'body': dict(item)}
        
        params = event.get('queryStringParameters') or {}
        search = params.get('search', '')
        visible = params.get('visible')
        
        query = "SELECT * FROM services WHERE removed_at IS NULL"
        query_params = []
        
        if search:
            query += " AND (title ILIKE %s OR description ILIKE %s)"
            search_pattern = f'%{search}%'
            query_params.extend([search_pattern, search_pattern])
        
        if visible is not None:
            query += " AND visible = %s"
            query_params.append(visible == 'true')
        
        query += " ORDER BY sort_order, created_at DESC"
        
        cursor.execute(query, query_params)
        items = [dict(row) for row in cursor.fetchall()]
        return {'statusCode': 200, 'body': {'items': items, 'total': len(items)}}
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            INSERT INTO services 
            (title, slug, short_desc, description, price, unit, visible, sort_order, images, meta_title, meta_description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            body['title'],
            body.get('slug', body['title'].lower().replace(' ', '-')),
            body.get('short_desc'),
            body.get('description'),
            body.get('price', 0),
            body.get('unit', 'шт'),
            body.get('visible', True),
            body.get('sort_order', 0),
            json.dumps(body.get('images', [])),
            body.get('meta_title'),
            body.get('meta_description')
        ))
        
        item = dict(cursor.fetchone())
        conn.commit()
        return {'statusCode': 201, 'body': item}
    
    elif method == 'PUT' and entity_id:
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            UPDATE services 
            SET title = %s, slug = %s, short_desc = %s, description = %s, 
                price = %s, unit = %s, visible = %s, sort_order = %s, 
                images = %s, meta_title = %s, meta_description = %s, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND removed_at IS NULL
            RETURNING *
        """, (
            body['title'],
            body.get('slug', body['title'].lower().replace(' ', '-')),
            body.get('short_desc'),
            body.get('description'),
            body.get('price', 0),
            body.get('unit', 'шт'),
            body.get('visible', True),
            body.get('sort_order', 0),
            json.dumps(body.get('images', [])),
            body.get('meta_title'),
            body.get('meta_description'),
            entity_id
        ))
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    elif method == 'PATCH' and entity_id:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'archive':
            cursor.execute(
                "UPDATE services SET removed_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'restore':
            cursor.execute(
                "UPDATE services SET removed_at = NULL WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'toggle_visibility':
            cursor.execute(
                "UPDATE services SET visible = NOT visible WHERE id = %s RETURNING *",
                (entity_id,)
            )
        else:
            return {'statusCode': 400, 'body': {'error': 'Unknown action'}}
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    return {'statusCode': 405, 'body': {'error': 'Method not allowed'}}

def handle_posts(conn, method: str, entity_id: Optional[str], event: Dict) -> Dict:
    cursor = conn.cursor()
    
    if method == 'GET':
        if entity_id:
            cursor.execute(
                "SELECT * FROM posts WHERE id = %s AND removed_at IS NULL",
                (entity_id,)
            )
            item = cursor.fetchone()
            if not item:
                return {'statusCode': 404, 'body': {'error': 'Not found'}}
            return {'statusCode': 200, 'body': dict(item)}
        
        params = event.get('queryStringParameters') or {}
        search = params.get('search', '')
        visible = params.get('visible')
        
        query = "SELECT * FROM posts WHERE removed_at IS NULL"
        query_params = []
        
        if search:
            query += " AND (title ILIKE %s OR excerpt ILIKE %s)"
            search_pattern = f'%{search}%'
            query_params.extend([search_pattern, search_pattern])
        
        if visible is not None:
            query += " AND visible = %s"
            query_params.append(visible == 'true')
        
        query += " ORDER BY published_at DESC NULLS LAST, created_at DESC"
        
        cursor.execute(query, query_params)
        items = [dict(row) for row in cursor.fetchall()]
        return {'statusCode': 200, 'body': {'items': items, 'total': len(items)}}
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            INSERT INTO posts 
            (title, slug, excerpt, body, gallery, visible, published_at, meta_title, meta_description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            body['title'],
            body.get('slug', body['title'].lower().replace(' ', '-')),
            body.get('excerpt'),
            body.get('body'),
            json.dumps(body.get('gallery', [])),
            body.get('visible', True),
            body.get('published_at'),
            body.get('meta_title'),
            body.get('meta_description')
        ))
        
        item = dict(cursor.fetchone())
        conn.commit()
        return {'statusCode': 201, 'body': item}
    
    elif method == 'PUT' and entity_id:
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            UPDATE posts 
            SET title = %s, slug = %s, excerpt = %s, body = %s, 
                gallery = %s, visible = %s, published_at = %s,
                meta_title = %s, meta_description = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND removed_at IS NULL
            RETURNING *
        """, (
            body['title'],
            body.get('slug', body['title'].lower().replace(' ', '-')),
            body.get('excerpt'),
            body.get('body'),
            json.dumps(body.get('gallery', [])),
            body.get('visible', True),
            body.get('published_at'),
            body.get('meta_title'),
            body.get('meta_description'),
            entity_id
        ))
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    elif method == 'PATCH' and entity_id:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'archive':
            cursor.execute(
                "UPDATE posts SET removed_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'restore':
            cursor.execute(
                "UPDATE posts SET removed_at = NULL WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'toggle_visibility':
            cursor.execute(
                "UPDATE posts SET visible = NOT visible WHERE id = %s RETURNING *",
                (entity_id,)
            )
        else:
            return {'statusCode': 400, 'body': {'error': 'Unknown action'}}
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    return {'statusCode': 405, 'body': {'error': 'Method not allowed'}}

def handle_team(conn, method: str, entity_id: Optional[str], event: Dict) -> Dict:
    cursor = conn.cursor()
    
    if method == 'GET':
        if entity_id:
            cursor.execute(
                "SELECT * FROM team_members WHERE id = %s AND removed_at IS NULL",
                (entity_id,)
            )
            item = cursor.fetchone()
            if not item:
                return {'statusCode': 404, 'body': {'error': 'Not found'}}
            return {'statusCode': 200, 'body': dict(item)}
        
        params = event.get('queryStringParameters') or {}
        visible = params.get('visible')
        
        query = "SELECT * FROM team_members WHERE removed_at IS NULL"
        query_params = []
        
        if visible is not None:
            query += " AND visible = %s"
            query_params.append(visible == 'true')
        
        query += " ORDER BY sort_order, created_at"
        
        cursor.execute(query, query_params)
        items = [dict(row) for row in cursor.fetchall()]
        return {'statusCode': 200, 'body': {'items': items, 'total': len(items)}}
    
    elif method == 'POST':
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            INSERT INTO team_members 
            (name, role, photo, phone, telegram, visible, sort_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            body['name'],
            body.get('role'),
            body.get('photo'),
            body.get('phone'),
            body.get('telegram'),
            body.get('visible', True),
            body.get('sort_order', 0)
        ))
        
        item = dict(cursor.fetchone())
        conn.commit()
        return {'statusCode': 201, 'body': item}
    
    elif method == 'PUT' and entity_id:
        body = json.loads(event.get('body', '{}'))
        
        cursor.execute("""
            UPDATE team_members 
            SET name = %s, role = %s, photo = %s, phone = %s, 
                telegram = %s, visible = %s, sort_order = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND removed_at IS NULL
            RETURNING *
        """, (
            body['name'],
            body.get('role'),
            body.get('photo'),
            body.get('phone'),
            body.get('telegram'),
            body.get('visible', True),
            body.get('sort_order', 0),
            entity_id
        ))
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    elif method == 'PATCH' and entity_id:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'archive':
            cursor.execute(
                "UPDATE team_members SET removed_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'restore':
            cursor.execute(
                "UPDATE team_members SET removed_at = NULL WHERE id = %s RETURNING *",
                (entity_id,)
            )
        elif action == 'toggle_visibility':
            cursor.execute(
                "UPDATE team_members SET visible = NOT visible WHERE id = %s RETURNING *",
                (entity_id,)
            )
        else:
            return {'statusCode': 400, 'body': {'error': 'Unknown action'}}
        
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        conn.commit()
        return {'statusCode': 200, 'body': dict(item)}
    
    return {'statusCode': 405, 'body': {'error': 'Method not allowed'}}

def handle_settings(conn, method: str, setting_key: Optional[str], event: Dict) -> Dict:
    cursor = conn.cursor()
    
    if not setting_key:
        return {'statusCode': 400, 'body': {'error': 'Setting key required'}}
    
    if method == 'GET':
        cursor.execute(
            "SELECT * FROM site_settings WHERE setting_key = %s",
            (setting_key,)
        )
        item = cursor.fetchone()
        if not item:
            return {'statusCode': 404, 'body': {'error': 'Not found'}}
        
        return {'statusCode': 200, 'body': {'key': item['setting_key'], 'value': json.loads(item['setting_value'])}}
    
    elif method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        value = body.get('value', {})
        
        cursor.execute("""
            INSERT INTO site_settings (setting_key, setting_value, updated_at)
            VALUES (%s, %s, CURRENT_TIMESTAMP)
            ON CONFLICT (setting_key) 
            DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP
            RETURNING *
        """, (setting_key, json.dumps(value)))
        
        item = cursor.fetchone()
        conn.commit()
        return {'statusCode': 200, 'body': {'key': item['setting_key'], 'value': json.loads(item['setting_value'])}}
    
    return {'statusCode': 405, 'body': {'error': 'Method not allowed'}}
