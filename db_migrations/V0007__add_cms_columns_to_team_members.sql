-- Add role column to team_members table
ALTER TABLE t_p92769154_garden_service_platf.team_members 
ADD COLUMN IF NOT EXISTS role VARCHAR(255);

-- Copy data from position to role for existing records
UPDATE t_p92769154_garden_service_platf.team_members 
SET role = position 
WHERE role IS NULL;

-- Add updated_at column if not exists
ALTER TABLE t_p92769154_garden_service_platf.team_members 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add phone column if not exists
ALTER TABLE t_p92769154_garden_service_platf.team_members 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Add telegram column if not exists
ALTER TABLE t_p92769154_garden_service_platf.team_members 
ADD COLUMN IF NOT EXISTS telegram VARCHAR(100);