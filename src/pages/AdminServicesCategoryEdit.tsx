import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useServices } from "@/contexts/ServicesContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminServicesCategoryEdit = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { categories, updateService, addService, deleteService } = useServices();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newService, setNewService] = useState({
    name: "",
    price: 0,
    unit: ""
  });

  const [editService, setEditService] = useState({
    name: "",
    price: 0,
    unit: ""
  });

  if (!slug || !categories[slug]) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Категория не найдена</h1>
          <Link to="/admin/services">
            <Button>Вернуться к блокам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = categories[slug];

  const handleAddService = () => {
    if (!newService.name || !newService.unit) return;
    
    const id = `${slug}_${Date.now()}`;
    addService(slug, {
      id,
      name: newService.name,
      price: newService.price,
      unit: newService.unit
    });

    setNewService({ name: "", price: 0, unit: "" });
    setIsAddOpen(false);
  };

  const handleEditService = (serviceId: string) => {
    const service = category.services.find(s => s.id === serviceId);
    if (!service) return;
    
    setEditService({
      name: service.name,
      price: service.price,
      unit: service.unit
    });
    setEditingId(serviceId);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    updateService(slug, editingId, {
      name: editService.name,
      price: editService.price,
      unit: editService.unit
    });
    
    setEditingId(null);
  };

  const handleDeleteService = (serviceId: string) => {
    const service = category.services.find(s => s.id === serviceId);
    if (confirm(`Удалить услугу "${service?.name}"?`)) {
      deleteService(slug, serviceId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin/services" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-flex items-center">
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Назад к блокам услуг
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={category.icon} className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">{category.title}</h1>
                  <p className="text-muted-foreground mt-1">{category.description}</p>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Icon name="Plus" className="mr-2" size={20} />
                  Добавить услугу
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Новая услуга</DialogTitle>
                  <DialogDescription>
                    Добавление услуги в категорию "{category.title}"
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Название услуги</Label>
                    <Input
                      placeholder="Стрижка газона"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Единица измерения</Label>
                    <Input
                      placeholder="сотка, м², шт, участок"
                      value={newService.unit}
                      onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddService} className="w-full">
                    Добавить услугу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Услуги в категории ({category.services.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.services.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="PackageOpen" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>В этой категории пока нет услуг</p>
                  <p className="text-sm mt-2">Нажмите "Добавить услугу" чтобы начать</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Единица</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.price.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell>{service.unit}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Dialog open={editingId === service.id} onOpenChange={(open) => !open && setEditingId(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditService(service.id)}
                                >
                                  <Icon name="Edit" size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Редактировать услугу</DialogTitle>
                                  <DialogDescription>
                                    Изменение "{service.name}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label>Название услуги</Label>
                                    <Input
                                      value={editService.name}
                                      onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Цена</Label>
                                    <Input
                                      type="number"
                                      value={editService.price}
                                      onChange={(e) => setEditService({ ...editService, price: Number(e.target.value) })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Единица измерения</Label>
                                    <Input
                                      value={editService.unit}
                                      onChange={(e) => setEditService({ ...editService, unit: e.target.value })}
                                    />
                                  </div>
                                  <Button onClick={handleSaveEdit} className="w-full">
                                    Сохранить изменения
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AdminServicesCategoryEdit;
