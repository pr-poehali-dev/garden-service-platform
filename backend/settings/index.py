"""
Business: API для управления всеми настройками сайта (логотипы, цвета, контакты, контент)
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response с настройками сайта или результатом обновления
"""

import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def json_serializer(obj):
    """JSON serializer для datetime объектов"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def convert_dates_to_str(data):
    """Конвертирует datetime объекты в строки"""
    if isinstance(data, dict):
        return {k: convert_dates_to_str(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_dates_to_str(item) for item in data]
    elif isinstance(data, datetime):
        return data.isoformat()
    return data

def get_db_connection():
    """Создает подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        raise ValueError('DATABASE_URL environment variable is not set')
    return psycopg2.connect(dsn)

def get_all_settings(conn) -> Dict[str, Any]:
    """Получает все настройки сайта из базы данных"""
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Получаем настройки сайта
        cur.execute("SELECT * FROM site_settings WHERE id = 1")
        site_settings = cur.fetchone()
        
        # Получаем настройки главной страницы
        cur.execute("SELECT * FROM homepage WHERE id = 1")
        homepage = cur.fetchone()
        
        # Получаем контакты
        cur.execute("SELECT * FROM contact_page WHERE id = 1")
        contacts = cur.fetchone()
        
        # Получаем услуги
        cur.execute("SELECT * FROM services ORDER BY id")
        services = cur.fetchall()
        
        # Получаем отзывы
        cur.execute("SELECT * FROM reviews ORDER BY id")
        reviews = cur.fetchall()
        
        # Получаем команду
        cur.execute("SELECT * FROM team_members ORDER BY id")
        team = cur.fetchall()
        
        # Получаем блог
        cur.execute("SELECT * FROM posts ORDER BY created_at DESC")
        posts = cur.fetchall()
        
        result = {
            'siteSettings': dict(site_settings) if site_settings else {},
            'homepage': dict(homepage) if homepage else {},
            'contacts': dict(contacts) if contacts else {},
            'services': [dict(s) for s in services],
            'reviews': [dict(r) for r in reviews],
            'team': [dict(t) for t in team],
            'posts': [dict(p) for p in posts]
        }
        
        return convert_dates_to_str(result)

def update_site_settings(conn, data: Dict[str, Any]) -> Dict[str, Any]:
    """Обновляет настройки сайта"""
    with conn.cursor() as cur:
        fields = []
        values = []
        
        allowed_fields = [
            'site_name', 'site_description', 'logo', 'logo_size', 'site_name_size',
            'footer_logo', 'footer_logo_size', 'footer_site_name', 'footer_site_name_size',
            'footer_description', 'footer_description_size', 'copyright_text', 
            'copyright_text_size', 'favicon', 'meta_title', 'meta_description', 
            'colors', 'custom_settings'
        ]
        
        for field in allowed_fields:
            if field in data:
                fields.append(f"{field} = %s")
                if field in ['colors', 'custom_settings']:
                    values.append(json.dumps(data[field]))
                else:
                    values.append(data[field])
        
        if not fields:
            return {'success': False, 'error': 'No valid fields to update'}
        
        fields.append("updated_at = CURRENT_TIMESTAMP")
        query = f"UPDATE site_settings SET {', '.join(fields)} WHERE id = 1 RETURNING *"
        
        cur.execute(query, values)
        conn.commit()
        
        return {'success': True, 'message': 'Site settings updated'}

def update_homepage(conn, data: Dict[str, Any]) -> Dict[str, Any]:
    """Обновляет настройки главной страницы"""
    with conn.cursor() as cur:
        fields = []
        values = []
        
        allowed_fields = [
            'site_name', 'logo', 'hero_title', 'hero_subtitle', 
            'hero_bg', 'blocks', 'meta_title', 'meta_description',
            'site_name_size', 'logo_size', 'favicon', 'page_title',
            'footer_logo', 'footer_logo_size', 'footer_site_name', 
            'footer_site_name_size', 'footer_description', 'footer_description_size',
            'footer_copyright', 'footer_copyright_size'
        ]
        
        for field in allowed_fields:
            if field in data:
                # Сохраняем даже пустые значения
                fields.append(f"{field} = %s")
                if field == 'blocks':
                    values.append(json.dumps(data[field]) if data[field] else None)
                else:
                    values.append(data[field] if data[field] != '' else None)
        
        print(f"Fields to update: {fields}")
        print(f"Number of fields: {len(fields)}")
        
        if not fields:
            return {'success': False, 'error': 'No valid fields to update'}
        
        fields.append("updated_at = CURRENT_TIMESTAMP")
        
        # Проверяем существование записи
        cur.execute("SELECT id FROM homepage WHERE id = 1")
        exists = cur.fetchone()
        
        if exists:
            query = f"UPDATE homepage SET {', '.join(fields)} WHERE id = 1"
            print(f"Executing UPDATE query: {query}")
            print(f"Values: {values}")
            cur.execute(query, values)
        else:
            # Создаем новую запись если её нет
            field_names = [f.split(' = ')[0] for f in fields if 'updated_at' not in f]
            placeholders = ', '.join(['%s'] * len(values))
            query = f"INSERT INTO homepage (id, {', '.join(field_names)}, updated_at) VALUES (1, {placeholders}, CURRENT_TIMESTAMP)"
            print(f"Executing INSERT query: {query}")
            print(f"Values: {values}")
            cur.execute(query, values)
        
        conn.commit()
        print("Committed successfully")
        return {'success': True, 'message': 'Homepage updated'}

def update_contacts(conn, data: Dict[str, Any]) -> Dict[str, Any]:
    """Обновляет контактную информацию"""
    with conn.cursor() as cur:
        fields = []
        values = []
        
        allowed_fields = ['phones', 'messengers', 'address', 'map_embed', 'socials', 'requisites']
        
        for field in allowed_fields:
            if field in data:
                fields.append(f"{field} = %s")
                if field in ['messengers', 'socials', 'requisites']:
                    values.append(json.dumps(data[field]))
                elif field == 'phones':
                    values.append(data[field])
                else:
                    values.append(data[field])
        
        if not fields:
            return {'success': False, 'error': 'No valid fields to update'}
        
        fields.append("updated_at = CURRENT_TIMESTAMP")
        
        # Проверяем существование записи
        cur.execute("SELECT id FROM contact_page WHERE id = 1")
        exists = cur.fetchone()
        
        if exists:
            query = f"UPDATE contact_page SET {', '.join(fields)} WHERE id = 1"
            cur.execute(query, values)
        else:
            field_names = [f.split(' = ')[0] for f in fields if 'updated_at' not in f]
            placeholders = ', '.join(['%s'] * len(values))
            query = f"INSERT INTO contact_page (id, {', '.join(field_names)}, updated_at) VALUES (1, {placeholders}, CURRENT_TIMESTAMP)"
            cur.execute(query, values)
        
        conn.commit()
        return {'success': True, 'message': 'Contacts updated'}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    # Обработка CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
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
        
        # GET - получить все настройки
        if method == 'GET':
            settings = get_all_settings(conn)
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(settings, default=str),
                'isBase64Encoded': False
            }
        
        # POST/PUT - обновить настройки
        if method in ['POST', 'PUT']:
            body_data = json.loads(event.get('body', '{}'))
            section = body_data.get('section')
            data = body_data.get('data', {})
            
            print(f"Updating section: {section}, data: {data}")
            
            if section == 'siteSettings':
                result = update_site_settings(conn, data)
            elif section == 'homepage':
                result = update_homepage(conn, data)
            elif section == 'contacts':
                result = update_contacts(conn, data)
            else:
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid section'}),
                    'isBase64Encoded': False
                }
            
            # После обновления получаем свежие данные
            updated_settings = get_all_settings(conn)
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    **result,
                    **updated_settings
                }, default=json_serializer),
                'isBase64Encoded': False
            }
        
        conn.close()
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }