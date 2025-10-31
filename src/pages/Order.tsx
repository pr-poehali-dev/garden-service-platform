import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useOrder } from "@/contexts/OrderContext";
import { useOrderRequests } from "@/contexts/OrderRequestContext";
import { useToast } from "@/hooks/use-toast";

const APPLICATIONS_API = 'https://functions.poehali.dev/de9da4fe-5fbe-4e4b-a161-3951cdae2ccf';
const NOTIFICATIONS_API = 'https://functions.poehali.dev/1615fb67-bcc4-457c-8042-ea86dc601655';
const INTEGRATION_SETTINGS_API = 'https://functions.poehali.dev/bc7652a8-de62-4d98-92a3-bd77328cc08c';

const Order = () => {
  const { items, removeItem, clearOrder, getTotalPrice } = useOrder();
  const { addRequest } = useOrderRequests();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    messenger: "",
    comment: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const applicationItems = items.map(item => ({
        service_id: 0,
        title: `${item.name} (${item.category})`,
        qty: item.quantity,
        price: item.price,
        total: item.totalPrice
      }));

      const response = await fetch(APPLICATIONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          customer_comment: formData.comment,
          items: applicationItems,
          total_amount: getTotalPrice(),
          source: 'website'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const newApplication = await response.json();

      const settingsResponse = await fetch(INTEGRATION_SETTINGS_API);
      const settings = await settingsResponse.json();

      await fetch(NOTIFICATIONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'application',
          data: newApplication,
          settings
        })
      });

      const orderData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        messenger: formData.messenger || undefined,
        comment: formData.comment || undefined,
        services: items.map(item => ({
          name: item.name,
          category: item.category,
          price: item.price,
          unit: item.unit || '',
          quantity: item.quantity,
          totalPrice: item.totalPrice
        })),
        totalPrice: getTotalPrice()
      };

      addRequest(orderData);

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время"
      });

      clearOrder();
      navigate("/");
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/20">
        <div className="text-center">
          <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Ваша заявка пуста</h1>
          <p className="text-muted-foreground mb-6">Добавьте услуги для оформления заявки</p>
          <Link to="/services">
            <Button size="lg">
              Перейти к услугам
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="py-16 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Оформление заявки</h1>
          <p className="text-muted-foreground text-lg">Заполните контактные данные для отправки заявки</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ваше имя <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Адрес участка <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="г. Москва, ул. Примерная, д. 1"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Телефон <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Мессенджер (необязательно)
                      </label>
                      <Select value={formData.messenger} onValueChange={(value) => setFormData({ ...formData, messenger: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите мессенджер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Комментарий к заявке
                      </label>
                      <Textarea
                        placeholder="Дополнительные пожелания или вопросы..."
                        rows={4}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
                        {submitting ? (
                          <>
                            <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                            Отправка...
                          </>
                        ) : (
                          <>
                            Отправить заявку
                            <Icon name="Send" className="ml-2" size={18} />
                          </>
                        )}
                      </Button>
                      <Link to="/services">
                        <Button type="button" variant="outline" size="lg" disabled={submitting}>
                          Назад к услугам
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="border-2 border-primary sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileText" size={24} />
                    Состав заявки
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="border-b pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="ml-2 h-8 w-8 p-0"
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {item.quantity} {item.unit} × {item.price.toLocaleString()} ₽
                          </span>
                          <span className="font-bold">{item.totalPrice.toLocaleString()} ₽</span>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t-2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">Предварительная стоимость:</span>
                        <span className="text-2xl font-bold text-primary">{getTotalPrice().toLocaleString()} ₽</span>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <Icon name="Info" size={14} className="inline mr-1" />
                          Точная стоимость определяется после выезда специалиста и осмотра участка
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Order;