import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const Reviews = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    text: "",
    photos: [] as string[]
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Анна Петрова",
      date: "15 октября 2024",
      rating: 5,
      text: "Отличная работа! Приехали вовремя, все сделали качественно. Газон выглядит идеально, деревья обрезали профессионально.",
      photos: []
    },
    {
      id: 2,
      name: "Сергей Иванов",
      date: "3 октября 2024",
      rating: 5,
      text: "Очень довольны результатом. Создали красивые цветники, установили автополив. Рекомендую!",
      photos: []
    },
    {
      id: 3,
      name: "Мария Смирнова",
      date: "28 сентября 2024",
      rating: 4,
      text: "Хорошая команда специалистов. Привели участок в порядок после зимы. Единственное - хотелось бы чуть побыстрее.",
      photos: []
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Спасибо за отзыв!",
      description: "Ваш отзыв будет опубликован после модерации.",
    });
    setFormData({ name: "", email: "", rating: 5, text: "", photos: [] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    
    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
        
        newPhotos.push(photoUrl);
      }
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
      
      toast({
        title: "Фото загружены",
        description: `Добавлено фотографий: ${newPhotos.length}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фото",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Отзывы клиентов</h1>
          <p className="text-xl text-muted-foreground">
            Мы ценим мнение каждого клиента
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{review.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={20}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">{review.text}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {review.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Фото ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageSquarePlus" size={24} className="text-primary" />
                  Написать отзыв
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ivan@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Оценка</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className="focus:outline-none"
                        >
                          <Icon
                            name="Star"
                            size={28}
                            className={
                              star <= formData.rating
                                ? "fill-yellow-400 text-yellow-400 cursor-pointer"
                                : "text-gray-300 cursor-pointer hover:text-yellow-400"
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text">Ваш отзыв</Label>
                    <Textarea
                      id="text"
                      name="text"
                      value={formData.text}
                      onChange={handleChange}
                      placeholder="Расскажите о вашем опыте..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="photos">Фотографии (необязательно)</Label>
                    <div className="mt-2">
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-primary transition-colors">
                          <Icon name="ImagePlus" size={32} className="mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {uploadingPhoto ? "Загрузка..." : "Нажмите, чтобы загрузить фото"}
                          </p>
                        </div>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                    </div>
                    
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {formData.photos.map((photo, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={photo}
                              alt={`Фото ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Icon name="X" size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Отправить отзыв
                    <Icon name="Send" className="ml-2" size={18} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;