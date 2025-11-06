-- Add bioequivalent field to pharmacy_links table
ALTER TABLE pharmacy_links 
ADD COLUMN is_bioequivalent boolean NOT NULL DEFAULT false;