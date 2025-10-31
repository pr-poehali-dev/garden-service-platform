import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

const ORDERS_API = 'https://functions.poehali.dev/867beb5a-feac-4824-89d3-833dad3ae275';

interface OrderItem {
  service_id: number;
  title: string;
  qty: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  number: string;
  from_application_id: number | null;
  created_at: string;
  status: 'active' | 'in_progress' | 'completed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_comment: string;
  items: OrderItem[];
  total_amount: number;
  notes: string | null;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Активный', variant: 'default' },
  in_progress: { label: 'В работе', variant: 'secondary' },
  completed: { label: 'Завершён', variant: 'outline' },
  cancelled: { label: 'Отменён', variant: 'destructive' }
};

export default function AdminOrdersNew() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(ORDERS_API);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`${ORDERS_API}/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
        alert('Статус заказа обновлён');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.number.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.customer_phone.toLowerCase().includes(searchLower)
    );
  });

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
          <h1 className="text-3xl font-bold">Заказы</h1>
          <p className="text-muted-foreground mt-2">
            Управление заказами
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру, имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={fetchOrders} variant="outline">
          <Icon name="RefreshCw" size={18} className="mr-2" />
          Обновить
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">№</th>
                <th className="text-left p-4 font-medium">Дата</th>
                <th className="text-left p-4 font-medium">Клиент</th>
                <th className="text-left p-4 font-medium">Телефон</th>
                <th className="text-right p-4 font-medium">Сумма</th>
                <th className="text-center p-4 font-medium">Статус</th>
                <th className="text-center p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    {searchQuery ? 'Заказы не найдены' : 'Нет заказов'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 font-mono text-sm">{order.number}</td>
                    <td className="p-4">
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4">{order.customer_phone}</td>
                    <td className="p-4 text-right font-medium">
                      {Number(order.total_amount).toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={statusLabels[order.status]?.variant || 'default'}>
                        {statusLabels[order.status]?.label || order.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <select
                        className="px-3 py-1 border rounded text-sm"
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleUpdateStatus(order.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="active">Активный</option>
                        <option value="in_progress">В работе</option>
                        <option value="completed">Завершён</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Заказ {selectedOrder.number}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Данные клиента</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Имя:</span>
                    <span className="font-medium">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Телефон:</span>
                    <span className="font-medium">{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_address && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Адрес:</span>
                      <span className="font-medium">{selectedOrder.customer_address}</span>
                    </div>
                  )}
                  {selectedOrder.customer_comment && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Комментарий:</span>
                      <span className="font-medium">{selectedOrder.customer_comment}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Состав заказа</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span>{item.title}</span>
                      <span className="text-muted-foreground">
                        {item.qty} × {item.price.toLocaleString('ru-RU')} ₽ = {item.total.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold text-lg">Итого:</span>
                  <span className="font-bold text-xl">{Number(selectedOrder.total_amount).toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Заметки</h3>
                  <p className="text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
