import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useServices, Service } from "@/contexts/ServicesContext";
import { useToast } from "@/hooks/use-toast";

const AdminServices = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { categories, updateService, deleteService, addService } = useServices();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    unit: ""
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const categoryList = Object.keys(categories).map(slug => ({
    slug,
    ...categories[slug]
  }));

  const handleEditService = (categorySlug: string, service: Service) => {
    setSelectedCategory(categorySlug);
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price,
      unit: service.unit
    });
    setIsAddingNew(false);
    setIsDialogOpen(true);
  };

  const handleAddService = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setEditingService(null);
    setFormData({
      name: "",
      price: 0,
      unit: "шт"
    });
    setIsAddingNew(true);
    setIsDialogOpen(true);
  };

  const handleSaveService = () => {
    if (!selectedCategory) return;

    if (isAddingNew) {
      const newId = `new_${Date.now()}`;
      addService(selectedCategory, {
        id: newId,
        ...formData
      });
      toast({
        title: "Услуга добавлена",
        description: `Услуга "${formData.name}" успешно добавлена`
      });
    } else if (editingService) {
      updateService(selectedCategory, editingService.id, formData);
      toast({
        title: "Услуга обновлена",
        description: `Услуга "${formData.name}" успешно обновлена`
      });
    }

    setIsDialogOpen(false);
  };

  const handleDeleteService = (categorySlug: string, serviceId: string, serviceName: string) => {
    if (confirm(`Удалить услугу "${serviceName}"?`)) {
      deleteService(categorySlug, serviceId);
      toast({
        title: "Услуга удалена",
        description: `Услуга "${serviceName}" удалена`
      });
    }
  };

  const commonUnits = [
    "шт",
    "сотка",
    "м²",
    "м³",
    "дерево",
    "куст",
    "растение",
    "участок",
    "комплекс",
    "проект",
    "услуга",
    "месяц",
    "год",
    "выезд",
    "система",
    "дом",
    "теплица",
    "клумба",
    "пень",
    "крыша",
    "водоём",
    "рейс",
    "машина",
    "помещение",
    "цветник",
    "горка",
    "объект",
    "сезон",
    "бесплатно",
    "включено"
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
              <p className="text-muted-foreground">Управление категориями, ценами и единицами измерения</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {categoryList.map(({ slug, title, icon, services }) => (
              <Card key={slug}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={icon} className="text-primary" size={24} />
                      </div>
                      <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{services.length} услуг</CardDescription>
                      </div>
                    </div>
                    <Button onClick={() => handleAddService(slug)} size="sm" className="gap-2">
                      <Icon name="Plus" size={16} />
                      Добавить услугу
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {services.map(service => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {service.price.toLocaleString()} ₽ / {service.unit}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditService(slug, service)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(slug, service.id, service.name)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddingNew ? "Добавить услугу" : "Редактировать услугу"}
            </DialogTitle>
            <DialogDescription>
              Укажите название, цену и единицу измерения
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название услуги</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Стрижка газона"
              />
            </div>

            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="1000"
              />
            </div>

            <div>
              <Label htmlFor="unit">Единица измерения</Label>
              <Select
                value={formData.unit}
                onValueChange={value => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите единицу" />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map(unit => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Например: шт, сотка, м², дерево, куст
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveService}>
              {isAddingNew ? "Добавить" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
