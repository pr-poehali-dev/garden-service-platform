import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { useAdminContent } from "@/contexts/AdminContentContext";

const Contact = () => {
  const { toast } = useToast();
  const { contactPage, fetchContactPage } = useAdminContent();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    fetchContactPage();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contacts = [
    {
      icon: "Phone" as const,
      title: "Телефон",
      info: contactPage?.phones?.[0] || "+7 (495) 123-45-67"
    },
    {
      icon: "MessageCircle" as const,
      title: "Telegram",
      info: contactPage?.messengers?.telegram || "@garden_service"
    },
    {
      icon: "Phone" as const,
      title: "WhatsApp",
      info: contactPage?.messengers?.whatsapp || "+7 (999) 123-45-67"
    },
    {
      icon: "MapPin" as const,
      title: "Адрес",
      info: contactPage?.address || "г. Москва"
    }
  ].filter(c => c.info);

  const socials = [
    contactPage?.socials?.instagram && { icon: "Instagram" as const, link: contactPage.socials.instagram, label: "Instagram" },
    contactPage?.socials?.facebook && { icon: "Facebook" as const, link: contactPage.socials.facebook, label: "Facebook" },
    contactPage?.socials?.vk && { icon: "Share2" as const, link: contactPage.socials.vk, label: "ВКонтакте" },
    contactPage?.messengers?.telegram && { icon: "MessageCircle" as const, link: `https://t.me/${contactPage.messengers.telegram.replace('@', '')}`, label: "Telegram" }
  ].filter(Boolean) as Array<{ icon: string; link: string; label: string }>;

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl text-muted-foreground">
              Готовы обсудить ваш проект? Напишите нам или приезжайте в офис на чашку кофе
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Оставьте заявку</h2>
              <p className="text-muted-foreground mb-8">
                Заполните форму, и наш менеджер свяжется с вами в течение часа
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Иван Иванов"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ivan@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Расскажите о вашем проекте..."
                    rows={5}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Отправить заявку
                  <Icon name="Send" className="ml-2" size={18} />
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <h2 className="text-3xl font-bold mb-6">Контактная информация</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardContent className="p-6 flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name={contact.icon} className="text-primary" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{contact.title}</h3>
                          <p className="text-muted-foreground">{contact.info}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle>Мы в социальных сетях</CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      Следите за нашими новостями и проектами
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.link}
                          className="w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                          aria-label={social.label}
                        >
                          <Icon name={social.icon} size={20} />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.4447834162395!2d37.60822431592874!3d55.75583998055653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a50b315e573%3A0xa886bf5a3d9b2e68!2z0KLQstC10YDRgdC60LDRjyDRg9C7Liwg0JzQvtGB0LrQstCwLCDQoNC-0YHRgdC40Y8!5e0!3m2!1sru!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Карта офиса"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Есть вопросы?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Позвоните нам прямо сейчас, и мы ответим на все ваши вопросы
          </p>
          <a href="tel:+74951234567">
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Icon name="Phone" className="mr-2" size={20} />
              +7 (495) 123-45-67
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;