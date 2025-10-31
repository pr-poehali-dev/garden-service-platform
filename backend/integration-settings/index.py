'''
Business: API для управления настройками интеграций с Telegram и WhatsApp
Args: event - dict с httpMethod, body
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с настройками интеграций
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("SELECT * FROM integration_settings WHERE id = 1")
            settings = cur.fetchone()
            
            if not settings:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Settings not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(settings), default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
            if 'telegram_bot_token' in body:
                update_fields.append('telegram_bot_token = %s')
                values.append(body['telegram_bot_token'])
            
            if 'telegram_chat_ids' in body:
                update_fields.append('telegram_chat_ids = %s')
                values.append(body['telegram_chat_ids'])
            
            if 'whatsapp_enabled' in body:
                update_fields.append('whatsapp_enabled = %s')
                values.append(body['whatsapp_enabled'])
            
            if 'whatsapp_api_url' in body:
                update_fields.append('whatsapp_api_url = %s')
                values.append(body['whatsapp_api_url'])
            
            if 'whatsapp_api_token' in body:
                update_fields.append('whatsapp_api_token = %s')
                values.append(body['whatsapp_api_token'])
            
            if 'whatsapp_phone_ids' in body:
                update_fields.append('whatsapp_phone_ids = %s')
                values.append(body['whatsapp_phone_ids'])
            
            if 'admin_url' in body:
                update_fields.append('admin_url = %s')
                values.append(body['admin_url'])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            
            query = f"UPDATE integration_settings SET {', '.join(update_fields)} WHERE id = 1 RETURNING *"
            
            cur.execute(query, values)
            updated_settings = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_settings), default=str)
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
