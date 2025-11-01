-- Создание таблицы для хранения настроек сайта
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  
  -- Общие настройки сайта
  site_name VARCHAR(255),
  site_description TEXT,
  
  -- Логотип и визуальные настройки шапки
  logo TEXT,
  logo_size INTEGER DEFAULT 40,
  site_name_size INTEGER DEFAULT 24,
  
  -- Настройки футера
  footer_logo TEXT,
  footer_logo_size INTEGER DEFAULT 40,
  footer_site_name VARCHAR(255),
  footer_site_name_size INTEGER DEFAULT 20,
  footer_description TEXT,
  footer_description_size INTEGER DEFAULT 14,
  copyright_text TEXT,
  copyright_text_size INTEGER DEFAULT 12,
  
  -- SEO настройки
  favicon TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Цветовая схема
  colors JSONB DEFAULT '{}'::jsonb,
  
  -- Дополнительные настройки (для будущего расширения)
  custom_settings JSONB DEFAULT '{}'::jsonb,
  
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT single_row_only CHECK (id = 1)
);

-- Вставка дефолтной записи
INSERT INTO site_settings (id, site_name, meta_title)
VALUES (1, 'Мой сайт', 'Главная страница')
ON CONFLICT (id) DO NOTHING;

-- Создание индекса для быстрого доступа
CREATE INDEX IF NOT EXISTS idx_site_settings_updated ON site_settings(updated_at);