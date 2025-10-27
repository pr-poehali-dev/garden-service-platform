import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderRequests, OrderRequest } from "@/contexts/OrderRequestContext";
import { useToast } from "@/hooks/use-toast";

const AdminOrders = () => {
  const { isAdmin, logout } = useAuth();
  const { requests, updateStatus, deleteRequest } = useOrderRequests();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Выход выполнен",
      description: "До скорой встречи!"
    });
  };

  const handleStatusChange = (id: string, status: OrderRequest['status']) => {
    updateStatus(id, status);
    toast({
      title: "Статус обновлён",
      description: `Заявка переведена в статус "${getStatusLabel(status)}"`
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить эту заявку?")) {
      deleteRequest(id);
      toast({
        title: "Заявка удалена",
        description: "Заявка успешно удалена из системы"
      });
    }
  };

  const getStatusLabel = (status: OrderRequest['status']) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'processing': return 'В работе';
      case 'completed': return 'Завершена';
    }
  };

  const getStatusColor = (status: OrderRequest['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sendToWhatsApp = (request: OrderRequest) => {
    const message = `🌳 *Новая заявка Тимирязевец*\n\n` +
      `👤 Имя: ${request.name}\n` +
      `📍 Адрес: ${request.address}\n` +
      `📞 Телефон: ${request.phone}\n` +
      `${request.messenger ? `💬 Мессенджер: ${request.messenger}\n` : ''}` +
      `${request.comment ? `📝 Комментарий: ${request.comment}\n` : ''}` +
      `\n*Услуги:*\n` +
      `${request.services.map(s => `• ${s.name} - ${s.price} ₽`).join('\n')}\n` +
      `\n💰 *Итого: ${request.totalPrice.toLocaleString()} ₽*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const sendToTelegram = (request: OrderRequest) => {
    const message = `🌳 Новая заявка Тимирязевец\n\n` +
      `👤 Имя: ${request.name}\n` +
      `📍 Адрес: ${request.address}\n` +
      `📞 Телефон: ${request.phone}\n` +
      `${request.messenger ? `💬 Мессенджер: ${request.messenger}\n` : ''}` +
      `${request.comment ? `📝 Комментарий: ${request.comment}\n` : ''}` +
      `\nУслуги:\n` +
      `${request.services.map(s => `• ${s.name} - ${s.price} ₽`).join('\n')}\n` +
      `\n💰 Итого: ${request.totalPrice.toLocaleString()} ₽`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://t.me/share/url?text=${encodedMessage}`, '_blank');
  };

  if (!isAdmin) {
    return null;
  }

  const newRequests = requests.filter(r => r.status === 'new');
  const processingRequests = requests.filter(r => r.status === 'processing');
  const completedRequests = requests.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="py-12 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Заявки</h1>
              <p className="text-muted-foreground">Управление заявками клиентов</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="lg">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Link to="/admin">
              <Button variant="outline">
                <Icon name="ArrowLeft" className="mr-2" size={18} />
                К портфолио
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Новые
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{newRequests.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  В работе
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{processingRequests.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Завершено
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{completedRequests.length}</p>
              </CardContent>
            </Card>
          </div>

          {requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-20">
                <Icon name="Inbox" size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">Заявок пока нет</h2>
                <p className="text-muted-foreground">Здесь будут отображаться заявки от клиентов</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">{request.name}</CardTitle>
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </div>
                        <CardDescription>{formatDate(request.date)}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendToWhatsApp(request)}
                          title="Отправить в WhatsApp"
                        >
                          <Icon name="MessageCircle" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendToTelegram(request)}
                          title="Отправить в Telegram"
                        >
                          <Icon name="Send" size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(request.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Icon name="MapPin" size={18} className="text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Адрес</p>
                            <p className="font-semibold">{request.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <Icon name="Phone" size={18} className="text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Телефон</p>
                            <p className="font-semibold">{request.phone}</p>
                          </div>
                        </div>

                        {request.messenger && (
                          <div className="flex items-start gap-2">
                            <Icon name="MessageSquare" size={18} className="text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Мессенджер</p>
                              <p className="font-semibold capitalize">{request.messenger}</p>
                            </div>
                          </div>
                        )}

                        {request.comment && (
                          <div className="flex items-start gap-2">
                            <Icon name="FileText" size={18} className="text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Комментарий</p>
                              <p className="font-semibold">{request.comment}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Состав заявки</p>
                        <div className="space-y-2 mb-4">
                          {request.services.map((service, idx) => (
                            <div key={idx} className="flex justify-between text-sm border-b pb-2">
                              <span>{service.name}</span>
                              <span className="font-semibold">{service.price.toLocaleString()} ₽</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t-2">
                          <span className="font-bold">Итого:</span>
                          <span className="text-2xl font-bold text-primary">{request.totalPrice.toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Button
                        size="sm"
                        variant={request.status === 'new' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(request.id, 'new')}
                      >
                        Новая
                      </Button>
                      <Button
                        size="sm"
                        variant={request.status === 'processing' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(request.id, 'processing')}
                      >
                        В работе
                      </Button>
                      <Button
                        size="sm"
                        variant={request.status === 'completed' ? 'default' : 'outline'}
                        onClick={() => handleStatusChange(request.id, 'completed')}
                      >
                        Завершена
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrders;
