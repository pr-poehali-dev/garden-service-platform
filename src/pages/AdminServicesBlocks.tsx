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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCardProps {
  slug: string;
  category: {
    title: string;
    description: string;
    icon: string;
    services: Array<{ id: string; name: string; price: number; unit: string }>;
    visible?: boolean;
  };
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
  onToggleVisibility: (slug: string) => void;
  editingSlug: string | null;
  setEditingSlug: (slug: string | null) => void;
  editCategory: { title: string; description: string; icon: string };
  setEditCategory: (data: { title: string; description: string; icon: string }) => void;
  onSaveEdit: () => void;
  iconOptions: string[];
}

const SortableCard = ({
  slug,
  category,
  onEdit,
  onDelete,
  onToggleVisibility,
  editingSlug,
  setEditingSlug,
  editCategory,
  setEditCategory,
  onSaveEdit,
  iconOptions
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Icon name={category.icon} className="text-primary" size={24} />
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                {...attributes}
                {...listeners}
                title="Перетащить"
                className="cursor-grab active:cursor-grabbing"
              >
                <Icon name="GripVertical" size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleVisibility(slug)}
                title={category.visible !== false ? "Скрыть" : "Показать"}
              >
                <Icon name={category.visible !== false ? "EyeOff" : "Eye"} size={16} />
              </Button>
            </div>
          </div>
          <CardTitle>{category.title}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Dialog open={editingSlug === slug} onOpenChange={(open) => !open && setEditingSlug(null)}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onEdit(slug)}
                >
                  <Icon name="Edit" size={16} className="mr-1" />
                  Редактировать блок
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Редактировать блок</DialogTitle>
                  <DialogDescription>Изменение категории услуг</DialogDescription>
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
                  <Button onClick={onSaveEdit} className="w-full">
                    Сохранить изменения
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Link to={`/admin/services/${slug}`}>
              <Button size="sm" variant="default" className="w-full">
                <Icon name="FolderOpen" size={16} className="mr-1" />
                Открыть блок ({category.services.length})
              </Button>
            </Link>
            
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={() => onDelete(slug)}
            >
              <Icon name="Trash2" size={16} className="mr-1" />
              Удалить блок
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminServicesBlocks = () => {
  const { categories, updateCategory, addCategory, deleteCategory, toggleCategoryVisibility, reorderCategories } = useServices();
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent, isVisible: boolean) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const items = isVisible ? visibleCategories : hiddenCategories;
    const oldIndex = items.findIndex(([slug]) => slug === active.id);
    const newIndex = items.findIndex(([slug]) => slug === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(items, oldIndex, newIndex);
      reorderCategories(reordered.map(([slug]) => slug), isVisible);
    }
  };

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
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Eye" size={24} />
              Видимые блоки ({visibleCategories.length})
            </h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, true)}
            >
              <SortableContext
                items={visibleCategories.map(([slug]) => slug)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleCategories.map(([slug, category]) => (
                    <SortableCard
                      key={slug}
                      slug={slug}
                      category={category}
                      onEdit={handleEditCategory}
                      onDelete={handleDeleteCategory}
                      onToggleVisibility={handleToggleVisibility}
                      editingSlug={editingSlug}
                      setEditingSlug={setEditingSlug}
                      editCategory={editCategory}
                      setEditCategory={setEditCategory}
                      onSaveEdit={handleSaveEdit}
                      iconOptions={iconOptions}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {hiddenCategories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-muted-foreground flex items-center gap-2">
                <Icon name="EyeOff" size={24} />
                Скрытые блоки ({hiddenCategories.length})
              </h2>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, false)}
              >
                <SortableContext
                  items={hiddenCategories.map(([slug]) => slug)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                    {hiddenCategories.map(([slug, category]) => (
                      <SortableCard
                        key={slug}
                        slug={slug}
                        category={category}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                        onToggleVisibility={handleToggleVisibility}
                        editingSlug={editingSlug}
                        setEditingSlug={setEditingSlug}
                        editCategory={editCategory}
                        setEditCategory={setEditCategory}
                        onSaveEdit={handleSaveEdit}
                        iconOptions={iconOptions}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminServicesBlocks;
