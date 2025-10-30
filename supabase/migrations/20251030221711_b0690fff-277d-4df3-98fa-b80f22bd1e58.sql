-- Add new columns to pharmacy_links table
ALTER TABLE pharmacy_links 
ADD COLUMN IF NOT EXISTS commercial_name TEXT,
ADD COLUMN IF NOT EXISTS laboratory TEXT,
ADD COLUMN IF NOT EXISTS mg_per_tablet TEXT;