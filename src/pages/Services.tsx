import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: "TreeDeciduous",
      title: "Уход за зелёными насаждениями",
      description: "Профессиональный уход за деревьями и кустарниками",
      features: [
        "Санитарная и формирующая обрезка",
        "Омолаживающая обрезка",
        "Кронирование деревьев",
        "Топиарная стрижка кустарников",
        "Прививка и перепрививка",
        "Валка и выкорчёвывание"
      ],
      price: "от 1 500 ₽"
    },
    {
      icon: "Bug",
      title: "Обработка растений и участка",
      description: "Защита от вредителей и болезней",
      features: [
        "Обработка от вредителей и болезней",
        "Внекорневая подкормка",
        "Обработка от клещей и комаров",
        "Борьба с грызунами",
        "Дезинфекция теплиц",
        "Обработка газона гербицидами"
      ],
      price: "от 2 000 ₽"
    },
    {
      icon: "Sprout",
      title: "Газоны и почва",
      description: "Создание и уход за идеальным газоном",
      features: [
        "Стрижка газона",
        "Устройство посевного газона",
        "Укладка рулонного газона",
        "Аэрация и вертикуляция",
        "Подкормка и мульчирование",
        "Ремонт газона"
      ],
      price: "от 800 ₽"
    },
    {
      icon: "Flower2",
      title: "Посадочные работы",
      description: "Посадка деревьев, кустарников и цветов",
      features: [
        "Посадка деревьев и крупномеров",
        "Посадка кустарников",
        "Посадка цветов и рассады",
        "Пересадка растений",
        "Подготовка клумб и грядок",
        "Внесение удобрений"
      ],
      price: "от 1 000 ₽"
    },
    {
      icon: "Home",
      title: "Благоустройство и ландшафт",
      description: "Создание уникального ландшафта",
      features: [
        "Ландшафтное проектирование",
        "Озеленение участка",
        "Устройство цветников и альпийских горок",
        "Система автополива",
        "Ландшафтное освещение",
        "Фитодизайн"
      ],
      price: "от 15 000 ₽"
    },
    {
      icon: "Trash2",
      title: "Уборка участка",
      description: "Поддержание чистоты и порядка",
      features: [
        "Покос травы",
        "Уборка листвы",
        "Утилизация веток",
        "Измельчение отходов",
        "Вывоз мусора",
        "Очистка дорожек"
      ],
      price: "от 600 ₽"
    },
    {
      icon: "Snowflake",
      title: "Зимнее обслуживание",
      description: "Уход за участком в холодное время года",
      features: [
        "Уборка снега (ручная и механическая)",
        "Обработка дорожек от льда",
        "Чистка крыш от снега",
        "Защита растений на зиму",
        "Удаление сосулек",
        "Абонементное обслуживание"
      ],
      price: "от 1 200 ₽"
    },
    {
      icon: "Calendar",
      title: "Комплексное обслуживание",
      description: "Годовое обслуживание участка",
      features: [
        "Индивидуальный план ухода",
        "Регулярные выезды",
        "Сезонные работы",
        "Консультации агронома",
        "Скидка до 30%",
        "Приоритетное обслуживание"
      ],
      price: "от 25 000 ₽/мес"
    }
  ];

  const workProcess = [
    { step: "01", title: "Консультация", desc: "Выезд на участок и оценка объёма работ" },
    { step: "02", title: "План работ", desc: "Составление индивидуального плана" },
    { step: "03", title: "Согласование", desc: "Утверждение сроков и стоимости" },
    { step: "04", title: "Выполнение", desc: "Профессиональное проведение работ" },
    { step: "05", title: "Контроль", desc: "Приёмка и гарантия качества" }
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
              Полный спектр садовых работ и ландшафтного обслуживания для вашего участка
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
            Прозрачный процесс от заявки до идеального результата
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

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-3xl text-center mb-2">
                  Почему выбирают нас?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Award" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Опыт более 10 лет</h3>
                      <p className="text-sm text-muted-foreground">Выполнили более 500 проектов</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Users" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Профильное образование</h3>
                      <p className="text-sm text-muted-foreground">Все специалисты — дипломированные агрономы</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Гарантия качества</h3>
                      <p className="text-sm text-muted-foreground">Гарантия на все виды работ до 2 лет</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Wrench" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Своё оборудование</h3>
                      <p className="text-sm text-muted-foreground">Современная техника и инструменты</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Нужна консультация?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Оставьте заявку на бесплатный выезд специалиста для оценки участка
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Вызвать специалиста
              <Icon name="Phone" className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
