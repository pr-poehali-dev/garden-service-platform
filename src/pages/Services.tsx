import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: "Palette",
      title: "Брендинг и айдентика",
      description: "Разработка фирменного стиля, логотипа и брендбука",
      features: [
        "Разработка логотипа",
        "Фирменный стиль",
        "Брендбук",
        "Гайдлайны"
      ],
      price: "от 50 000 ₽"
    },
    {
      icon: "Layout",
      title: "Веб-дизайн",
      description: "Создание современных и функциональных сайтов",
      features: [
        "Дизайн лендинга",
        "Корпоративный сайт",
        "Интернет-магазин",
        "Адаптивная верстка"
      ],
      price: "от 80 000 ₽"
    },
    {
      icon: "Smartphone",
      title: "Мобильные приложения",
      description: "UX/UI дизайн для iOS и Android платформ",
      features: [
        "Прототипирование",
        "UI дизайн",
        "Анимации",
        "Design System"
      ],
      price: "от 120 000 ₽"
    },
    {
      icon: "Paintbrush",
      title: "Графический дизайн",
      description: "Создание рекламных материалов и иллюстраций",
      features: [
        "Баннеры и реклама",
        "Иллюстрации",
        "Презентации",
        "Печатная продукция"
      ],
      price: "от 15 000 ₽"
    },
    {
      icon: "TrendingUp",
      title: "Маркетинг и SMM",
      description: "Продвижение бренда в цифровой среде",
      features: [
        "Стратегия продвижения",
        "Контент-план",
        "Ведение соцсетей",
        "Таргетированная реклама"
      ],
      price: "от 40 000 ₽/мес"
    },
    {
      icon: "Video",
      title: "Видеопродакшн",
      description: "Создание рекламных и презентационных роликов",
      features: [
        "Съемка видео",
        "Монтаж",
        "Моушн-дизайн",
        "3D анимация"
      ],
      price: "от 100 000 ₽"
    }
  ];

  const workProcess = [
    { step: "01", title: "Брифинг", desc: "Изучаем вашу задачу и цели" },
    { step: "02", title: "Исследование", desc: "Анализируем рынок и конкурентов" },
    { step: "03", title: "Концепция", desc: "Предлагаем креативное решение" },
    { step: "04", title: "Разработка", desc: "Воплощаем идею в жизнь" },
    { step: "05", title: "Презентация", desc: "Передаем готовый проект" }
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
              Предлагаем полный спектр услуг для развития вашего бизнеса в цифровой среде
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name={service.icon} className="text-primary" size={28} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="Check" className="text-primary mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <p className="text-2xl font-bold text-primary">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Как мы работаем
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Прозрачный процесс от идеи до результата
          </p>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {workProcess.map((item, index) => (
                <div 
                  key={index}
                  className="text-center animate-scale-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Нужна консультация?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Оставьте заявку, и мы свяжемся с вами в течение часа
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Получить консультацию
              <Icon name="Phone" className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
