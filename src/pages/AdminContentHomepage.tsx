import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContent } from '@/contexts/AdminContentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { AdminNav } from '@/components/admin/AdminNav';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminContentHomepage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { homepage, fetchHomepage, updateHomepage, loading } = useAdminContent();
  
  const [siteName, setSiteName] = useState('');
  const [siteNameSize, setSiteNameSize] = useState('24');
  const [logo, setLogo] = useState('');
  const [logoSize, setLogoSize] = useState('48');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBg, setHeroBg] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [favicon, setFavicon] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [footerLogo, setFooterLogo] = useState('');
  const [footerLogoSize, setFooterLogoSize] = useState('48');
  const [footerSiteName, setFooterSiteName] = useState('');
  const [footerSiteNameSize, setFooterSiteNameSize] = useState('24');
  const [footerDescription, setFooterDescription] = useState('');
  const [footerDescriptionSize, setFooterDescriptionSize] = useState('14');
  const [footerCopyright, setFooterCopyright] = useState('');
  const [footerCopyrightSize, setFooterCopyrightSize] = useState('14');

  useEffect(() => {
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (homepage) {
      setSiteName(homepage.site_name || '');
      setSiteNameSize(homepage.site_name_size || '24');
      setLogo(homepage.logo || '');
      setLogoSize(homepage.logo_size || '48');
      setHeroTitle(homepage.hero_title || '');
      setHeroSubtitle(homepage.hero_subtitle || '');
      setHeroBg(homepage.hero_bg || '');
      setMetaTitle(homepage.meta_title || '');
      setMetaDescription(homepage.meta_description || '');
      setFavicon(homepage.favicon || '');
      setPageTitle(homepage.page_title || '');
      setFooterLogo(homepage.footer_logo || '');
      setFooterLogoSize(homepage.footer_logo_size || '48');
      setFooterSiteName(homepage.footer_site_name || '');
      setFooterSiteNameSize(homepage.footer_site_name_size || '24');
      setFooterDescription(homepage.footer_description || '');
      setFooterDescriptionSize(homepage.footer_description_size || '14');
      setFooterCopyright(homepage.footer_copyright || '');
      setFooterCopyrightSize(homepage.footer_copyright_size || '14');
    }
  }, [homepage]);

  const handleSave = async () => {
    try {
      await updateHomepage({
        site_name: siteName,
        site_name_size: siteNameSize,
        logo,
        logo_size: logoSize,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_bg: heroBg,
        meta_title: metaTitle,
        meta_description: metaDescription,
        favicon,
        page_title: pageTitle,
        footer_logo: footerLogo,
        footer_logo_size: footerLogoSize,
        footer_site_name: footerSiteName,
        footer_site_name_size: footerSiteNameSize,
        footer_description: footerDescription,
        footer_description_size: footerDescriptionSize,
        footer_copyright: footerCopyright,
        footer_copyright_size: footerCopyrightSize
      });
      
      await fetchHomepage();
      
      toast({
        title: "Сохранено!",
        description: "Настройки главной страницы успешно обновлены"
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              title="Назад в админ-панель"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Главная страница</h1>
                <p className="text-muted-foreground mt-2">
                  Настройка главной страницы сайта
                </p>
              </div>
              <Button onClick={handleSave}>
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить изменения
              </Button>
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Шапка сайта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Название сайта</Label>
              <Input
                placeholder="Садовый Сервис"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
            <div>
              <Label>Размер названия (px)</Label>
              <Input
                type="number"
                placeholder="24"
                value={siteNameSize}
                onChange={(e) => setSiteNameSize(e.target.value)}
              />
            </div>
            <div>
              <Label>Логотип</Label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
                  <TabsTrigger value="url">Вставить URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-3">
                  <ImageUploader
                    value={logo}
                    onChange={setLogo}
                  />
                </TabsContent>
                <TabsContent value="url" className="mt-3">
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Label>Размер логотипа (px)</Label>
              <Input
                type="number"
                placeholder="48"
                value={logoSize}
                onChange={(e) => setLogoSize(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero-секция</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Заголовок</Label>
              <Input
                placeholder="Профессиональный уход за садом"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Подзаголовок</Label>
              <Input
                placeholder="Более 10 лет заботимся о вашем участке"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Фоновое изображение</Label>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
                  <TabsTrigger value="url">Вставить URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="mt-3">
                  <ImageUploader
                    value={heroBg}
                    onChange={setHeroBg}
                  />
                </TabsContent>
                <TabsContent value="url" className="mt-3">
                  <Input
                    type="url"
                    placeholder="https://example.com/hero.jpg"
                    value={heroBg}
                    onChange={(e) => setHeroBg(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Футер сайта</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Логотип в футере</Label>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
                    <TabsTrigger value="url">Вставить URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-3">
                    <ImageUploader
                      value={footerLogo}
                      onChange={setFooterLogo}
                    />
                  </TabsContent>
                  <TabsContent value="url" className="mt-3">
                    <Input
                      type="url"
                      placeholder="https://example.com/footer-logo.png"
                      value={footerLogo}
                      onChange={(e) => setFooterLogo(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
                <p className="text-xs text-muted-foreground mt-1">
                  Если не указан, используется логотип из шапки
                </p>
              </div>
              <div>
                <Label>Размер логотипа в футере (px)</Label>
                <Input
                  type="number"
                  placeholder="48"
                  value={footerLogoSize}
                  onChange={(e) => setFooterLogoSize(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Название сайта в футере</Label>
                <Input
                  placeholder="Садовый Сервис"
                  value={footerSiteName}
                  onChange={(e) => setFooterSiteName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Если не указано, используется основное название
                </p>
              </div>
              <div>
                <Label>Размер названия в футере (px)</Label>
                <Input
                  type="number"
                  placeholder="24"
                  value={footerSiteNameSize}
                  onChange={(e) => setFooterSiteNameSize(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Описание под логотипом</Label>
                <Textarea
                  placeholder="Профессиональный уход за садом и участком"
                  value={footerDescription}
                  onChange={(e) => setFooterDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>Размер описания (px)</Label>
                <Input
                  type="number"
                  placeholder="14"
                  value={footerDescriptionSize}
                  onChange={(e) => setFooterDescriptionSize(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Копирайт (внизу футера)</Label>
                <Input
                  placeholder="© 2024 ТимГарден. Все права защищены."
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                />
              </div>
              <div>
                <Label>Размер копирайта (px)</Label>
                <Input
                  type="number"
                  placeholder="14"
                  value={footerCopyrightSize}
                  onChange={(e) => setFooterCopyrightSize(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>SEO настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Favicon</Label>
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
                    <TabsTrigger value="url">Вставить URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-3">
                    <ImageUploader
                      value={favicon}
                      onChange={setFavicon}
                    />
                  </TabsContent>
                  <TabsContent value="url" className="mt-3">
                    <Input
                      type="url"
                      placeholder="https://example.com/favicon.ico"
                      value={favicon}
                      onChange={(e) => setFavicon(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              <div>
                <Label>Заголовок страницы (Title)</Label>
                <Input
                  placeholder="Садовый Сервис"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Отображается во вкладке браузера
                </p>
              </div>
            </div>
            
            <div>
              <Label>Meta Title</Label>
              <Input
                placeholder="Садовый Сервис - профессиональный уход за садом"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуемая длина: 50-60 символов
              </p>
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea
                placeholder="Профессиональные услуги по уходу за садом и участком. Обрезка деревьев, уход за газоном, ландшафтный дизайн."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Рекомендуемая длина: 150-160 символов
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Блоки контента</span>
                <Badge variant="secondary">В разработке</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Конструктор блоков контента будет добавлен в следующей версии.
              Сейчас блоки редактируются через код.
            </p>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
}