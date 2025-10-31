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
import { useServices, CategoryData } from "@/contexts/ServicesContext";
import { useToast } from "@/hooks/use-toast";

const AdminServices = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { categories, updateCategory } = useServices();
  const { toast } = useToast();
  
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{slug: string} & CategoryData | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    title: "",
    description: "",
    icon: "Briefcase"
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

  const handleEditCategory = (slug: string) => {
    const category = categories[slug];
    setEditingCategory({ slug, ...category });
    setCategoryFormData({
      title: category.title,
      description: category.description,
      icon: category.icon
    });
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory) return;

    updateCategory(editingCategory.slug, categoryFormData);
    toast({
      title: "Блок обновлён",
      description: `Блок "${categoryFormData.title}" успешно обновлён`
    });

    setIsCategoryDialogOpen(false);
  };

  const commonIcons = [
    "TreeDeciduous", "Bug", "Sprout", "Flower2", "Home", 
    "Trash2", "Snowflake", "Calendar", "Briefcase", "Leaf",
    "Sun", "Cloud", "Droplet", "Wind", "Mountain",
    "Trees", "ShoppingCart", "Wrench", "Settings", "Award"
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
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Управление услугами</h1>
              <p className="text-muted-foreground">Редактирование блоков категорий на странице услуг</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" className="text-blue-500 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Редактирование услуг и цен
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Для детального управления услугами, ценами и описаниями перейдите в раздел{" "}
                  <Link to="/admin/content/services" className="underline font-medium hover:text-blue-600">
                    Контент → Услуги
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {categoryList.map(({ slug, title, description, icon, services }) => (
              <Card key={slug}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={icon} className="text-primary" size={24} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{title}</CardTitle>
                        <CardDescription className="mb-1">{description}</CardDescription>
                        <CardDescription className="text-xs">{services.length} услуг в категории</CardDescription>
                      </div>
                    </div>
                    <Button onClick={() => handleEditCategory(slug)} variant="outline" size="sm" className="gap-2 flex-shrink-0">
                      <Icon name="Edit" size={16} />
                      Редактировать блок
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {services.slice(0, 6).map(service => (
                      <div
                        key={service.id}
                        className="p-3 rounded-lg border bg-secondary/30 text-sm"
                      >
                        <div className="font-medium truncate">{service.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {service.price.toLocaleString()} ₽ / {service.unit}
                        </div>
                      </div>
                    ))}
                    {services.length > 6 && (
                      <div className="p-3 rounded-lg border bg-secondary/30 text-sm flex items-center justify-center text-muted-foreground">
                        +{services.length - 6} ещё
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/admin/content/services')}
                      className="w-full gap-2"
                    >
                      <Icon name="Edit" size={16} />
                      Управлять услугами в этой категории
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать блок категории</DialogTitle>
            <DialogDescription>
              Измените название, описание и иконку блока на странице услуг
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category-title">Название блока</Label>
              <Input
                id="category-title"
                value={categoryFormData.title}
                onChange={e => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                placeholder="Например: Уход за зелёными насаждениями"
              />
            </div>

            <div>
              <Label htmlFor="category-description">Описание блока</Label>
              <Input
                id="category-description"
                value={categoryFormData.description}
                onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                placeholder="Краткое описание категории услуг"
              />
            </div>

            <div>
              <Label htmlFor="category-icon">Иконка</Label>
              <Select
                value={categoryFormData.icon}
                onValueChange={value => setCategoryFormData({ ...categoryFormData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите иконку" />
                </SelectTrigger>
                <SelectContent>
                  {commonIcons.map(iconName => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        <Icon name={iconName} size={18} />
                        {iconName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 p-3 bg-secondary/50 rounded-lg flex items-center gap-2">
                <Icon name={categoryFormData.icon} size={24} />
                <span className="text-sm">Предпросмотр иконки</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveCategory}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
