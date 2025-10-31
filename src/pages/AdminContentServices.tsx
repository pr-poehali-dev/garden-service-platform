import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContent, ContentService } from '@/contexts/AdminContentContext';
import { ContentForm } from '@/components/admin/ContentForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
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

interface SortableServiceItemProps {
  service: ContentService;
  onEdit: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onRestore: () => void;
}

function SortableServiceItem({ service, onEdit, onToggleVisibility, onRemove, onRestore }: SortableServiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-card border rounded-lg ${
        service.removed_at ? 'opacity-50 bg-destructive/5' : ''
      } ${!service.visible ? 'opacity-60' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-secondary/50 rounded"
      >
        <Icon name="GripVertical" size={20} className="text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{service.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{service.short_desc || service.description}</p>
        {service.price && (
          <p className="text-sm font-medium text-primary mt-1">
            {service.price.toLocaleString()} ₽ / {service.unit}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {service.removed_at ? (
          <Button variant="outline" size="sm" onClick={onRestore} title="Восстановить">
            <Icon name="RotateCcw" size={16} />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleVisibility}
              title={service.visible ? 'Скрыть' : 'Показать'}
            >
              <Icon name={service.visible ? 'Eye' : 'EyeOff'} size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={onEdit} title="Редактировать">
              <Icon name="Edit" size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={onRemove} title="Удалить">
              <Icon name="Trash2" size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminContentServices() {
  const navigate = useNavigate();
  const {
    services,
    loading,
    fetchServices,
    getService,
    createService,
    updateService,
    toggleServiceVisibility,
    softRemoveService,
    restoreService,
    reorderServices,
  } = useAdminContent();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formValues, setFormValues] = useState<Partial<ContentService>>({
    title: '',
    slug: '',
    short_desc: '',
    description: '',
    price: 0,
    unit: '',
    visible: true,
    sort_order: 0,
    images: [],
    meta_title: '',
    meta_description: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchServices(true);
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleServices = filteredServices.filter(s => !s.removed_at);
  const removedServices = filteredServices.filter(s => s.removed_at);

  const selectedService = selectedId ? getService(selectedId) : null;
  const showForm = isCreating || selectedService;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = visibleServices.findIndex(s => s.id === active.id);
      const newIndex = visibleServices.findIndex(s => s.id === over.id);
      const reordered = arrayMove(visibleServices, oldIndex, newIndex);
      reorderServices([...reordered, ...removedServices]);
    }
  };

  const handleItemClick = (service: ContentService) => {
    setSelectedId(service.id);
    setIsCreating(false);
    setFormValues(service);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setFormValues({
      title: '',
      slug: '',
      short_desc: '',
      description: '',
      price: 0,
      unit: 'шт',
      visible: true,
      sort_order: services.length,
      images: [],
      meta_title: '',
      meta_description: ''
    });
  };

  const handleSave = async () => {
    if (isCreating) {
      await createService({
        ...formValues as Omit<ContentService, 'id' | 'created_at' | 'updated_at'>
      });
      setIsCreating(false);
    } else if (selectedId) {
      await updateService(selectedId, formValues);
    }
    await fetchServices(true);
    setSelectedId(null);
  };

  const handleToggleVisibility = async () => {
    if (selectedId) {
      await toggleServiceVisibility(selectedId);
      await fetchServices(true);
      const updated = getService(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleRemove = async () => {
    if (selectedId) {
      await softRemoveService(selectedId);
      await fetchServices(true);
      setSelectedId(null);
    }
  };

  const handleRestore = async () => {
    if (selectedId) {
      await restoreService(selectedId);
      await fetchServices(true);
      const updated = getService(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setIsCreating(false);
  };

  const fields = [
    { name: 'title', label: 'Название услуги', type: 'text' as const, required: true, placeholder: 'Обрезка деревьев' },
    { name: 'slug', label: 'URL (slug)', type: 'text' as const, required: true, placeholder: 'tree-pruning' },
    { name: 'short_desc', label: 'Краткое описание', type: 'textarea' as const, placeholder: 'Короткое описание услуги для карточки' },
    { name: 'description', label: 'Полное описание', type: 'textarea' as const, placeholder: 'Детальное описание услуги' },
    { name: 'price', label: 'Цена', type: 'number' as const, placeholder: '2000' },
    { name: 'unit', label: 'Единица измерения', type: 'text' as const, placeholder: 'дерево, сотка, шт' },
    { name: 'sort_order', label: 'Порядок сортировки', type: 'number' as const },
    { name: 'images', label: 'Изображения', type: 'images' as const },
    { name: 'meta_title', label: 'SEO: Title', type: 'text' as const, placeholder: 'Заголовок для поисковиков' },
    { name: 'meta_description', label: 'SEO: Description', type: 'textarea' as const, placeholder: 'Описание для поисковиков' }
  ];

  if (showForm) {
    const currentService = selectedService || formValues;
    
    return (
      <ContentForm
        title={isCreating ? 'Новая услуга' : 'Редактирование услуги'}
        fields={fields}
        values={formValues}
        visible={currentService.visible ?? true}
        isRemoved={!!currentService.removed_at}
        onChange={(name, value) => setFormValues(prev => ({ ...prev, [name]: value }))}
        onSave={handleSave}
        onToggleVisibility={handleToggleVisibility}
        onRemove={handleRemove}
        onRestore={handleRestore}
        onBack={handleBack}
        isNew={isCreating}
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              title="Назад в админ-панель"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Управление услугами</h1>
              <p className="text-muted-foreground mt-2">
                Создавайте, редактируйте и сортируйте услуги сайта
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Поиск услуг..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleCreate} className="gap-2 w-full sm:w-auto">
              <Icon name="Plus" size={18} />
              Создать услугу
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Загрузка услуг...</p>
            </div>
          ) : visibleServices.length === 0 && removedServices.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Нет услуг. Создайте первую услугу.</p>
              <Button onClick={handleCreate} className="gap-2">
                <Icon name="Plus" size={18} />
                Создать услугу
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {visibleServices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Icon name="List" size={16} />
                    Активные услуги ({visibleServices.length})
                  </h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={visibleServices.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {visibleServices.map((service) => (
                          <SortableServiceItem
                            key={service.id}
                            service={service}
                            onEdit={() => handleItemClick(service)}
                            onToggleVisibility={async () => {
                              await toggleServiceVisibility(service.id);
                              await fetchServices(true);
                            }}
                            onRemove={async () => {
                              await softRemoveService(service.id);
                              await fetchServices(true);
                            }}
                            onRestore={async () => {
                              await restoreService(service.id);
                              await fetchServices(true);
                            }}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {removedServices.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Icon name="Trash2" size={16} />
                    Удалённые услуги ({removedServices.length})
                  </h3>
                  <div className="space-y-2">
                    {removedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg opacity-50"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{service.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {service.short_desc || service.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await restoreService(service.id);
                            await fetchServices(true);
                          }}
                          title="Восстановить"
                        >
                          <Icon name="RotateCcw" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
