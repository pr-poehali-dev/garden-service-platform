import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContent, ContentPost } from '@/contexts/AdminContentContext';
import { ContentList } from '@/components/admin/ContentList';
import { ContentForm } from '@/components/admin/ContentForm';
import { AdminNav } from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function AdminContentPosts() {
  const navigate = useNavigate();
  const {
    posts,
    loading,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    togglePostVisibility,
    softRemovePost,
    restorePost
  } = useAdminContent();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formValues, setFormValues] = useState<Partial<ContentPost>>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    gallery: [],
    visible: true,
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const selectedPost = selectedId ? getPost(selectedId) : null;
  const showForm = isCreating || selectedPost;

  const handleItemClick = (post: ContentPost) => {
    setSelectedId(post.id);
    setIsCreating(false);
    setFormValues(post);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setFormValues({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      gallery: [],
      visible: true,
      published_at: new Date().toISOString().slice(0, 16),
      meta_title: '',
      meta_description: ''
    });
  };

  const handleSave = async () => {
    if (isCreating) {
      await createPost({
        ...formValues as Omit<ContentPost, 'id' | 'created_at' | 'updated_at'>
      });
      setIsCreating(false);
    } else if (selectedId) {
      await updatePost(selectedId, formValues);
    }
    await fetchPosts(true);
    setSelectedId(null);
  };

  const handleToggleVisibility = async () => {
    if (selectedId) {
      await togglePostVisibility(selectedId);
      await fetchPosts(true);
      const updated = getPost(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleRemove = async () => {
    if (selectedId) {
      await softRemovePost(selectedId);
      await fetchPosts(true);
      setSelectedId(null);
    }
  };

  const handleRestore = async () => {
    if (selectedId) {
      await restorePost(selectedId);
      await fetchPosts(true);
      const updated = getPost(selectedId);
      if (updated) setFormValues(updated);
    }
  };

  const handleBack = () => {
    setSelectedId(null);
    setIsCreating(false);
  };

  const fields = [
    { name: 'title', label: 'Заголовок', type: 'text' as const, required: true, placeholder: 'Название проекта или поста' },
    { name: 'slug', label: 'URL (slug)', type: 'text' as const, required: true, placeholder: 'project-name' },
    { name: 'published_at', label: 'Дата публикации', type: 'datetime' as const },
    { name: 'excerpt', label: 'Краткое описание', type: 'textarea' as const, placeholder: 'Короткое описание для превью' },
    { name: 'body', label: 'Содержание', type: 'textarea' as const, placeholder: 'Полное содержание поста' },
    { name: 'gallery', label: 'Галерея изображений', type: 'images' as const },
    { name: 'meta_title', label: 'SEO: Title', type: 'text' as const, placeholder: 'Заголовок для поисковиков' },
    { name: 'meta_description', label: 'SEO: Description', type: 'textarea' as const, placeholder: 'Описание для поисковиков' }
  ];

  if (showForm) {
    const currentPost = selectedPost || formValues;
    
    return (
      <ContentForm
        title={isCreating ? 'Новый пост' : 'Редактирование поста'}
        fields={fields}
        values={formValues}
        visible={currentPost.visible ?? true}
        isRemoved={!!currentPost.removed_at}
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
            <h1 className="text-3xl font-bold">Портфолио / Блог</h1>
            <p className="text-muted-foreground mt-2">
              Создавайте и управляйте постами портфолио и блога
            </p>
          </div>
        </div>
      </div>

      <ContentList
        items={posts}
        loading={loading}
        searchPlaceholder="Поиск постов..."
        onItemClick={handleItemClick}
        onItemCreate={handleCreate}
        onItemToggleVisibility={(id) => {
          togglePostVisibility(id);
          fetchPosts(true);
        }}
        onItemRestore={(id) => {
          restorePost(id);
          fetchPosts(true);
        }}
        renderItemDetails={(post) => (
          <div>
            <p className="truncate">{post.excerpt || post.body}</p>
            {post.published_at && (
              <p className="mt-1 text-xs">
                Опубликовано: {new Date(post.published_at).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        )}
        createButtonText="Создать пост"
        emptyText="Нет постов. Создайте первый пост."
      />
      </div>
    </div>
  );
}