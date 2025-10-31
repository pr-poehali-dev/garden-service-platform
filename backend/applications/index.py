'''
Business: API для управления заявками - CRUD операции и смена статуса
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными заявок
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any, List, Optional

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def generate_application_number() -> str:
    now = datetime.now()
    return f"APP-{now.strftime('%Y%m%d-%H%M%S')}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            app_id = path_params.get('id')
            
            if app_id:
                cur.execute(
                    "SELECT * FROM applications WHERE id = %s",
                    (app_id,)
                )
                application = cur.fetchone()
                
                if not application:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Application not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(application), default=str)
                }
            else:
                query_params = event.get('queryStringParameters', {}) or {}
                status = query_params.get('status')
                
                if status:
                    cur.execute(
                        "SELECT * FROM applications WHERE status = %s ORDER BY created_at DESC",
                        (status,)
                    )
                else:
                    cur.execute("SELECT * FROM applications ORDER BY created_at DESC")
                
                applications = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(app) for app in applications], default=str)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            number = generate_application_number()
            customer_name = body.get('customer_name', '')
            customer_phone = body.get('customer_phone', '')
            customer_address = body.get('customer_address', '')
            customer_comment = body.get('customer_comment', '')
            items = json.dumps(body.get('items', []))
            total_amount = body.get('total_amount', 0)
            source = body.get('source', 'website')
            
            cur.execute(
                """
                INSERT INTO applications 
                (number, customer_name, customer_phone, customer_address, customer_comment, 
                 items, total_amount, source, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'new')
                RETURNING *
                """,
                (number, customer_name, customer_phone, customer_address, customer_comment,
                 items, total_amount, source)
            )
            
            new_application = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_application), default=str)
            }
        
        elif method == 'PUT':
            app_id = path_params.get('id')
            
            if not app_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application ID is required'})
                }
            
            body = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
            if 'customer_name' in body:
                update_fields.append('customer_name = %s')
                values.append(body['customer_name'])
            
            if 'customer_phone' in body:
                update_fields.append('customer_phone = %s')
                values.append(body['customer_phone'])
            
            if 'customer_address' in body:
                update_fields.append('customer_address = %s')
                values.append(body['customer_address'])
            
            if 'customer_comment' in body:
                update_fields.append('customer_comment = %s')
                values.append(body['customer_comment'])
            
            if 'items' in body:
                update_fields.append('items = %s')
                values.append(json.dumps(body['items']))
            
            if 'total_amount' in body:
                update_fields.append('total_amount = %s')
                values.append(body['total_amount'])
            
            if 'status' in body:
                update_fields.append('status = %s')
                values.append(body['status'])
            
            if 'notes' in body:
                update_fields.append('notes = %s')
                values.append(body['notes'])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            values.append(app_id)
            
            query = f"UPDATE applications SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            updated_application = cur.fetchone()
            conn.commit()
            
            if not updated_application:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_application), default=str)
            }
        
        elif method == 'DELETE':
            app_id = path_params.get('id')
            
            if not app_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application ID is required'})
                }
            
            cur.execute("DELETE FROM applications WHERE id = %s RETURNING id", (app_id,))
            deleted = cur.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': deleted['id']})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
