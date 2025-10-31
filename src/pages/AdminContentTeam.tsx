import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContent, ContentTeamMember } from '@/contexts/AdminContentContext';
import { ContentList } from '@/components/admin/ContentList';
import { ContentForm } from '@/components/admin/ContentForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function AdminContentTeam() {
  const navigate = useNavigate();
  const {
    teamMembers,
    loading,
    fetchTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    toggleTeamMemberVisibility,
    softRemoveTeamMember,
    restoreTeamMember
  } = useAdminContent();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ContentTeamMember>>({
    name: '',
    role: '',
    photo: '',
    phone: '',
    telegram: '',
    visible: true,
    sort_order: 0
  });

  useEffect(() => {
    fetchTeamMembers(true);
  }, []);

  const selectedMember = selectedId ? getTeamMember(selectedId) : null;
  const showForm = isCreating || selectedMember;

  const handleItemClick = (member: ContentTeamMember) => {
    setSelectedId(member.id);
    setIsCreating(false);
    setFormValues(member);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setFormValues({
      name: '',
      role: '',
      photo: '',
      phone: '',
      telegram: '',
      visible: true,
      sort_order: teamMembers.length
    });
  };

  const handleSave = async () => {
    if (isCreating) {
      await createTeamMember({
        ...formValues as Omit<ContentTeamMember, 'id' | 'created_at'>
      });
      setIsCreating(false);
    } else if (selectedId) {
      await updateTeamMember(selectedId, formValues);
    }
    await fetchTeamMembers(true);
    setSelectedId(null);
  };

  const handleToggleVisibility = async () => {
    if (selectedId) {
      await toggleTeamMemberVisibility(selectedId);
      await fetchTeamMembers(true);
      const updated = getTeamMember(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleRemove = async () => {
    if (selectedId) {
      await softRemoveTeamMember(selectedId);
      await fetchTeamMembers(true);
      setSelectedId(null);
    }
  };

  const handleRestore = async () => {
    if (selectedId) {
      await restoreTeamMember(selectedId);
      await fetchTeamMembers(true);
      const updated = getTeamMember(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setIsCreating(false);
  };

  const fields = [
    { name: 'name', label: 'Имя сотрудника', type: 'text' as const, required: true, placeholder: 'Иванов Иван' },
    { name: 'role', label: 'Должность', type: 'text' as const, required: true, placeholder: 'Главный агроном' },
    { name: 'photo', label: 'URL фотографии', type: 'text' as const, required: true, placeholder: 'https://...' },
    { name: 'phone', label: 'Телефон', type: 'text' as const, placeholder: '+7 (999) 123-45-67' },
    { name: 'telegram', label: 'Telegram', type: 'text' as const, placeholder: '@username' },
    { name: 'sort_order', label: 'Порядок сортировки', type: 'number' as const }
  ];

  if (showForm) {
    const currentMember = selectedMember || formValues;
    
    return (
      <ContentForm
        title={isCreating ? 'Новый сотрудник' : 'Редактирование сотрудника'}
        fields={fields}
        values={formValues}
        visible={currentMember.visible ?? true}
        isRemoved={!!currentMember.removed_at}
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
            <h1 className="text-3xl font-bold">Наша команда</h1>
            <p className="text-muted-foreground mt-2">
              Управление карточками сотрудников
            </p>
          </div>
        </div>
      </div>

      <ContentList
        items={teamMembers}
        loading={loading}
        searchPlaceholder="Поиск сотрудников..."
        onItemClick={handleItemClick}
        onItemCreate={handleCreate}
        onItemToggleVisibility={(id) => {
          toggleTeamMemberVisibility(id);
          fetchTeamMembers(true);
        }}
        onItemRestore={(id) => {
          restoreTeamMember(id);
          fetchTeamMembers(true);
        }}
        renderItemDetails={(member) => (
          <div className="flex items-center gap-3">
            {member.photo && (
              <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
            )}
            <div>
              <p className="font-medium">{member.role}</p>
              {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
            </div>
          </div>
        )}
        createButtonText="Добавить сотрудника"
        emptyText="Нет сотрудников. Добавьте первого."
      />
      </div>
    </div>
  );
}