import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import func2url from "../../backend/func2url.json";

interface Review {
  id: number;
  name: string;
  email: string;
  phone?: string;
  rating: number;
  text: string;
  photos: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const AdminContentReviews = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    } else {
      fetchReviews();
    }
  }, [isAdmin, navigate]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(func2url.reviews);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(func2url.reviews, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      
      if (response.ok) {
        setReviews(prev =>
          prev.map(review =>
            review.id === id ? { ...review, status: "approved" as const } : review
          )
        );
        toast({
          title: "Отзыв одобрен",
          description: "Отзыв будет отображаться на сайте",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить отзыв",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(func2url.reviews, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      });
      
      if (response.ok) {
        setReviews(prev =>
          prev.map(review =>
            review.id === id ? { ...review, status: "rejected" as const } : review
          )
        );
        toast({
          title: "Отзыв отклонен",
          description: "Отзыв не будет отображаться на сайте",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить отзыв",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(func2url.reviews, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        setReviews(prev => prev.filter(review => review.id !== id));
        toast({
          title: "Отзыв удален",
          description: "Отзыв удален из базы данных",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить отзыв",
        variant: "destructive"
      });
    }
  };

  const filteredReviews = filter === "all" 
    ? reviews 
    : reviews.filter(r => r.status === filter);

  const pendingCount = reviews.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Модерация отзывов</h1>
            <p className="text-muted-foreground">Управляйте отзывами клиентов</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/admin/content">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Link>
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            Все ({reviews.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            className="relative"
          >
            На модерации ({pendingCount})
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === "approved" ? "default" : "outline"}
            onClick={() => setFilter("approved")}
          >
            Одобренные ({reviews.filter(r => r.status === "approved").length})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => setFilter("rejected")}
          >
            Отклоненные ({reviews.filter(r => r.status === "rejected").length})
          </Button>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{review.name}</CardTitle>
                      <Badge
                        variant={
                          review.status === "approved"
                            ? "default"
                            : review.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {review.status === "approved" && "Одобрен"}
                        {review.status === "pending" && "На модерации"}
                        {review.status === "rejected" && "Отклонен"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2 space-y-1">
                      {review.email && (
                        <p className="flex items-center gap-2">
                          <Icon name="Mail" size={14} />
                          {review.email}
                        </p>
                      )}
                      {review.phone && (
                        <p className="flex items-center gap-2">
                          <Icon name="Phone" size={14} />
                          {review.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={18}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{review.text}</p>
                
                {review.photos && review.photos.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                    {review.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {review.status !== "approved" && (
                    <Button
                      onClick={() => handleApprove(review.id)}
                      variant="default"
                      size="sm"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Одобрить
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      onClick={() => handleReject(review.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отклонить
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(review.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredReviews.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Отзывов не найдено</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContentReviews;