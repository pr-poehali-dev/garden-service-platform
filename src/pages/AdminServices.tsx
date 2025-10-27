import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

const AdminServices = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const categories = [
    { name: "Уход за зелёными насаждениями", icon: "TreeDeciduous", servicesCount: 8 },
    { name: "Обработка растений и участка", icon: "Bug", servicesCount: 8 },
    { name: "Газоны и почва", icon: "Sprout", servicesCount: 8 },
    { name: "Посадочные работы", icon: "Flower2", servicesCount: 8 },
    { name: "Благоустройство и ландшафт", icon: "Home", servicesCount: 8 },
    { name: "Уборка участка", icon: "Trash2", servicesCount: 8 },
    { name: "Зимнее обслуживание", icon: "Snowflake", servicesCount: 8 },
    { name: "Комплексное обслуживание", icon: "Calendar", servicesCount: 8 }
  ];

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="py-12 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад в админ-панель
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
              <Icon name="Briefcase" className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Редактирование услуг</h1>
              <p className="text-muted-foreground">Управление категориями и ценами услуг</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Категории услуг</CardTitle>
              <CardDescription>8 категорий с детальными услугами и ценами</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={category.icon} className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.servicesCount} услуг</p>
                    </div>
                    <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Icon name="Info" size={24} />
                В разработке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Функционал редактирования услуг и цен находится в разработке. 
                Сейчас услуги настраиваются напрямую в коде файла <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">src/pages/ServiceCategory.tsx</code>
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                В следующих версиях здесь будет полноценный интерфейс для:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>Добавления новых категорий услуг</li>
                <li>Редактирования названий и цен</li>
                <li>Удаления и изменения порядка услуг</li>
                <li>Управления единицами измерения</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminServices;
