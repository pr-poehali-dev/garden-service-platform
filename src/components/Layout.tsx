import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useOrder();

  const navigation = [
    { name: "Главная", path: "/" },
    { name: "Услуги и цены", path: "/services" },
    { name: "Портфолио", path: "/portfolio" },
    { name: "Контакты", path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="TreeDeciduous" className="text-primary-foreground" size={24} />
              </div>
              <span className="text-2xl font-bold">Тимирязевец</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="transition-all"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/order" className="relative">
                <Button size="lg" variant="outline" className="gap-2">
                  <Icon name="ShoppingCart" size={18} />
                  Заявка
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-bold">
                      {items.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  <Icon name="Mail" size={18} />
                  Связаться
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4 animate-fade-in">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full gap-2 mt-2">
                    <Icon name="Mail" size={18} />
                    Связаться
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center">
                  <Icon name="TreeDeciduous" className="text-background" size={24} />
                </div>
                <span className="text-2xl font-bold">Тимирязевец</span>
              </div>
              <p className="text-background/70">
                Профессиональный уход за садом и участком
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-background/70">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  hello@agency.ru
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="mt-1" />
                  <span>г. Москва, ул. Тверская, 12</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Социальные сети</h3>
              <div className="flex gap-3">
                {["Instagram", "Facebook", "Linkedin", "MessageCircle"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={social}
                  >
                    <Icon name={social} size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 pt-8 text-center text-background/60">
            <p>© 2024 Тимирязевец. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;