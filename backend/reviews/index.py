import json
import os
import psycopg2
import psycopg2.extras
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления отзывами клиентов
    Args: event с httpMethod, body, queryStringParameters
          context с request_id
    Returns: HTTP response с отзывами или результатом операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            status = params.get('status')
            
            if status and status in ['pending', 'approved', 'rejected']:
                query = f"SELECT id, name, email, phone, rating, text, photos, status, created_at FROM reviews WHERE status = '{status}' ORDER BY created_at DESC"
            else:
                query = "SELECT id, name, email, phone, rating, text, photos, status, created_at FROM reviews ORDER BY created_at DESC"
            
            cur.execute(query)
            rows = cur.fetchall()
            reviews = []
            for row in rows:
                reviews.append({
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'phone': row[3],
                    'rating': row[4],
                    'text': row[5],
                    'photos': row[6] or [],
                    'status': row[7],
                    'created_at': row[8].isoformat() if row[8] else None
                })
            
            cur.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reviews': reviews}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name', '').replace("'", "''")
            email = body_data.get('email', '').replace("'", "''") if body_data.get('email') else None
            phone = body_data.get('phone', '').replace("'", "''") if body_data.get('phone') else None
            rating = int(body_data.get('rating', 5))
            text = body_data.get('text', '').replace("'", "''")
            photos = body_data.get('photos', [])
            
            if not name or not text:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'name and text are required'}),
                    'isBase64Encoded': False
                }
            
            if not email and not phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'either email or phone is required'}),
                    'isBase64Encoded': False
                }
            
            photos_array = 'ARRAY[' + ','.join([f"'{p.replace(chr(39), chr(39)*2)}'" for p in photos]) + ']' if photos else 'ARRAY[]::text[]'
            
            email_val = f"'{email}'" if email else 'NULL'
            phone_val = f"'{phone}'" if phone else 'NULL'
            
            query = f"INSERT INTO reviews (name, email, phone, rating, text, photos, status) VALUES ('{name}', {email_val}, {phone_val}, {rating}, '{text}', {photos_array}, 'pending') RETURNING id"
            
            cur.execute(query)
            review_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': review_id, 'message': 'Review created'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            status = body_data.get('status')
            
            if not review_id or not status or status not in ['pending', 'approved', 'rejected']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id and valid status are required'}),
                    'isBase64Encoded': False
                }
            
            query = f"UPDATE reviews SET status = '{status}', updated_at = CURRENT_TIMESTAMP WHERE id = {review_id}"
            cur.execute(query)
            conn.commit()
            cur.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Review updated'}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            review_id = body_data.get('id')
            
            if not review_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'id is required'}),
                    'isBase64Encoded': False
                }
            
            query = f"DELETE FROM reviews WHERE id = {review_id}"
            cur.execute(query)
            conn.commit()
            cur.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Review deleted'}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if conn:
            conn.close()