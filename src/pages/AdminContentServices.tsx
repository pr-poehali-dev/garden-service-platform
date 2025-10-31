import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContent, ContentService } from '@/contexts/AdminContentContext';
import { ContentList } from '@/components/admin/ContentList';
import { ContentForm } from '@/components/admin/ContentForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
    restoreService
  } = useAdminContent();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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

  useEffect(() => {
    fetchServices(true);
  }, []);

  const selectedService = selectedId ? getService(selectedId) : null;
  const showForm = isCreating || selectedService;

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
              Создавайте, редактируйте и управляйте услугами сайта
            </p>
          </div>
        </div>
      </div>

      <ContentList
        items={services}
        loading={loading}
        searchPlaceholder="Поиск услуг..."
        onItemClick={handleItemClick}
        onItemCreate={handleCreate}
        onItemToggleVisibility={(id) => {
          toggleServiceVisibility(id);
          fetchServices(true);
        }}
        onItemRestore={(id) => {
          restoreService(id);
          fetchServices(true);
        }}
        renderItemDetails={(service) => (
          <div>
            <p className="truncate">{service.short_desc || service.description}</p>
            {service.price && (
              <p className="mt-1 font-semibold text-primary">
                {service.price.toLocaleString()} ₽ / {service.unit}
              </p>
            )}
          </div>
        )}
        createButtonText="Создать услугу"
        emptyText="Нет услуг. Создайте первую услугу."
      />
      </div>
    </div>
  );
}