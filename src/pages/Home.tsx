import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useAdminContent } from "@/contexts/AdminContentContext";
import { useEffect } from "react";

const Home = () => {
  const { homepage, fetchHomepage } = useAdminContent();

  useEffect(() => {
    fetchHomepage();
  }, []);

  useEffect(() => {
    if (homepage?.meta_title) {
      document.title = homepage.meta_title;
    }
    if (homepage?.meta_description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', homepage.meta_description);
      }
    }
  }, [homepage]);
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

  return (
    <div className="min-h-screen">
      <section 
        className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-secondary to-accent overflow-hidden"
        style={homepage?.hero_bg ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${homepage.hero_bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        {!homepage?.hero_bg && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2NmJiNmEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgNS41MjMtNC40NzcgMTAtMTAgMTBzLTEwLTQuNDc3LTEwLTEwIDQuNDc3LTEwIDEwLTEwIDEwIDQuNDc3IDEwIDEwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        )}
        
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-foreground">
            {homepage?.hero_title || (
              <>
                Ваш сад —<br />
                <span className="text-primary">наша забота</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {homepage?.hero_subtitle || "Профессиональный уход за садом и ландшафтное обслуживание"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/services/seasons">
              <Button size="lg" className="text-lg px-8">
                Востребованные услуги
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Все услуги и цены
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Наши услуги</h2>
          
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

    </div>
  );
};

export default Home;