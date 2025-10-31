ALTER TABLE team_members ADD COLUMN IF NOT EXISTS visible BOOLEAN;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sort_order INTEGER;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS removed_at TIMESTAMP;

CREATE INDEX idx_team_members_visible ON team_members(visible);