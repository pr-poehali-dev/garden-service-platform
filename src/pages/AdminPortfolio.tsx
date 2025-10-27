import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio, PortfolioPost } from "@/contexts/PortfolioContext";
import { useToast } from "@/hooks/use-toast";

const AdminPortfolio = () => {
  const { isAdmin } = useAuth();
  const { posts, addPost, updatePost, deletePost } = usePortfolio();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: ""
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.image) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      updatePost(editingId, formData);
      toast({
        title: "Пост обновлён",
        description: "Изменения сохранены"
      });
      setEditingId(null);
    } else {
      addPost(formData);
      toast({
        title: "Пост создан",
        description: "Новая работа добавлена в портфолио"
      });
    }

    setFormData({ title: "", description: "", image: "", category: "" });
  };

  const handleEdit = (post: PortfolioPost) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      description: post.description,
      image: post.image,
      category: post.category
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот пост?")) {
      deletePost(id);
      toast({
        title: "Пост удалён",
        description: "Работа удалена из портфолио"
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", image: "", category: "" });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <section className="py-12 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <Link to="/admin" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад в админ-панель
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center">
              <Icon name="Image" className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Управление портфолио</h1>
              <p className="text-muted-foreground">Создание и редактирование постов</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{editingId ? "Редактировать пост" : "Создать пост"}</CardTitle>
                  <CardDescription>
                    {editingId ? "Измените данные и сохраните" : "Добавьте новую работу в портфолио"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Название <span className="text-destructive">*</span>
                      </label>
                      <Input
                        placeholder="Ландшафтный дизайн усадьбы"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Описание <span className="text-destructive">*</span>
                      </label>
                      <Textarea
                        placeholder="Краткое описание проекта..."
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        URL изображения <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Категория
                      </label>
                      <Input
                        placeholder="Ландшафт, Уход за садом, Озеленение"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        <Icon name={editingId ? "Save" : "Plus"} className="mr-2" size={18} />
                        {editingId ? "Сохранить" : "Создать"}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={handleCancel}>
                          <Icon name="X" size={18} />
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Все посты ({posts.length})</CardTitle>
                  <CardDescription>Управляйте публикациями в портфолио</CardDescription>
                </CardHeader>
                <CardContent>
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ImageOff" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Пока нет постов. Создайте первый!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="flex gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
                            {post.category && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(post)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPortfolio;
