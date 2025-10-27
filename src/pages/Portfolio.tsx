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
  area: string;
  results: string[];
  tags: string[];
}

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["Все", "Ландшафт", "Уход за садом", "Газоны", "Благоустройство"];

  const projects: Project[] = [
    {
      id: 1,
      title: "Загородная усадьба в Подмосковье",
      category: "Ландшафт",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      description: "Комплексное благоустройство участка площадью 25 соток. Создали альпийскую горку, розарий, систему автополива и декоративное освещение. Высадили более 120 растений, включая хвойные и плодовые деревья.",
      client: "Семья Ивановых",
      year: "2024",
      area: "25 соток",
      results: [
        "Создано 5 функциональных зон",
        "Установлена система автополива на 12 зон",
        "Высажено 120+ растений",
        "Гарантия на растения 2 года"
      ],
      tags: ["Проектирование", "Озеленение", "Автополив", "Освещение"]
    },
    {
      id: 2,
      title: "Уход за старинным садом",
      category: "Уход за садом",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      description: "Восстановление и омоложение старинного сада 19 века. Провели санитарную обрезку 45 взрослых деревьев, лечение от болезней, формирующую обрезку кустарников и восстановление газона.",
      client: "Усадьба «Зелёный бор»",
      year: "2023",
      area: "1.2 га",
      results: [
        "Спасены 40 из 45 старых деревьев",
        "Полностью устранены болезни и вредители",
        "Восстановлено 3000 м² газона",
        "Сад внесён в список охраняемых"
      ],
      tags: ["Обрезка", "Лечение", "Реставрация", "Газон"]
    },
    {
      id: 3,
      title: "Идеальный газон у коттеджа",
      category: "Газоны",
      image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800&q=80",
      description: "Создание партерного газона премиум-класса площадью 800 м². Использовали рулонный газон из элитных сортов трав, установили систему автоматического полива и регулярного ухода.",
      client: "Резиденция на Рублёвке",
      year: "2024",
      area: "800 м²",
      results: [
        "Идеально ровная поверхность",
        "Приживаемость газона 98%",
        "Система ухода на 12 месяцев",
        "Сохранность без проплешин"
      ],
      tags: ["Рулонный газон", "Автополив", "Уход", "Премиум"]
    },
    {
      id: 4,
      title: "Японский сад камней",
      category: "Ландшафт",
      image: "https://images.unsplash.com/photo-1601696822937-c3fde46e0e7e?w=800&q=80",
      description: "Создание аутентичного японского сада в стиле дзен. Использовали натуральные камни, карликовые сосны, бамбук и создали сухой ручей. Каждый элемент подобран по философии японского садоводства.",
      client: "Wellness-центр «Гармония»",
      year: "2023",
      area: "15 соток",
      results: [
        "Создано пространство для медитации",
        "100% аутентичный стиль",
        "Минимальный уход",
        "Положительные отзывы всех гостей"
      ],
      tags: ["Японский стиль", "Камни", "Бонсай", "Дизайн"]
    },
    {
      id: 5,
      title: "Вертикальное озеленение террасы",
      category: "Благоустройство",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
      description: "Создание вертикального сада на террасе пентхауса. Установили фитостены, систему капельного полива и автоматическую подсветку. Использовали 15 видов растений, устойчивых к городским условиям.",
      client: "Пентхаус на Патриарших",
      year: "2024",
      area: "45 м²",
      results: [
        "Зелёная стена площадью 20 м²",
        "Автоматический уход",
        "Улучшение микроклимата на 40%",
        "Живая стена круглый год"
      ],
      tags: ["Фитостены", "Вертикальное озеленение", "Автополив"]
    },
    {
      id: 6,
      title: "Плодовый сад с ягодником",
      category: "Уход за садом",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
      description: "Посадка и уход за плодовым садом: 25 яблонь, 15 вишен, 10 слив, малинник и смородина. Провели формирующую обрезку, обработку от вредителей и подкормку. Организовали правильное расстояние и совместимость культур.",
      client: "Фермерское хозяйство",
      year: "2023",
      area: "30 соток",
      results: [
        "Приживаемость 95%",
        "Первый урожай уже через год",
        "Защита от вредителей на 2 сезона",
        "Увеличение урожая на 60%"
      ],
      tags: ["Плодовые", "Прививка", "Обрезка", "Защита"]
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
              Портфолио работ
            </h1>
            <p className="text-xl text-muted-foreground">
              Реализованные проекты по ландшафтному дизайну и уходу за садом
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
                    <span>{project.area}</span>
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
                  {selectedProject.client} • {selectedProject.year} • {selectedProject.area}
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
                  <h3 className="text-xl font-semibold mb-3">Результаты работы</h3>
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
                  <h3 className="text-xl font-semibold mb-3">Выполненные работы</h3>
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
