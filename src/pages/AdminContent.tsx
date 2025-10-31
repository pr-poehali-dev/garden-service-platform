import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

const AdminContent = () => {
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

  const contentSections = [
    {
      title: "Услуги",
      description: "Управление каталогом услуг, ценами и описаниями",
      icon: "Wrench",
      path: "/admin/content/services",
      color: "bg-green-500"
    },
    {
      title: "Портфолио / Посты",
      description: "Публикации, галереи работ и новости",
      icon: "Image",
      path: "/admin/content/posts",
      color: "bg-purple-500"
    },
    {
      title: "Наша команда",
      description: "Карточки сотрудников и контакты",
      icon: "Users",
      path: "/admin/content/team",
      color: "bg-orange-500"
    },
    {
      title: "Страница контактов",
      description: "Телефоны, адреса, реквизиты",
      icon: "MapPin",
      path: "/admin/content/contact",
      color: "bg-blue-500"
    },
    {
      title: "Главная страница",
      description: "Hero-блок, название сайта, SEO",
      icon: "Home",
      path: "/admin/content/homepage",
      color: "bg-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Управление контентом</h1>
            <p className="text-muted-foreground">Редактируйте тексты, цены и настройки сайта</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentSections.map((section) => (
            <Card key={section.path} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate(section.path)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${section.color} text-white mb-4`}>
                    <Icon name={section.icon as any} size={24} />
                  </div>
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактировать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminContent;