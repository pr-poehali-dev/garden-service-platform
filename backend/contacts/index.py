"""
Business: Manage contact page information (phones, messengers, address, socials)
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with contact data or confirmation
"""

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, phones, messengers, address, map_embed, socials, requisites, updated_at
                FROM contact_page
                ORDER BY id DESC
                LIMIT 1
            """)
            contact = cur.fetchone()
            
            if not contact:
                contact = {
                    'id': 1,
                    'phones': [],
                    'messengers': {},
                    'address': '',
                    'map_embed': '',
                    'socials': {},
                    'requisites': {}
                }
            else:
                contact = dict(contact)
                if 'updated_at' in contact and isinstance(contact['updated_at'], datetime):
                    contact['updated_at'] = contact['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(contact)
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            
            phones = body_data.get('phones', [])
            messengers = body_data.get('messengers', {})
            address = body_data.get('address', '')
            map_embed = body_data.get('map_embed', '')
            socials = body_data.get('socials', {})
            requisites = body_data.get('requisites', {})
            
            cur.execute("""
                INSERT INTO contact_page (id, phones, messengers, address, map_embed, socials, requisites)
                VALUES (1, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    phones = EXCLUDED.phones,
                    messengers = EXCLUDED.messengers,
                    address = EXCLUDED.address,
                    map_embed = EXCLUDED.map_embed,
                    socials = EXCLUDED.socials,
                    requisites = EXCLUDED.requisites,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id, phones, messengers, address, map_embed, socials, requisites, updated_at
            """, (
                phones,
                json.dumps(messengers),
                address,
                map_embed,
                json.dumps(socials),
                json.dumps(requisites)
            ))
            
            updated = cur.fetchone()
            conn.commit()
            
            result = dict(updated)
            if 'updated_at' in result and isinstance(result['updated_at'], datetime):
                result['updated_at'] = result['updated_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cur.close()
        conn.close()