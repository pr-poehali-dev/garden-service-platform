import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const APPLICATIONS_API = 'https://functions.poehali.dev/de9da4fe-5fbe-4e4b-a161-3951cdae2ccf';
const ORDERS_API = 'https://functions.poehali.dev/867beb5a-feac-4824-89d3-833dad3ae275';
const NOTIFICATIONS_API = 'https://functions.poehali.dev/1615fb67-bcc4-457c-8042-ea86dc601655';
const INTEGRATION_SETTINGS_API = 'https://functions.poehali.dev/bc7652a8-de62-4d98-92a3-bd77328cc08c';

interface ApplicationItem {
  service_id: number;
  title: string;
  qty: number;
  price: number;
  total: number;
}

interface Application {
  id: number;
  number: string;
  created_at: string;
  status: 'new' | 'approved' | 'closed' | 'converted_to_order';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_comment: string;
  items: ApplicationItem[];
  total_amount: number;
  source: string;
  notes: string | null;
}

interface ApplicationModalProps {
  application: Application;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function ApplicationModal({ application, open, onClose, onUpdated }: ApplicationModalProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  
  const [customerName, setCustomerName] = useState(application.customer_name);
  const [customerPhone, setCustomerPhone] = useState(application.customer_phone);
  const [customerAddress, setCustomerAddress] = useState(application.customer_address);
  const [customerComment, setCustomerComment] = useState(application.customer_comment);
  const [items, setItems] = useState<ApplicationItem[]>(application.items);
  const [notes, setNotes] = useState(application.notes || '');

  useEffect(() => {
    setCustomerName(application.customer_name);
    setCustomerPhone(application.customer_phone);
    setCustomerAddress(application.customer_address);
    setCustomerComment(application.customer_comment);
    setItems(application.items);
    setNotes(application.notes || '');
  }, [application]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleUpdateItem = (index: number, field: keyof ApplicationItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'qty' || field === 'price') {
      newItems[index].total = newItems[index].qty * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([...items, {
      service_id: 0,
      title: 'Новая услуга',
      qty: 1,
      price: 0,
      total: 0
    }]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`${APPLICATIONS_API}/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          customer_comment: customerComment,
          items: items,
          total_amount: calculateTotal(),
          notes: notes
        })
      });

      if (response.ok) {
        setEditing(false);
        onUpdated();
        alert('Заявка обновлена');
      } else {
        throw new Error('Failed to update application');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Ошибка при обновлении заявки');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`${APPLICATIONS_API}/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (response.ok) {
        onUpdated();
        alert('Заявка согласована');
      } else {
        throw new Error('Failed to approve application');
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      alert('Ошибка при согласовании заявки');
    } finally {
      setSaving(false);
    }
  };

  const sendNotification = async (type: 'application' | 'order', data: any) => {
    try {
      const settingsResponse = await fetch(INTEGRATION_SETTINGS_API);
      const settings = await settingsResponse.json();
      
      await fetch(NOTIFICATIONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data,
          settings
        })
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleCreateOrder = async () => {
    if (application.status !== 'approved') {
      alert('Заявка должна быть согласована перед созданием заказа');
      return;
    }

    try {
      setCreatingOrder(true);
      
      const response = await fetch(ORDERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_application_id: application.id
        })
      });

      if (response.ok) {
        const newOrder = await response.json();
        
        await sendNotification('order', newOrder);
        
        onUpdated();
        onClose();
        alert(`Заказ ${newOrder.number} создан!`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Ошибка при создании заказа: ' + (error as Error).message);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Заявка {application.number}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(application.created_at).toLocaleString('ru-RU')}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Badge variant={application.status === 'new' ? 'default' : 'secondary'}>
              {application.status === 'new' && 'Новая'}
              {application.status === 'approved' && 'Согласована'}
              {application.status === 'closed' && 'Закрыта'}
              {application.status === 'converted_to_order' && 'В заказе'}
            </Badge>
            {application.status === 'new' && (
              <Button onClick={handleApprove} disabled={saving} size="sm">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Согласовать
              </Button>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Данные клиента</h3>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Имя</Label>
                {editing ? (
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{customerName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Телефон</Label>
                {editing ? (
                  <Input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{customerPhone}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Адрес</Label>
                {editing ? (
                  <Input
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{customerAddress || '—'}</p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Комментарий</Label>
                {editing ? (
                  <Textarea
                    value={customerComment}
                    onChange={(e) => setCustomerComment(e.target.value)}
                    rows={2}
                  />
                ) : (
                  <p className="p-2 bg-muted rounded">{customerComment || '—'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Состав заявки</h3>
              {editing && (
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить услугу
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  {editing ? (
                    <>
                      <Input
                        className="flex-1"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                        placeholder="Название"
                      />
                      <Input
                        className="w-20"
                        type="number"
                        value={item.qty}
                        onChange={(e) => handleUpdateItem(index, 'qty', Number(e.target.value))}
                        min="1"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        className="w-28"
                        type="number"
                        value={item.price}
                        onChange={(e) => handleUpdateItem(index, 'price', Number(e.target.value))}
                        min="0"
                      />
                      <span className="text-muted-foreground">=</span>
                      <span className="w-28 text-right font-medium">
                        {item.total.toLocaleString('ru-RU')} ₽
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span>{item.title}</span>
                      <span className="text-muted-foreground">
                        {item.qty} × {item.price.toLocaleString('ru-RU')} ₽ = {item.total.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-semibold text-lg">Итого:</span>
              <span className="font-bold text-xl">{calculateTotal().toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-4">Заметки</h3>
            {editing ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Внутренние заметки..."
                rows={3}
              />
            ) : (
              <p className="p-2 bg-muted rounded">{notes || 'Нет заметок'}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            {editing ? (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                {application.status === 'approved' && (
                  <Button onClick={handleCreateOrder} disabled={creatingOrder}>
                    {creatingOrder ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Создать заказ
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
