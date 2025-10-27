import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const Home = () => {
  const services = [
    { 
      icon: "TreeDeciduous", 
      title: "Уход за растениями", 
      description: "Обрезка, кронирование, прививка деревьев и кустарников" 
    },
    { 
      icon: "Sprout", 
      title: "Газоны и почва", 
      description: "Стрижка, аэрация, удобрение и восстановление газонов" 
    },
    { 
      icon: "Flower2", 
      title: "Ландшафтный дизайн", 
      description: "Озеленение, цветники, автополив и освещение участка" 
    },
    { 
      icon: "Bug", 
      title: "Защита растений", 
      description: "Обработка от вредителей, болезней, клещей и комаров" 
    }
  ];

  const team = [
    { name: "Сергей Зеленский", role: "Главный агроном", photo: "https://i.pravatar.cc/300?img=12" },
    { name: "Ольга Садовая", role: "Ландшафтный дизайнер", photo: "https://i.pravatar.cc/300?img=5" },
    { name: "Игорь Лесник", role: "Специалист по деревьям", photo: "https://i.pravatar.cc/300?img=14" }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2NmJiNmEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNS41MjMtNC40NzcgMTAtMTAgMTBzLTEwLTQuNDc3LTEwLTEwIDQuNDc3LTEwIDEwLTEwIDEwIDQuNDc3IDEwIDEwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-foreground">
            Ваш сад —<br />
            <span className="text-primary">наша забота</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Профессиональный уход за садом и ландшафтное обслуживание
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/portfolio">
              <Button size="lg" className="text-lg px-8">
                Наши работы
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Связаться с нами
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Наши услуги</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Комплексный уход за вашим участком круглый год
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in border-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Icon name={service.icon} className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="outline" size="lg">
                Все услуги и цены
                <Icon name="ChevronRight" className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Наша команда</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Опытные специалисты с профильным образованием
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Хотите красивый участок?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Оставьте заявку, и мы приедем на бесплатную консультацию с выездом на участок.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Вызвать специалиста
              <Icon name="MessageSquare" className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;