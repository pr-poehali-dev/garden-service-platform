CREATE TABLE contact_page (
  id INTEGER PRIMARY KEY,
  phones TEXT[],
  messengers JSONB,
  address TEXT,
  map_embed TEXT,
  socials JSONB,
  requisites JSONB,
  updated_at TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO contact_page (id, updated_at) VALUES (1, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING;