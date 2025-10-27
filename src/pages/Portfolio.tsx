import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  client: string;
  year: string;
  results: string[];
  tags: string[];
}

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["Все", "Брендинг", "Веб-дизайн", "Мобильные приложения", "Маркетинг"];

  const projects: Project[] = [
    {
      id: 1,
      title: "Ребрендинг IT-компании",
      category: "Брендинг",
      image: "https://cdn.poehali.dev/projects/70d15d82-c7b9-4b92-b392-4f15c11436f7/files/33ff9de6-8916-46b7-8fb6-af92a01b91f3.jpg",
      description: "Полный ребрендинг крупной IT-компании, включая разработку нового логотипа, фирменного стиля и брендбука. Задача состояла в создании современного образа, отражающего инновационность и надежность компании.",
      client: "TechCorp Solutions",
      year: "2024",
      results: [
        "Узнаваемость бренда выросла на 45%",
        "Увеличение конверсии сайта на 32%",
        "Положительные отзывы от 89% клиентов"
      ],
      tags: ["Логотип", "Фирменный стиль", "Брендбук"]
    },
    {
      id: 2,
      title: "Мобильное приложение для фитнеса",
      category: "Мобильные приложения",
      image: "https://cdn.poehali.dev/projects/70d15d82-c7b9-4b92-b392-4f15c11436f7/files/f7d4ed01-1a42-447b-b262-6fff2ea4094c.jpg",
      description: "Разработка UX/UI дизайна для мобильного приложения по фитнесу. Создали интуитивный интерфейс с функциями отслеживания тренировок, питания и прогресса пользователя.",
      client: "FitLife App",
      year: "2024",
      results: [
        "4.8 звезд в App Store",
        "200K+ скачиваний за первый месяц",
        "Средняя сессия 15 минут"
      ],
      tags: ["UI/UX", "iOS", "Android", "Прототипирование"]
    },
    {
      id: 3,
      title: "Интернет-магазин эко-косметики",
      category: "Веб-дизайн",
      image: "https://cdn.poehali.dev/projects/70d15d82-c7b9-4b92-b392-4f15c11436f7/files/a2fa925a-a198-495b-bfb0-b60562ee92e2.jpg",
      description: "Создание полнофункционального интернет-магазина с акцентом на эко-дружественность и натуральность продукции. Разработали уникальный дизайн, отражающий ценности бренда.",
      client: "EcoBeauty",
      year: "2023",
      results: [
        "Рост продаж на 127% за квартал",
        "Снижение отказов до 12%",
        "Увеличение среднего чека на 38%"
      ],
      tags: ["E-commerce", "Адаптивный дизайн", "UX"]
    },
    {
      id: 4,
      title: "SMM стратегия для ресторана",
      category: "Маркетинг",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      description: "Комплексная SMM-стратегия для сети ресторанов премиум-класса. Создали контент-план, провели фотосессии блюд и запустили таргетированную рекламу.",
      client: "Gourmet House",
      year: "2024",
      results: [
        "+25K подписчиков за 3 месяца",
        "Рост посещаемости на 40%",
        "ROI рекламы 320%"
      ],
      tags: ["SMM", "Контент", "Таргет", "Фотосъемка"]
    },
    {
      id: 5,
      title: "Корпоративный сайт строительной компании",
      category: "Веб-дизайн",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      description: "Разработка представительского сайта с портфолио реализованных проектов, интерактивными 3D-туром и системой онлайн-консультаций.",
      client: "СтройМастер",
      year: "2023",
      results: [
        "Увеличение заявок на 85%",
        "Сокращение времени консультации на 60%",
        "Повышение доверия клиентов"
      ],
      tags: ["Корпоративный сайт", "3D", "Портфолио"]
    },
    {
      id: 6,
      title: "Редизайн банковского приложения",
      category: "Мобильные приложения",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
      description: "Полный редизайн мобильного банковского приложения с упрощением пользовательских сценариев и внедрением новых функций безопасности.",
      client: "Банк Будущего",
      year: "2024",
      results: [
        "Упрощение навигации на 55%",
        "Рост активных пользователей на 42%",
        "Снижение обращений в поддержку на 38%"
      ],
      tags: ["Финтех", "UI/UX", "Редизайн"]
    }
  ];

  const filteredProjects = selectedCategory === "Все" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Портфолио
            </h1>
            <p className="text-xl text-muted-foreground">
              Наши лучшие проекты и кейсы с детальным описанием результатов
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <Card 
                key={project.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Button variant="secondary" size="sm">
                      Подробнее
                      <Icon name="ArrowRight" className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3">{project.category}</Badge>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl mb-2">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProject.client} • {selectedProject.year}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-80 object-cover rounded-lg"
                />
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">О проекте</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Результаты</h3>
                  <ul className="space-y-2">
                    {selectedProject.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Icon name="CheckCircle2" className="text-primary mt-1 flex-shrink-0" size={20} />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Технологии и услуги</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
