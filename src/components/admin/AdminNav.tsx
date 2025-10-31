import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function AdminNav() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!'
    });
  };

  const navItems = [
    { path: '/admin/orders', label: 'Заявки', icon: 'Mail' },
    { path: '/admin/content/services', label: 'Услуги', icon: 'Briefcase' },
    { path: '/admin/content/posts', label: 'Наши работы', icon: 'Image' },
    { path: '/admin/content/team', label: 'Команда', icon: 'Users' },
    { path: '/admin/content/contact', label: 'Контакты', icon: 'Phone' },
    { path: '/admin/content/homepage', label: 'Главная', icon: 'Home' }
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin/orders" className="flex items-center gap-2">
              <Icon name="LayoutDashboard" size={24} />
              <span className="font-bold text-lg">Админ-панель</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon name={item.icon as never} size={16} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Icon name="ExternalLink" size={16} className="mr-2" />
                На сайт
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}