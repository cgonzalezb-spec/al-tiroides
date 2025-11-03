-- Add price fields to pharmacy_links table
ALTER TABLE pharmacy_links 
ADD COLUMN regular_price integer,
ADD COLUMN sale_price integer,
ADD COLUMN last_price_update timestamp with time zone DEFAULT now();

-- Migrate existing price data to regular_price
UPDATE pharmacy_links SET regular_price = price WHERE regular_price IS NULL;

-- Update the updated_at timestamp trigger to also update last_price_update when prices change
CREATE OR REPLACE FUNCTION update_pharmacy_link_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Update last_price_update only if price fields changed
  IF (OLD.regular_price IS DISTINCT FROM NEW.regular_price) OR 
     (OLD.sale_price IS DISTINCT FROM NEW.sale_price) THEN
    NEW.last_price_update = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pharmacy_links_update_timestamp
BEFORE UPDATE ON pharmacy_links
FOR EACH ROW
EXECUTE FUNCTION update_pharmacy_link_timestamp();