import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления командой сотрудников (просмотр, добавление, редактирование, удаление)
    Args: event с httpMethod, body, queryStringParameters; context с request_id
    Returns: HTTP response с данными команды
    '''
    import psycopg2
    
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute('SELECT id, name, position, photo, order_index FROM team_members ORDER BY order_index ASC')
            rows = cur.fetchall()
            team = [
                {
                    'id': row[0],
                    'name': row[1],
                    'position': row[2],
                    'photo': row[3],
                    'order_index': row[4]
                }
                for row in rows
            ]
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps(team)
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name')
            position = body_data.get('position')
            photo = body_data.get('photo')
            order_index = body_data.get('order_index', 0)
            
            cur.execute(
                "INSERT INTO team_members (name, position, photo, order_index) VALUES (%s, %s, %s, %s) RETURNING id",
                (name, position, photo, order_index)
            )
            member_id = cur.fetchone()[0]
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': member_id,
                    'name': name,
                    'position': position,
                    'photo': photo,
                    'order_index': order_index
                })
            }
        
        if method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            member_id = body_data.get('id')
            name = body_data.get('name')
            position = body_data.get('position')
            photo = body_data.get('photo')
            order_index = body_data.get('order_index', 0)
            
            cur.execute(
                "UPDATE team_members SET name = %s, position = %s, photo = %s, order_index = %s WHERE id = %s",
                (name, position, photo, order_index, member_id)
            )
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': member_id,
                    'name': name,
                    'position': position,
                    'photo': photo,
                    'order_index': order_index
                })
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {})
            member_id = params.get('id')
            
            cur.execute("DELETE FROM team_members WHERE id = %s", (member_id,))
            conn.commit()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
