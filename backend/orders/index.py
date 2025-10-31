'''
Business: API для управления заказами - создание из заявки, просмотр, обновление
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с данными заказов
'''

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def generate_order_number() -> str:
    now = datetime.now()
    return f"ORD-{now.strftime('%Y%m%d-%H%M%S')}"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    path_params = event.get('pathParams', {})
    
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
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            order_id = path_params.get('id')
            
            if order_id:
                cur.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
                order = cur.fetchone()
                
                if not order:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Order not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(order), default=str)
                }
            else:
                query_params = event.get('queryStringParameters', {}) or {}
                status = query_params.get('status')
                
                if status:
                    cur.execute(
                        "SELECT * FROM orders WHERE status = %s ORDER BY created_at DESC",
                        (status,)
                    )
                else:
                    cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
                
                orders = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(ord) for ord in orders], default=str)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            from_application_id = body.get('from_application_id')
            
            if not from_application_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'from_application_id is required'})
                }
            
            cur.execute("SELECT * FROM applications WHERE id = %s", (from_application_id,))
            application = cur.fetchone()
            
            if not application:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application not found'})
                }
            
            if application['status'] != 'approved':
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Application must be approved before creating order'})
                }
            
            number = generate_order_number()
            
            cur.execute(
                """
                INSERT INTO orders 
                (number, from_application_id, customer_name, customer_phone, customer_address, 
                 customer_comment, items, total_amount, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'active')
                RETURNING *
                """,
                (
                    number,
                    from_application_id,
                    application['customer_name'],
                    application['customer_phone'],
                    application['customer_address'],
                    application['customer_comment'],
                    json.dumps(application['items']),
                    application['total_amount']
                )
            )
            
            new_order = cur.fetchone()
            
            cur.execute(
                "UPDATE applications SET status = 'converted_to_order' WHERE id = %s",
                (from_application_id,)
            )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_order), default=str)
            }
        
        elif method == 'PUT':
            order_id = path_params.get('id')
            
            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order ID is required'})
                }
            
            body = json.loads(event.get('body', '{}'))
            
            update_fields = []
            values = []
            
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
            values.append(order_id)
            
            query = f"UPDATE orders SET {', '.join(update_fields)} WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            updated_order = cur.fetchone()
            conn.commit()
            
            if not updated_order:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated_order), default=str)
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
