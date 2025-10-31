import { useState, useEffect } from 'react';
import { useAdminContent } from '@/contexts/AdminContentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminContentContact() {
  const { contactPage, fetchContactPage, updateContactPage, loading } = useAdminContent();
  
  const [phones, setPhones] = useState<string[]>([]);
  const [newPhone, setNewPhone] = useState('');
  const [messengers, setMessengers] = useState({ whatsapp: '', telegram: '', viber: '' });
  const [address, setAddress] = useState('');
  const [mapEmbed, setMapEmbed] = useState('');
  const [socials, setSocials] = useState({ vk: '', instagram: '', facebook: '' });
  const [requisites, setRequisites] = useState({ inn: '', ogrn: '', legal_address: '', bank_details: '' });

  useEffect(() => {
    fetchContactPage();
  }, []);

  useEffect(() => {
    if (contactPage) {
      setPhones(contactPage.phones || []);
      setMessengers(contactPage.messengers || { whatsapp: '', telegram: '', viber: '' });
      setAddress(contactPage.address || '');
      setMapEmbed(contactPage.map_embed || '');
      setSocials(contactPage.socials || { vk: '', instagram: '', facebook: '' });
      setRequisites(contactPage.requisites || { inn: '', ogrn: '', legal_address: '', bank_details: '' });
    }
  }, [contactPage]);

  const handleSave = async () => {
    await updateContactPage({
      phones,
      messengers,
      address,
      map_embed: mapEmbed,
      socials,
      requisites
    });
  };

  const handleAddPhone = () => {
    if (newPhone.trim()) {
      setPhones([...phones, newPhone.trim()]);
      setNewPhone('');
    }
  };

  const handleRemovePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Страница контактов</h1>
              <p className="text-muted-foreground mt-2">
                Управление контактной информацией
              </p>
            </div>
            <Button onClick={handleSave}>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </Button>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Телефоны</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="+7 (999) 123-45-67"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPhone()}
              />
              <Button onClick={handleAddPhone}>
                <Icon name="Plus" size={18} />
              </Button>
            </div>
            <div className="space-y-2">
              {phones.map((phone, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded">
                  <span>{phone}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleRemovePhone(idx)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Мессенджеры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>WhatsApp</Label>
              <Input
                placeholder="+79991234567"
                value={messengers.whatsapp}
                onChange={(e) => setMessengers({ ...messengers, whatsapp: e.target.value })}
              />
            </div>
            <div>
              <Label>Telegram</Label>
              <Input
                placeholder="@username"
                value={messengers.telegram}
                onChange={(e) => setMessengers({ ...messengers, telegram: e.target.value })}
              />
            </div>
            <div>
              <Label>Viber</Label>
              <Input
                placeholder="+79991234567"
                value={messengers.viber}
                onChange={(e) => setMessengers({ ...messengers, viber: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Адрес</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Физический адрес</Label>
              <Textarea
                placeholder="Москва, ул. Примерная, д. 1"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Код карты (iframe embed)</Label>
              <Textarea
                placeholder='<iframe src="..." width="600" height="450"></iframe>'
                value={mapEmbed}
                onChange={(e) => setMapEmbed(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Социальные сети</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>ВКонтакте</Label>
              <Input
                placeholder="https://vk.com/..."
                value={socials.vk}
                onChange={(e) => setSocials({ ...socials, vk: e.target.value })}
              />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input
                placeholder="https://instagram.com/..."
                value={socials.instagram}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
              />
            </div>
            <div>
              <Label>Facebook</Label>
              <Input
                placeholder="https://facebook.com/..."
                value={socials.facebook}
                onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Реквизиты</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>ИНН</Label>
              <Input
                placeholder="1234567890"
                value={requisites.inn}
                onChange={(e) => setRequisites({ ...requisites, inn: e.target.value })}
              />
            </div>
            <div>
              <Label>ОГРН</Label>
              <Input
                placeholder="1234567890123"
                value={requisites.ogrn}
                onChange={(e) => setRequisites({ ...requisites, ogrn: e.target.value })}
              />
            </div>
            <div>
              <Label>Юридический адрес</Label>
              <Textarea
                placeholder="Юридический адрес организации"
                value={requisites.legal_address}
                onChange={(e) => setRequisites({ ...requisites, legal_address: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Банковские реквизиты</Label>
              <Textarea
                placeholder="Банк, БИК, р/с, к/с"
                value={requisites.bank_details}
                onChange={(e) => setRequisites({ ...requisites, bank_details: e.target.value })}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
}