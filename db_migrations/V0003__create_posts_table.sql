CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  published_at TIMESTAMP,
  excerpt TEXT,
  body TEXT,
  gallery TEXT[],
  visible BOOLEAN,
  meta_title VARCHAR(255),
  meta_description TEXT,
  removed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_visible ON posts(visible);