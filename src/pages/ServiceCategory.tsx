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
  const { items, addItem, removeItem, updateQuantity } = useOrder();
  const { categories } = useServices();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

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

  const handleQuantityChange = (service: { id: string; name: string; price: number; unit: string }, quantity: number) => {
    if (quantity <= 0) {
      setQuantities(prev => {
        const newQty = { ...prev };
        delete newQty[service.id];
        return newQty;
      });
      removeItem(service.id);
      return;
    }

    setQuantities(prev => ({ ...prev, [service.id]: quantity }));

    const inOrder = isInOrder(service.id);
    if (!inOrder) {
      addItem({
        id: service.id,
        category: category.title,
        name: service.name,
        price: service.price,
        unit: service.unit,
        quantity: quantity,
        totalPrice: service.price * quantity
      });
    } else {
      updateQuantity(service.id, quantity);
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
                {category.services.map((service) => {
                  const quantity = quantities[service.id] || 0;
                  const isSelected = quantity > 0;

                  return (
                    <Card key={service.id} className={`hover:shadow-md transition-all ${isSelected ? 'border-2 border-primary' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-primary">{service.price.toLocaleString()} ₽</span>
                              <span className="text-muted-foreground">/ {service.unit}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(service, quantity - 1)}
                              disabled={quantity === 0}
                            >
                              <Icon name="Minus" size={16} />
                            </Button>
                            <div className="w-16 text-center">
                              <div className="text-2xl font-bold">{quantity}</div>
                              <div className="text-xs text-muted-foreground">{service.unit}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(service, quantity + 1)}
                            >
                              <Icon name="Plus" size={16} />
                            </Button>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Итого:</span>
                              <span className="text-xl font-bold text-primary">
                                {(service.price * quantity).toLocaleString()} ₽
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
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
                            <div key={item.id} className="flex justify-between items-start text-sm border-b pb-2">
                              <div className="flex-1">
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.quantity} {item.unit} × {item.price.toLocaleString()} ₽
                                </div>
                              </div>
                              <span className="font-semibold ml-2">{item.totalPrice.toLocaleString()} ₽</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-4 mb-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Итого:</span>
                            <span className="text-primary">{items.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()} ₽</span>
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