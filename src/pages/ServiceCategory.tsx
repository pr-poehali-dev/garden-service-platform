import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useOrder } from "@/contexts/OrderContext";
import { useState } from "react";

interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
}

interface CategoryData {
  title: string;
  icon: string;
  services: Service[];
}

const ServiceCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { items, addItem, removeItem } = useOrder();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const categoriesData: Record<string, CategoryData> = {
    "green-care": {
      title: "Уход за зелёными насаждениями",
      icon: "TreeDeciduous",
      services: [
        { id: "gc1", name: "Санитарная обрезка дерева", price: 1500, unit: "дерево" },
        { id: "gc2", name: "Формирующая обрезка дерева", price: 2000, unit: "дерево" },
        { id: "gc3", name: "Омолаживающая обрезка", price: 2500, unit: "дерево" },
        { id: "gc4", name: "Кронирование дерева", price: 3000, unit: "дерево" },
        { id: "gc5", name: "Топиарная стрижка кустарника", price: 800, unit: "куст" },
        { id: "gc6", name: "Прививка растений", price: 1200, unit: "шт" },
        { id: "gc7", name: "Валка дерева", price: 4000, unit: "дерево" },
        { id: "gc8", name: "Выкорчёвывание пня", price: 2000, unit: "пень" }
      ]
    },
    "treatment": {
      title: "Обработка растений и участка",
      icon: "Bug",
      services: [
        { id: "tr1", name: "Обработка от вредителей", price: 2000, unit: "сотка" },
        { id: "tr2", name: "Обработка от болезней", price: 2000, unit: "сотка" },
        { id: "tr3", name: "Внекорневая подкормка", price: 1500, unit: "сотка" },
        { id: "tr4", name: "Обработка от клещей", price: 2500, unit: "сотка" },
        { id: "tr5", name: "Обработка от комаров", price: 2000, unit: "сотка" },
        { id: "tr6", name: "Борьба с грызунами", price: 3000, unit: "участок" },
        { id: "tr7", name: "Дезинфекция теплицы", price: 1500, unit: "теплица" },
        { id: "tr8", name: "Гербицидная обработка газона", price: 1800, unit: "сотка" }
      ]
    },
    "lawn": {
      title: "Газоны и почва",
      icon: "Sprout",
      services: [
        { id: "lw1", name: "Стрижка газона", price: 800, unit: "сотка" },
        { id: "lw2", name: "Устройство посевного газона", price: 5000, unit: "сотка" },
        { id: "lw3", name: "Укладка рулонного газона", price: 12000, unit: "сотка" },
        { id: "lw4", name: "Аэрация газона", price: 1200, unit: "сотка" },
        { id: "lw5", name: "Вертикуляция газона", price: 1500, unit: "сотка" },
        { id: "lw6", name: "Подкормка газона", price: 1000, unit: "сотка" },
        { id: "lw7", name: "Мульчирование почвы", price: 2000, unit: "сотка" },
        { id: "lw8", name: "Ремонт газона", price: 3000, unit: "участок" }
      ]
    },
    "planting": {
      title: "Посадочные работы",
      icon: "Flower2",
      services: [
        { id: "pl1", name: "Посадка дерева (до 2м)", price: 1000, unit: "дерево" },
        { id: "pl2", name: "Посадка крупномера", price: 5000, unit: "дерево" },
        { id: "pl3", name: "Посадка кустарника", price: 600, unit: "куст" },
        { id: "pl4", name: "Посадка цветов", price: 300, unit: "м²" },
        { id: "pl5", name: "Посадка рассады", price: 50, unit: "шт" },
        { id: "pl6", name: "Пересадка растений", price: 800, unit: "растение" },
        { id: "pl7", name: "Подготовка клумбы", price: 2000, unit: "клумба" },
        { id: "pl8", name: "Внесение удобрений", price: 1200, unit: "сотка" }
      ]
    },
    "landscape": {
      title: "Благоустройство и ландшафт",
      icon: "Home",
      services: [
        { id: "ls1", name: "Ландшафтный проект", price: 15000, unit: "проект" },
        { id: "ls2", name: "Озеленение участка", price: 25000, unit: "комплекс" },
        { id: "ls3", name: "Устройство цветника", price: 8000, unit: "цветник" },
        { id: "ls4", name: "Альпийская горка", price: 20000, unit: "горка" },
        { id: "ls5", name: "Система автополива", price: 30000, unit: "система" },
        { id: "ls6", name: "Ландшафтное освещение", price: 25000, unit: "комплекс" },
        { id: "ls7", name: "Фитодизайн интерьера", price: 10000, unit: "помещение" },
        { id: "ls8", name: "Садовые дорожки", price: 3000, unit: "м²" }
      ]
    },
    "cleaning": {
      title: "Уборка участка",
      icon: "Trash2",
      services: [
        { id: "cl1", name: "Покос травы", price: 600, unit: "сотка" },
        { id: "cl2", name: "Уборка листвы", price: 800, unit: "сотка" },
        { id: "cl3", name: "Утилизация веток", price: 1500, unit: "м³" },
        { id: "cl4", name: "Измельчение отходов", price: 2000, unit: "услуга" },
        { id: "cl5", name: "Вывоз мусора", price: 3000, unit: "машина" },
        { id: "cl6", name: "Очистка дорожек", price: 500, unit: "10м²" },
        { id: "cl7", name: "Очистка водостоков", price: 1200, unit: "система" },
        { id: "cl8", name: "Генеральная уборка участка", price: 5000, unit: "участок" }
      ]
    },
    "winter": {
      title: "Зимнее обслуживание",
      icon: "Snowflake",
      services: [
        { id: "wn1", name: "Уборка снега (ручная)", price: 1200, unit: "сотка" },
        { id: "wn2", name: "Уборка снега (механическая)", price: 2000, unit: "сотка" },
        { id: "wn3", name: "Обработка от льда", price: 800, unit: "10м²" },
        { id: "wn4", name: "Чистка крыши от снега", price: 3000, unit: "крыша" },
        { id: "wn5", name: "Защита растений на зиму", price: 2500, unit: "комплекс" },
        { id: "wn6", name: "Удаление сосулек", price: 1500, unit: "объект" },
        { id: "wn7", name: "Зимний абонемент (1 выезд/нед)", price: 8000, unit: "месяц" },
        { id: "wn8", name: "Зимний абонемент (2 выезда/нед)", price: 15000, unit: "месяц" }
      ]
    },
    "complex": {
      title: "Комплексное обслуживание",
      icon: "Calendar",
      services: [
        { id: "cx1", name: "Базовый пакет (до 10 соток)", price: 25000, unit: "месяц" },
        { id: "cx2", name: "Стандарт (10-20 соток)", price: 40000, unit: "месяц" },
        { id: "cx3", name: "Премиум (20-50 соток)", price: 70000, unit: "месяц" },
        { id: "cx4", name: "VIP (от 50 соток)", price: 120000, unit: "месяц" },
        { id: "cx5", name: "Разовый выезд агронома", price: 3000, unit: "выезд" },
        { id: "cx6", name: "Консультация по телефону", price: 0, unit: "бесплатно" },
        { id: "cx7", name: "Составление плана ухода", price: 5000, unit: "план" },
        { id: "cx8", name: "Фото-отчёты работ", price: 0, unit: "включено" }
      ]
    }
  };

  const category = slug ? categoriesData[slug] : null;

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Категория не найдена</h1>
          <Link to="/services">
            <Button>Вернуться к услугам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckboxChange = (service: Service, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => new Set(prev).add(service.id));
      addItem({
        id: service.id,
        category: category.title,
        name: service.name,
        price: service.price,
        unit: service.unit
      });
    } else {
      setSelectedServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(service.id);
        return newSet;
      });
      removeItem(service.id);
    }
  };

  const isInOrder = (serviceId: string) => {
    return items.some(item => item.id === serviceId);
  };

  return (
    <div className="min-h-screen">
      <section className="py-16 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <Link to="/services" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к категориям
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name={category.icon} className="text-primary" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{category.title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">Выберите необходимые услуги и добавьте их в заявку</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {category.services.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id={service.id}
                          checked={isInOrder(service.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(service, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={service.id}
                            className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                          >
                            {service.name}
                          </label>
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-2xl font-bold text-primary">{service.price.toLocaleString()} ₽</span>
                            <span className="text-muted-foreground">/ {service.unit}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="ShoppingCart" size={24} />
                      Ваша заявка
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Выберите услуги для формирования заявки
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start text-sm">
                              <span className="flex-1">{item.name}</span>
                              <span className="font-semibold ml-2">{item.price.toLocaleString()} ₽</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 mb-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Итого:</span>
                            <span className="text-primary">{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Финальная стоимость рассчитывается после выезда специалиста
                          </p>
                        </div>
                        <Link to="/order">
                          <Button className="w-full" size="lg">
                            Оформить заявку
                            <Icon name="Send" className="ml-2" size={18} />
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceCategory;
