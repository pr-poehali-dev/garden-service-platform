-- Добавление полей брендинга в таблицу homepage
ALTER TABLE homepage 
ADD COLUMN IF NOT EXISTS site_name_size VARCHAR(10),
ADD COLUMN IF NOT EXISTS logo_size VARCHAR(10),
ADD COLUMN IF NOT EXISTS page_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS footer_logo TEXT,
ADD COLUMN IF NOT EXISTS footer_logo_size VARCHAR(10),
ADD COLUMN IF NOT EXISTS footer_site_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS footer_site_name_size VARCHAR(10),
ADD COLUMN IF NOT EXISTS footer_description TEXT,
ADD COLUMN IF NOT EXISTS footer_description_size VARCHAR(10),
ADD COLUMN IF NOT EXISTS footer_copyright TEXT,
ADD COLUMN IF NOT EXISTS footer_copyright_size VARCHAR(10);