import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminServicesBlocks = () => {
  const { categories, updateCategory, addCategory, deleteCategory, toggleCategoryVisibility } = useServices();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    slug: "",
    title: "",
    description: "",
    icon: "Briefcase"
  });

  const [editCategory, setEditCategory] = useState({
    title: "",
    description: "",
    icon: ""
  });

  const iconOptions = [
    "TreeDeciduous", "Bug", "Sprout", "Flower2", "Home", 
    "Trash2", "Snowflake", "Calendar", "Briefcase", "Wrench",
    "Hammer", "Paintbrush", "Zap", "Droplet", "Wind",
    "Sun", "Cloud", "Shield", "Settings", "Tool"
  ];

  const handleCreateCategory = () => {
    if (!newCategory.slug || !newCategory.title) return;
    
    addCategory(newCategory.slug, {
      title: newCategory.title,
      description: newCategory.description,
      icon: newCategory.icon,
      services: [],
      visible: true
    });

    setNewCategory({ slug: "", title: "", description: "", icon: "Briefcase" });
    setIsCreateOpen(false);
  };

  const handleEditCategory = (slug: string) => {
    const category = categories[slug];
    setEditCategory({
      title: category.title,
      description: category.description,
      icon: category.icon
    });
    setEditingSlug(slug);
  };

  const handleSaveEdit = () => {
    if (!editingSlug) return;
    
    updateCategory(editingSlug, {
      title: editCategory.title,
      description: editCategory.description,
      icon: editCategory.icon
    });
    
    setEditingSlug(null);
  };

  const handleDeleteCategory = (slug: string) => {
    if (confirm(`Удалить категорию "${categories[slug].title}"? Это действие нельзя отменить.`)) {
      deleteCategory(slug);
    }
  };

  const handleToggleVisibility = (slug: string) => {
    toggleCategoryVisibility(slug);
  };

  const visibleCategories = Object.entries(categories).filter(([, cat]) => cat.visible !== false);
  const hiddenCategories = Object.entries(categories).filter(([, cat]) => cat.visible === false);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/admin/content" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-flex items-center">
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Назад к контенту
              </Link>
              <h1 className="text-4xl font-bold">Блоки услуг</h1>
              <p className="text-muted-foreground mt-2">
                Управление категориями на странице услуг
              </p>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Icon name="Plus" className="mr-2" size={20} />
                  Создать блок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новый блок</DialogTitle>
                  <DialogDescription>
                    Добавьте новую категорию услуг на страницу
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Slug (латиницей, без пробелов)</Label>
                    <Input
                      placeholder="my-services"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    />
                  </div>
                  <div>
                    <Label>Название</Label>
                    <Input
                      placeholder="Мои услуги"
                      value={newCategory.title}
                      onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Описание</Label>
                    <Textarea
                      placeholder="Краткое описание категории"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Иконка</Label>
                    <Select value={newCategory.icon} onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              <Icon name={icon} size={18} />
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateCategory} className="w-full">
                    Создать категорию
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Видимые блоки ({visibleCategories.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCategories.map(([slug, category]) => (
                <Card key={slug} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <Icon name={category.icon} className="text-primary" size={24} />
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleVisibility(slug)}
                          title="Скрыть"
                        >
                          <Icon name="EyeOff" size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Dialog open={editingSlug === slug} onOpenChange={(open) => !open && setEditingSlug(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditCategory(slug)}
                          >
                            <Icon name="Edit" size={16} className="mr-1" />
                            Редактировать
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Редактировать блок</DialogTitle>
                            <DialogDescription>
                              Изменение категории "{category.title}"
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label>Название</Label>
                              <Input
                                value={editCategory.title}
                                onChange={(e) => setEditCategory({ ...editCategory, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Описание</Label>
                              <Textarea
                                value={editCategory.description}
                                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Иконка</Label>
                              <Select value={editCategory.icon} onValueChange={(value) => setEditCategory({ ...editCategory, icon: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {iconOptions.map(icon => (
                                    <SelectItem key={icon} value={icon}>
                                      <div className="flex items-center gap-2">
                                        <Icon name={icon} size={18} />
                                        {icon}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                        onClick={() => handleDeleteCategory(slug)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Услуг: {category.services.length} • Slug: {slug}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {hiddenCategories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Скрытые блоки ({hiddenCategories.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hiddenCategories.map(([slug, category]) => (
                  <Card key={slug} className="relative opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-3">
                          <Icon name={category.icon} className="text-muted-foreground" size={24} />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleVisibility(slug)}
                            title="Показать"
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditCategory(slug)}
                        >
                          <Icon name="Edit" size={16} className="mr-1" />
                          Редактировать
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(slug)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        Услуг: {category.services.length} • Slug: {slug}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminServicesBlocks;
