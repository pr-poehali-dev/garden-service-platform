import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderRequests } from "@/contexts/OrderRequestContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const { requests } = useOrderRequests();
  const { posts } = usePortfolio();
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

  if (!isAdmin) {
    return null;
  }

  const newOrdersCount = requests.filter(r => r.status === 'new').length;

  const menuItems = [
    {
      title: "Заявки",
      description: "Новые заявки с сайта",
      icon: "Inbox",
      path: "/admin/applications",
      badge: newOrdersCount > 0 ? newOrdersCount : null,
      color: "bg-blue-500"
    },
    {
      title: "Заказы",
      description: "Согласованные заказы",
      icon: "ShoppingCart",
      path: "/admin/orders-new",
      badge: null,
      color: "bg-green-500"
    },
    {
      title: "Интеграции",
      description: "Telegram и WhatsApp уведомления",
      icon: "Bell",
      path: "/admin/integrations",
      badge: null,
      color: "bg-purple-500"
    },
    {
      title: "Контент",
      description: "Управление всем контентом сайта",
      icon: "FileText",
      path: "/admin/content",
      badge: null,
      color: "bg-indigo-500"
    },
    {
      title: "Портфолио",
      description: `Управление постами (${posts.length})`,
      icon: "Image",
      path: "/admin/portfolio",
      badge: null,
      color: "bg-purple-500"
    },
    {
      title: "Услуги и цены",
      description: "Редактирование услуг и категорий",
      icon: "Briefcase",
      path: "/admin/services",
      badge: null,
      color: "bg-green-500"
    },
    {
      title: "Наша команда",
      description: "Управление карточками сотрудников",
      icon: "Users",
      path: "/admin/team",
      badge: null,
      color: "bg-teal-500"
    },
    {
      title: "Контакты",
      description: "Редактирование контактной информации",
      icon: "Phone",
      path: "/admin/contacts",
      badge: null,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="py-16 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Админ-панель</h1>
              <p className="text-muted-foreground text-lg">Управление сайтом Тимирязевец</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="lg">
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon name={item.icon} className="text-white" size={28} />
                      </div>
                      {item.badge && (
                        <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-semibold">
                      Перейти
                      <Icon name="ArrowRight" className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Info" size={24} />
                  Быстрая статистика
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-500">{requests.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Всего заявок</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-500">{posts.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">Постов в портфолио</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-3xl font-bold text-green-500">8</p>
                    <p className="text-sm text-muted-foreground mt-1">Категорий услуг</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-3xl font-bold text-orange-500">{newOrdersCount}</p>
                    <p className="text-sm text-muted-foreground mt-1">Новых заявок</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;