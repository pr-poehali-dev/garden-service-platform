'''
Business: Отправка уведомлений о заявках и заказах в Telegram и WhatsApp
Args: event - dict с httpMethod, body (type, data, settings)
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с результатом отправки
'''

import json
import os
import requests
from typing import Dict, Any, List

def format_application_message(data: Dict[str, Any], admin_url: str) -> str:
    number = data.get('number', 'N/A')
    created_at = data.get('created_at', 'N/A')
    customer_name = data.get('customer_name', '')
    customer_phone = data.get('customer_phone', '')
    customer_address = data.get('customer_address', '')
    items = data.get('items', [])
    total_amount = data.get('total_amount', 0)
    app_id = data.get('id', '')
    
    message = f"🆕 НОВАЯ ЗАЯВКА #{number}\n\n"
    message += f"📅 Дата: {created_at}\n"
    message += f"👤 Клиент: {customer_name}\n"
    message += f"📞 Телефон: {customer_phone}\n"
    
    if customer_address:
        message += f"📍 Адрес: {customer_address}\n"
    
    message += f"\n📦 Состав заявки:\n"
    
    for item in items:
        title = item.get('title', 'Без названия')
        qty = item.get('qty', 1)
        price = item.get('price', 0)
        total = item.get('total', 0)
        message += f"  • {title} x{qty} — {price} ₽ = {total} ₽\n"
    
    message += f"\n💰 Итого: {total_amount} ₽\n"
    message += f"\n🔗 Открыть в админке: {admin_url}/admin/applications/{app_id}"
    
    return message

def format_order_message(data: Dict[str, Any], admin_url: str) -> str:
    number = data.get('number', 'N/A')
    created_at = data.get('created_at', 'N/A')
    customer_name = data.get('customer_name', '')
    customer_phone = data.get('customer_phone', '')
    customer_address = data.get('customer_address', '')
    items = data.get('items', [])
    total_amount = data.get('total_amount', 0)
    order_id = data.get('id', '')
    
    message = f"✅ НОВЫЙ ЗАКАЗ #{number}\n\n"
    message += f"📅 Дата: {created_at}\n"
    message += f"👤 Клиент: {customer_name}\n"
    message += f"📞 Телефон: {customer_phone}\n"
    
    if customer_address:
        message += f"📍 Адрес: {customer_address}\n"
    
    message += f"\n📦 Состав заказа:\n"
    
    for item in items:
        title = item.get('title', 'Без названия')
        qty = item.get('qty', 1)
        price = item.get('price', 0)
        total = item.get('total', 0)
        message += f"  • {title} x{qty} — {price} ₽ = {total} ₽\n"
    
    message += f"\n💰 Итого: {total_amount} ₽\n"
    message += f"\n🔗 Открыть в админке: {admin_url}/admin/orders/{order_id}"
    
    return message

def send_telegram_message(bot_token: str, chat_ids: List[str], message: str) -> List[Dict[str, Any]]:
    results = []
    
    for chat_id in chat_ids:
        try:
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                'chat_id': chat_id,
                'text': message,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, json=payload, timeout=10)
            
            if response.status_code == 200:
                results.append({'chat_id': chat_id, 'success': True})
            else:
                results.append({
                    'chat_id': chat_id,
                    'success': False,
                    'error': response.text
                })
        except Exception as e:
            results.append({
                'chat_id': chat_id,
                'success': False,
                'error': str(e)
            })
    
    return results

def send_whatsapp_message(api_url: str, api_token: str, phone_ids: List[str], message: str) -> List[Dict[str, Any]]:
    results = []
    
    for phone_id in phone_ids:
        try:
            headers = {
                'Authorization': f'Bearer {api_token}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'phone': phone_id,
                'message': message
            }
            
            response = requests.post(api_url, json=payload, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                results.append({'phone_id': phone_id, 'success': True})
            else:
                results.append({
                    'phone_id': phone_id,
                    'success': False,
                    'error': response.text
                })
        except Exception as e:
            results.append({
                'phone_id': phone_id,
                'success': False,
                'error': str(e)
            })
    
    return results

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        notification_type = body.get('type')
        data = body.get('data', {})
        settings = body.get('settings', {})
        
        if notification_type not in ['application', 'order']:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid notification type'})
            }
        
        admin_url = settings.get('admin_url', 'https://example.com')
        
        if notification_type == 'application':
            message = format_application_message(data, admin_url)
        else:
            message = format_order_message(data, admin_url)
        
        results = {
            'telegram': [],
            'whatsapp': []
        }
        
        telegram_bot_token = settings.get('telegram_bot_token')
        telegram_chat_ids = settings.get('telegram_chat_ids', [])
        
        if telegram_bot_token and telegram_chat_ids:
            results['telegram'] = send_telegram_message(telegram_bot_token, telegram_chat_ids, message)
        
        whatsapp_enabled = settings.get('whatsapp_enabled', False)
        whatsapp_api_url = settings.get('whatsapp_api_url')
        whatsapp_api_token = settings.get('whatsapp_api_token')
        whatsapp_phone_ids = settings.get('whatsapp_phone_ids', [])
        
        if whatsapp_enabled and whatsapp_api_url and whatsapp_api_token and whatsapp_phone_ids:
            results['whatsapp'] = send_whatsapp_message(
                whatsapp_api_url,
                whatsapp_api_token,
                whatsapp_phone_ids,
                message
            )
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'results': results
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
