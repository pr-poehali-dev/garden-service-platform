import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import ApplicationModal from '@/components/admin/ApplicationModal';

const APPLICATIONS_API = 'https://functions.poehali.dev/de9da4fe-5fbe-4e4b-a161-3951cdae2ccf';

interface ApplicationItem {
  service_id: number;
  title: string;
  qty: number;
  price: number;
  total: number;
}

interface Application {
  id: number;
  number: string;
  created_at: string;
  status: 'new' | 'approved' | 'closed' | 'converted_to_order';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_comment: string;
  items: ApplicationItem[];
  total_amount: number;
  source: string;
  notes: string | null;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  new: { label: 'Новая', variant: 'default' },
  approved: { label: 'Согласована', variant: 'secondary' },
  closed: { label: 'Закрыта', variant: 'outline' },
  converted_to_order: { label: 'В заказе', variant: 'secondary' }
};

export default function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(APPLICATIONS_API);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (application: Application) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedApplication(null);
  };

  const handleApplicationUpdated = () => {
    fetchApplications();
  };

  const filteredApplications = applications.filter(app => {
    const searchLower = searchQuery.toLowerCase();
    return (
      app.number.toLowerCase().includes(searchLower) ||
      app.customer_name.toLowerCase().includes(searchLower) ||
      app.customer_phone.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Заявки</h1>
          <p className="text-muted-foreground mt-2">
            Управление заявками с сайта
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру, имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={fetchApplications} variant="outline">
          <Icon name="RefreshCw" size={18} className="mr-2" />
          Обновить
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">№</th>
                <th className="text-left p-4 font-medium">Дата</th>
                <th className="text-left p-4 font-medium">Клиент</th>
                <th className="text-left p-4 font-medium">Телефон</th>
                <th className="text-right p-4 font-medium">Сумма</th>
                <th className="text-center p-4 font-medium">Статус</th>
                <th className="text-center p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-muted-foreground">
                    {searchQuery ? 'Заявки не найдены' : 'Нет заявок'}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleOpenModal(app)}
                  >
                    <td className="p-4 font-mono text-sm">{app.number}</td>
                    <td className="p-4">
                      {new Date(app.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">{app.customer_name}</td>
                    <td className="p-4">{app.customer_phone}</td>
                    <td className="p-4 text-right font-medium">
                      {Number(app.total_amount).toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={statusLabels[app.status]?.variant || 'default'}>
                        {statusLabels[app.status]?.label || app.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(app);
                        }}
                      >
                        <Icon name="Eye" size={16} className="mr-1" />
                        Открыть
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          open={modalOpen}
          onClose={handleCloseModal}
          onUpdated={handleApplicationUpdated}
        />
      )}
    </div>
  );
}