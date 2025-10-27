import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { useToast } from "@/hooks/use-toast";

const AdminContacts = () => {
  const { isAdmin } = useAuth();
  const { contacts, updateContacts } = useSiteSettings();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(contacts);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContacts(formData);
    toast({
      title: "Контакты обновлены",
      description: "Изменения сохранены и отображаются на сайте"
    });
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
            <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
              <Icon name="Phone" className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Редактирование контактов</h1>
              <p className="text-muted-foreground">Управление контактной информацией сайта</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>Эта информация отображается в футере и на странице контактов</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Телефон <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="+7 (495) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="info@timiryazevets.ru"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Адрес <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder="г. Москва, ул. Примерная, 12"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-2">Социальные сети</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Иконки автоматически появятся в футере сайта после заполнения ссылок
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Instagram
                        </label>
                        <Input
                          placeholder="https://instagram.com/username"
                          value={formData.socials.instagram || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            socials: { ...formData.socials, instagram: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Telegram
                        </label>
                        <Input
                          placeholder="https://t.me/username"
                          value={formData.socials.telegram || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            socials: { ...formData.socials, telegram: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          YouTube
                        </label>
                        <Input
                          placeholder="https://youtube.com/@channel"
                          value={formData.socials.youtube || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            socials: { ...formData.socials, youtube: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          WhatsApp
                        </label>
                        <Input
                          placeholder="https://wa.me/79991234567"
                          value={formData.socials.whatsapp || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            socials: { ...formData.socials, whatsapp: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" size="lg" className="flex-1">
                      <Icon name="Save" className="mr-2" size={18} />
                      Сохранить изменения
                    </Button>
                    <Link to="/admin">
                      <Button type="button" variant="outline" size="lg">
                        Отмена
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminContacts;