import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const INTEGRATION_SETTINGS_API = 'https://functions.poehali.dev/bc7652a8-de62-4d98-92a3-bd77328cc08c';

interface IntegrationSettings {
  id: number;
  telegram_bot_token: string | null;
  telegram_chat_ids: string[] | null;
  whatsapp_enabled: boolean;
  whatsapp_api_url: string | null;
  whatsapp_api_token: string | null;
  whatsapp_phone_ids: string[] | null;
  admin_url: string;
}

export default function AdminIntegrations() {
  const [settings, setSettings] = useState<IntegrationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatIds, setTelegramChatIds] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappApiUrl, setWhatsappApiUrl] = useState('');
  const [whatsappApiToken, setWhatsappApiToken] = useState('');
  const [whatsappPhoneIds, setWhatsappPhoneIds] = useState('');
  const [adminUrl, setAdminUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(INTEGRATION_SETTINGS_API);
      const data = await response.json();
      
      setSettings(data);
      setTelegramToken(data.telegram_bot_token || '');
      setTelegramChatIds(data.telegram_chat_ids?.join(', ') || '');
      setWhatsappEnabled(data.whatsapp_enabled || false);
      setWhatsappApiUrl(data.whatsapp_api_url || '');
      setWhatsappApiToken(data.whatsapp_api_token || '');
      setWhatsappPhoneIds(data.whatsapp_phone_ids?.join(', ') || '');
      setAdminUrl(data.admin_url || window.location.origin);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = {
        telegram_bot_token: telegramToken || null,
        telegram_chat_ids: telegramChatIds
          ? telegramChatIds.split(',').map(id => id.trim()).filter(Boolean)
          : [],
        whatsapp_enabled: whatsappEnabled,
        whatsapp_api_url: whatsappApiUrl || null,
        whatsapp_api_token: whatsappApiToken || null,
        whatsapp_phone_ids: whatsappPhoneIds
          ? whatsappPhoneIds.split(',').map(id => id.trim()).filter(Boolean)
          : [],
        admin_url: adminUrl || window.location.origin
      };

      const response = await fetch(INTEGRATION_SETTINGS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await fetchSettings();
        alert('Настройки сохранены!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Интеграции</h1>
          <p className="text-muted-foreground mt-2">
            Настройки уведомлений для Telegram и WhatsApp
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Send" size={24} />
            Telegram
          </CardTitle>
          <CardDescription>
            Настройка отправки уведомлений о заявках и заказах в Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegram-token">Bot Token</Label>
            <Input
              id="telegram-token"
              type="password"
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Получите токен у <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline">@BotFather</a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegram-chats">ID чатов/групп (через запятую)</Label>
            <Textarea
              id="telegram-chats"
              placeholder="-1001234567890, -1009876543210"
              value={telegramChatIds}
              onChange={(e) => setTelegramChatIds(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Добавьте бота в группу и используйте <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="underline">@userinfobot</a> для получения ID
            </p>
          </div>

          {telegramToken && telegramChatIds && (
            <Badge variant="outline" className="gap-1">
              <Icon name="CheckCircle" size={14} />
              Telegram настроен
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageCircle" size={24} />
            WhatsApp
          </CardTitle>
          <CardDescription>
            Настройка отправки уведомлений через WhatsApp API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="whatsapp-enabled"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="whatsapp-enabled">Включить WhatsApp уведомления</Label>
          </div>

          {whatsappEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="whatsapp-url">API URL</Label>
                <Input
                  id="whatsapp-url"
                  type="url"
                  placeholder="https://api.whatsapp.com/send"
                  value={whatsappApiUrl}
                  onChange={(e) => setWhatsappApiUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">API Token</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  placeholder="your_api_token"
                  value={whatsappApiToken}
                  onChange={(e) => setWhatsappApiToken(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-phones">Телефоны/ID (через запятую)</Label>
                <Textarea
                  id="whatsapp-phones"
                  placeholder="79001234567, 79009876543"
                  value={whatsappPhoneIds}
                  onChange={(e) => setWhatsappPhoneIds(e.target.value)}
                  rows={3}
                />
              </div>

              {whatsappApiUrl && whatsappApiToken && whatsappPhoneIds && (
                <Badge variant="outline" className="gap-1">
                  <Icon name="CheckCircle" size={14} />
                  WhatsApp настроен
                </Badge>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Link" size={24} />
            URL админ-панели
          </CardTitle>
          <CardDescription>
            Используется для формирования ссылок в уведомлениях
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-url">Базовый URL</Label>
            <Input
              id="admin-url"
              type="url"
              placeholder={window.location.origin}
              value={adminUrl}
              onChange={(e) => setAdminUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Текущий: {window.location.origin}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
