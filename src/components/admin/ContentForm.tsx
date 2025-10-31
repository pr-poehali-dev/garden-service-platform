import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import ImageUploader from '@/components/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'images' | 'datetime' | 'image';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface ContentFormProps {
  title: string;
  fields: Field[];
  values: Record<string, unknown>;
  visible: boolean;
  isRemoved: boolean;
  onChange: (name: string, value: unknown) => void;
  onSave: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
  onRestore?: () => void;
  onBack: () => void;
  isNew?: boolean;
}

export function ContentForm({
  title,
  fields,
  values,
  visible,
  isRemoved,
  onChange,
  onSave,
  onToggleVisibility,
  onRemove,
  onRestore,
  onBack,
  isNew = false
}: ContentFormProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleChange = (name: string, value: unknown) => {
    setHasUnsavedChanges(true);
    onChange(name, value);
  };

  const handleSave = () => {
    onSave();
    setHasUnsavedChanges(false);
  };
  const renderField = (field: Field) => {
    const value = values[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value as string || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            id={field.name}
            type="number"
            placeholder={field.placeholder}
            value={value as number || ''}
            onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
          />
        );

      case 'datetime':
        return (
          <Input
            id={field.name}
            type="datetime-local"
            value={value as string || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case 'images':
        return (
          <div className="space-y-2">
            <Input
              id={field.name}
              placeholder="URL изображения"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value) {
                    const currentImages = (value as string[]) || [];
                    handleChange(field.name, [...currentImages, input.value]);
                    input.value = '';
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {((value as string[]) || []).map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="" className="w-20 h-20 object-cover rounded border" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const currentImages = (value as string[]) || [];
                      handleChange(field.name, currentImages.filter((_, i) => i !== idx));
                    }}
                  >
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Введите URL изображения и нажмите Enter
            </p>
          </div>
        );

      case 'image':
        return (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
              <TabsTrigger value="url">Вставить URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-3">
              <ImageUploader
                value={value as string || ''}
                onChange={(dataUrl) => handleChange(field.name, dataUrl)}
              />
            </TabsContent>
            <TabsContent value="url" className="mt-3">
              <Input
                id={field.name}
                type="url"
                placeholder={field.placeholder || 'https://example.com/image.jpg'}
                value={value as string || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </TabsContent>
          </Tabs>
        );

      default:
        return (
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={value as string || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <Icon name="ArrowLeft" size={18} />
          </Button>
          <h2 className="text-2xl font-bold">{title}</h2>
          {hasUnsavedChanges && <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Несохраненные изменения</Badge>}
          {isRemoved ? (
            <Badge variant="destructive">Удалено</Badge>
          ) : visible ? (
            <Badge className="bg-green-500">Видно</Badge>
          ) : (
            <Badge variant="secondary">Скрыто</Badge>
          )}
        </div>

        <div className="flex gap-2">
          {isRemoved && onRestore ? (
            <Button variant="outline" onClick={onRestore}>
              <Icon name="RotateCcw" size={18} className="mr-2" />
              Восстановить
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onToggleVisibility}>
                <Icon name={visible ? 'EyeOff' : 'Eye'} size={18} className="mr-2" />
                {visible ? 'Скрыть' : 'Показать'}
              </Button>
              
              {!isNew && (
                <Button variant="destructive" onClick={onRemove}>
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Удалить
                </Button>
              )}
            </>
          )}
          
          <Button onClick={handleSave} variant={hasUnsavedChanges ? "default" : "outline"}>
            <Icon name="Save" size={18} className="mr-2" />
            {hasUnsavedChanges ? 'Сохранить изменения' : 'Сохранено'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}