import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useServices } from "@/contexts/ServicesContext";

const Services = () => {
  const { categories } = useServices();

  const services = Object.keys(categories)
    .filter(slug => categories[slug].visible !== false)
    .map(slug => ({
      slug,
      title: categories[slug].title,
      description: categories[slug].description,
      icon: categories[slug].icon
    }));

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-br from-background via-secondary to-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Услуги и цены
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Link key={service.slug} to={`/services/${service.slug}`}>
                <Card 
                  className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in group"
                >
                  <CardHeader>
                    <div className="w-16 h-16 mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon name={service.icon} className="text-primary" size={32} />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary font-semibold">
                      Смотреть услуги
                      <Icon name="ArrowRight" className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;