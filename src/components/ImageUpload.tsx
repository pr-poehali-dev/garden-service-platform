import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  multiple?: boolean;
  maxSize?: number;
  preview?: boolean;
  currentImage?: string;
}

const ImageUpload = ({ 
  onUpload, 
  multiple = false, 
  maxSize = 5 * 1024 * 1024,
  preview = true,
  currentImage
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const file = files[0];
      
      if (file.size > maxSize) {
        toast({
          title: "Файл слишком большой",
          description: `Максимальный размер: ${maxSize / 1024 / 1024}МБ`,
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Неверный формат",
          description: "Пожалуйста, выберите изображение",
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        if (preview) {
          setPreviewUrl(imageUrl);
        }
        
        onUpload(imageUrl);
        
        toast({
          title: "Изображение загружено",
          description: "Не забудьте сохранить изменения"
        });
        
        setUploading(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось прочитать файл",
          variant: "destructive"
        });
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive"
      });
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
            Загрузка...
          </>
        ) : (
          <>
            <Icon name="Upload" size={18} className="mr-2" />
            {multiple ? 'Загрузить изображения' : 'Загрузить изображение'}
          </>
        )}
      </Button>

      {preview && previewUrl && (
        <div className="relative rounded-lg overflow-hidden border-2 border-border">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-40 object-cover"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => {
              setPreviewUrl(null);
              onUpload('');
            }}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
