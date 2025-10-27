import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useAuth } from "@/contexts/AuthContext";

const Portfolio = () => {
  const { posts } = usePortfolio();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Наши работы
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Реализованные проекты по уходу за садом и ландшафтному дизайну
            </p>
            {isAdmin && (
              <Link to="/admin">
                <Button size="lg" className="gap-2">
                  <Icon name="Settings" size={20} />
                  Управление портфолио
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <Icon name="ImageOff" size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Портфолио пока пусто</h2>
              <p className="text-muted-foreground mb-6">
                {isAdmin 
                  ? "Добавьте первый проект через админ-панель" 
                  : "Скоро здесь появятся наши работы"}
              </p>
              {isAdmin && (
                <Link to="/admin">
                  <Button size="lg">
                    <Icon name="Plus" className="mr-2" size={20} />
                    Добавить проект
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Card 
                  key={post.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground">{post.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {!isAdmin && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Хотите так же?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Закажите бесплатную консультацию, и мы создадим проект специально для вашего участка
            </p>
            <Link to="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Получить консультацию
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Portfolio;
