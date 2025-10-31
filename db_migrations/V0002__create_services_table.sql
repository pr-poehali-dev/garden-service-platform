CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_desc TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  unit VARCHAR(50),
  visible BOOLEAN,
  sort_order INTEGER,
  images TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  removed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_visible ON services(visible);