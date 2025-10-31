CREATE TABLE homepage (
  id INTEGER PRIMARY KEY,
  site_name VARCHAR(255),
  logo TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_bg TEXT,
  blocks JSONB,
  meta_title VARCHAR(255),
  meta_description TEXT,
  updated_at TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO homepage (id, updated_at) VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING;