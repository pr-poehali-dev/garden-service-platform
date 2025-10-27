import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";
import { useOrder } from "@/contexts/OrderContext";
import { useServices } from "@/contexts/ServicesContext";
import { useState } from "react";

const ServiceCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { items, addItem, removeItem } = useOrder();
  const { categories } = useServices();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const category = slug ? categories[slug] : null;

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

  const handleCheckboxChange = (service: { id: string; name: string; price: number; unit: string }, checked: boolean) => {
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