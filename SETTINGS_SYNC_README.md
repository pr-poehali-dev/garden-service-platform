# Система синхронизации настроек

## Обзор

Все настройки сайта теперь хранятся на бэкенде в PostgreSQL и автоматически синхронизируются между админ-панелью и фронтендом.

## Архитектура

### 1. База данных

Создано 2 таблицы:
- **`site_settings`** - глобальные настройки сайта (логотипы, размеры, цвета, SEO)
- **`homepage`** - расширена для хранения брендинговых настроек главной страницы

### 2. Backend API

**Эндпоинт:** `https://functions.poehali.dev/e85da2aa-0f7b-4f5f-9d51-6a4c1ec22c27`

#### GET запрос - Получить все настройки
```bash
GET /
```

Возвращает:
```json
{
  "siteSettings": {...},
  "homepage": {...},
  "contacts": {...},
  "services": [...],
  "reviews": [...],
  "team": [...],
  "posts": [...]
}
```

#### POST запрос - Обновить настройки
```bash
POST /
Content-Type: application/json

{
  "section": "siteSettings" | "homepage" | "contacts",
  "data": {
    // поля для обновления
  }
}
```

### 3. Frontend

#### Контексты
- **SiteSettingsContext** - для публичных настроек (контакты, брендинг)
- **AdminContentContext** - для админской работы со всеми данными

#### Автоматическая синхронизация
```typescript
// Загрузка при старте приложения
useEffect(() => {
  fetchSettings();
}, []);

// Автоматическое обновление при изменениях
const updateSettings = async (data) => {
  await API.post('/settings', { section: 'siteSettings', data });
  await refresh(); // Обновить локальный стате
};
```

## Доступные настройки

### Шапка сайта (Header)
- `site_name` - название сайта
- `site_name_size` - размер названия (px)
- `logo` - URL логотипа
- `logo_size` - размер логотипа (px)

### Футер (Footer)
- `footer_logo` - логотип для футера
- `footer_logo_size` - размер логотипа в футере
- `footer_site_name` - название сайта в футере
- `footer_site_name_size` - размер названия в футере
- `footer_description` - описание под логотипом
- `footer_description_size` - размер описания
- `copyright_text` - текст копирайта
- `copyright_text_size` - размер копирайта

### SEO
- `favicon` - иконка сайта (автоматически применяется)
- `meta_title` - заголовок страницы в браузере
- `meta_description` - описание для поисковиков

### Контакты
- `phones` - массив телефонов
- `address` - адрес
- `messengers` - мессенджеры (telegram, whatsapp)
- `socials` - социальные сети

## Как это работает

### Для пользователя (посетителя сайта):
1. При загрузке сайта фронтенд делает GET запрос к API
2. Получает актуальные настройки из базы данных
3. Применяет их ко всем компонентам (header, footer, meta-теги)
4. Данные кэшируются в контексте React

### Для администратора:
1. Заходит в админ-панель → "Главная страница"
2. Изменяет настройки (логотип, размеры, тексты)
3. Нажимает "Сохранить изменения"
4. Данные отправляются POST запросом в API
5. API сохраняет в PostgreSQL
6. Админ-панель обновляет локальное состояние
7. ✅ **Все посетители сайта сразу видят изменения при следующей загрузке страницы**

## Преимущества

✅ **Постоянное хранение** - данные в PostgreSQL, не пропадают при перезагрузке  
✅ **Центральное управление** - одна точка правды для всех настроек  
✅ **Автоматическая синхронизация** - изменения применяются автоматически  
✅ **Масштабируемость** - легко добавлять новые настройки  
✅ **Производительность** - данные кэшируются на фронте  

## Примеры использования

### Изменить логотип и название сайта
```typescript
await updateHomepage({
  logo: 'https://example.com/new-logo.png',
  logo_size: '64',
  site_name: 'Новое название',
  site_name_size: '28'
});
```

### Обновить контакты
```typescript
await updateContactPage({
  phones: ['+7 (999) 123-45-67'],
  address: 'г. Москва, ул. Новая, д. 1',
  messengers: {
    telegram: '@newbot',
    whatsapp: '+79991234567'
  }
});
```

### Установить favicon
```typescript
await updateHomepage({
  favicon: 'https://example.com/favicon.ico'
});
// Автоматически применится на всех страницах!
```

## Миграции базы данных

Все изменения схемы хранятся в `db_migrations/`:
- `V0010__create_site_settings_table.sql` - создание таблицы site_settings
- `V0011__add_branding_fields_to_homepage.sql` - добавление полей брендинга

## API Reference

### GET /settings
Получить все настройки сайта

**Response:**
```json
{
  "siteSettings": {
    "id": 1,
    "site_name": "Мой сайт",
    "logo": "https://...",
    "logo_size": 40,
    "colors": {},
    ...
  },
  "homepage": {...},
  "contacts": {...},
  "services": [...],
  ...
}
```

### POST /settings
Обновить раздел настроек

**Request:**
```json
{
  "section": "homepage",
  "data": {
    "site_name": "Новое название",
    "logo_size": 50
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Homepage updated"
}
```

## Файлы проекта

### Backend
- `backend/settings/index.py` - API для работы с настройками
- `backend/settings/requirements.txt` - зависимости
- `backend/settings/tests.json` - тесты API

### Frontend
- `src/contexts/SiteSettingsContext.tsx` - контекст для публичных настроек
- `src/contexts/AdminContentContext.tsx` - контекст для админки
- `src/components/Layout.tsx` - использует настройки в Header/Footer
- `src/pages/Home.tsx` - применяет SEO настройки
- `src/pages/AdminContentHomepage.tsx` - админ-панель редактирования

### Database
- `db_migrations/V0010__create_site_settings_table.sql`
- `db_migrations/V0011__add_branding_fields_to_homepage.sql`

## Что дальше?

Теперь вы можете:
1. Зайти в админ-панель `/admin`
2. Перейти в "Главная страница"
3. Настроить все параметры сайта
4. Сохранить изменения
5. Увидеть результат на сайте мгновенно!

Все настройки сохраняются в базе данных и применяются автоматически для всех пользователей.
