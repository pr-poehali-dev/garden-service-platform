import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id?: number;
  name: string;
  position: string;
  photo: string;
  order_index: number;
}

const AdminTeam = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TeamMember>({
    name: '',
    position: '',
    photo: '',
    order_index: 0
  });

  const fetchTeam = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9018c722-ce86-4b29-84e0-c715ce7b4034');
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Failed to fetch team:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить команду",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    } else {
      fetchTeam();
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId 
        ? { ...formData, id: editingId }
        : formData;

      const response = await fetch('https://functions.poehali.dev/9018c722-ce86-4b29-84e0-c715ce7b4034', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: editingId ? "Сотрудник обновлен" : "Сотрудник добавлен"
        });
        
        setFormData({ name: '', position: '', photo: '', order_index: 0 });
        setEditingId(null);
        fetchTeam();
      }
    } catch (error) {
      console.error('Failed to save member:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить сотрудника",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      position: member.position,
      photo: member.photo,
      order_index: member.order_index
    });
    setEditingId(member.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/9018c722-ce86-4b29-84e0-c715ce7b4034?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Сотрудник удален"
        });
        fetchTeam();
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сотрудника",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', position: '', photo: '', order_index: 0 });
    setEditingId(null);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Управление командой</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ФИО
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Должность
                  </label>
                  <Input
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Главный агроном"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Фото (URL)
                  </label>
                  <Input
                    required
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Порядок отображения
                  </label>
                  <Input
                    type="number"
                    required
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    placeholder="1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Icon name={editingId ? "Save" : "Plus"} size={18} className="mr-2" />
                    {editingId ? 'Сохранить' : 'Добавить'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Отмена
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Текущая команда</h2>
            {team.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Порядок: {member.order_index}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(member.id!)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeam;