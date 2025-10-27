import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: "TreeDeciduous",
      title: "Уход за зелёными насаждениями",
      description: "Профессиональный уход за деревьями и кустарниками",
      slug: "green-care"
    },
    {
      icon: "Bug",
      title: "Обработка растений и участка",
      description: "Защита от вредителей и болезней",
      slug: "treatment"
    },
    {
      icon: "Sprout",
      title: "Газоны и почва",
      description: "Создание и уход за идеальным газоном",
      slug: "lawn"
    },
    {
      icon: "Flower2",
      title: "Посадочные работы",
      description: "Посадка деревьев, кустарников и цветов",
      slug: "planting"
    },
    {
      icon: "Home",
      title: "Благоустройство и ландшафт",
      description: "Создание уникального ландшафта",
      slug: "landscape"
    },
    {
      icon: "Trash2",
      title: "Уборка участка",
      description: "Поддержание чистоты и порядка",
      slug: "cleaning"
    },
    {
      icon: "Snowflake",
      title: "Зимнее обслуживание",
      description: "Уход за участком в холодное время года",
      slug: "winter"
    },
    {
      icon: "Calendar",
      title: "Комплексное обслуживание",
      description: "Годовое обслуживание участка",
      slug: "complex"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Услуги и цены
            </h1>
            <p className="text-xl text-muted-foreground">
              Выберите категорию услуг для просмотра цен и добавления в заявку
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link key={index} to={`/services/${service.slug}`}>
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="w-16 h-16 mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon name={service.icon} className="text-primary" size={32} />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-semibold">
                      Смотреть услуги
                      <Icon name="ArrowRight" className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
