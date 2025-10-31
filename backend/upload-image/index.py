import json
import base64
import os
from typing import Dict, Any
from dataclasses import dataclass
import hashlib
from datetime import datetime

@dataclass
class UploadedFile:
    filename: str
    url: str
    size: int
    uploaded_at: str

STORAGE_DIR = '/tmp/uploads'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Upload and store image files, return public URL
    Args: event - dict with httpMethod, body (base64 image data), headers
          context - object with request_id, function_name attributes
    Returns: HTTP response with uploaded file URL
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        file_data = body_data.get('file')
        filename = body_data.get('filename', 'unnamed')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No file data provided'}),
                'isBase64Encoded': False
            }
        
        if file_data.startswith('data:'):
            header, encoded = file_data.split(',', 1)
        else:
            encoded = file_data
        
        file_bytes = base64.b64decode(encoded)
        file_size = len(file_bytes)
        
        if file_size > 5 * 1024 * 1024:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'File too large (max 5MB)'}),
                'isBase64Encoded': False
            }
        
        file_hash = hashlib.md5(file_bytes).hexdigest()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_filename = f"{timestamp}_{file_hash[:8]}_{filename}"
        
        os.makedirs(STORAGE_DIR, exist_ok=True)
        file_path = os.path.join(STORAGE_DIR, safe_filename)
        
        with open(file_path, 'wb') as f:
            f.write(file_bytes)
        
        file_url = f"data:{header.split(':')[1].split(';')[0] if 'data:' in file_data else 'image/jpeg'};base64,{encoded}"
        
        result = {
            'url': file_url,
            'filename': safe_filename,
            'size': file_size,
            'uploadedAt': datetime.now().isoformat()
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Upload failed',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }
