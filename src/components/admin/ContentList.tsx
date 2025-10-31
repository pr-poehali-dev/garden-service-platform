import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  visible: boolean;
  removed_at?: string;
  [key: string]: unknown;
}

interface ContentListProps<T extends ContentItem> {
  items: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  onItemClick: (item: T) => void;
  onItemCreate: () => void;
  onItemToggleVisibility: (id: number) => void;
  onItemRestore?: (id: number) => void;
  renderItemDetails?: (item: T) => React.ReactNode;
  createButtonText?: string;
  emptyText?: string;
  showVisibilityFilter?: boolean;
}

export function ContentList<T extends ContentItem>({
  items,
  loading = false,
  searchPlaceholder = 'Поиск...',
  onItemClick,
  onItemCreate,
  onItemToggleVisibility,
  onItemRestore,
  renderItemDetails,
  createButtonText = 'Создать',
  emptyText = 'Нет элементов',
  showVisibilityFilter = true
}: ContentListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden' | 'removed'>('visible');

  const filteredItems = items.filter(item => {
    const itemTitle = item.title || item.name || '';
    const matchesSearch = itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (visibilityFilter === 'visible') return item.visible && !item.removed_at;
    if (visibilityFilter === 'hidden') return !item.visible && !item.removed_at;
    if (visibilityFilter === 'removed') return !!item.removed_at;
    
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {showVisibilityFilter && (
          <Select value={visibilityFilter} onValueChange={(v) => setVisibilityFilter(v as typeof visibilityFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Видимые</SelectItem>
              <SelectItem value="hidden">Скрытые</SelectItem>
              <SelectItem value="removed">Удалённые</SelectItem>
              <SelectItem value="all">Все</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button onClick={onItemCreate}>
          <Icon name="Plus" size={18} className="mr-2" />
          {createButtonText}
        </Button>
      </div>

      {loading ? (
        <Card className="p-12 text-center">
          <Icon name="Loader2" size={32} className="mx-auto animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center">
          <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground opacity-50" />
          <p className="mt-4 text-muted-foreground">{emptyText}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => {
            const itemTitle = item.title || item.name || 'Без названия';
            const isRemoved = !!item.removed_at;
            
            return (
              <Card
                key={item.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onItemClick(item)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg truncate">{itemTitle}</h3>
                      
                      {isRemoved ? (
                        <Badge variant="destructive">Удалено</Badge>
                      ) : item.visible ? (
                        <Badge className="bg-green-500">Видно</Badge>
                      ) : (
                        <Badge variant="secondary">Скрыто</Badge>
                      )}
                    </div>
                    
                    {renderItemDetails && (
                      <div className="text-sm text-muted-foreground">
                        {renderItemDetails(item)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {isRemoved && onItemRestore ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onItemRestore(item.id)}
                        title="Восстановить"
                      >
                        <Icon name="RotateCcw" size={16} />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onItemToggleVisibility(item.id)}
                        title={item.visible ? 'Скрыть' : 'Показать'}
                      >
                        <Icon name={item.visible ? 'EyeOff' : 'Eye'} size={16} />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onItemClick(item)}
                    >
                      <Icon name="ChevronRight" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
