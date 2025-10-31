import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import func2url from "../../backend/func2url.json";

interface ImageUploaderProps {
  value: string;
  onChange: (dataUrl: string) => void;
  onClear?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ImageUploader = ({ value, onChange, onClear }: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Файл должен быть изображением",
        variant: "destructive"
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Файл слишком большой",
        description: "Максимальный размер файла: 5 МБ",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      const readFilePromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsDataURL(file);
      });
      
      const dataUrl = await readFilePromise;
      
      const response = await fetch(func2url['upload-image'], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file: dataUrl,
          filename: file.name
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки на сервер');
      }
      
      const result = await response.json();
      onChange(result.url);
      
      toast({
        title: "Изображение загружено",
        description: `Файл ${file.name} успешно сохранён на сервере`
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: error instanceof Error ? error.message : "Не удалось загрузить изображение",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden border">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1"
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Заменить
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleClear}
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 border-dashed"
        >
          <div className="text-center">
            <Icon 
              name={isUploading ? "Loader2" : "Upload"} 
              size={32} 
              className={`mx-auto mb-2 ${isUploading ? 'animate-spin' : ''}`} 
            />
            <p className="text-sm font-medium">
              {isUploading ? "Загрузка..." : "Загрузить изображение"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, WebP до 5 МБ
            </p>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;