-- Fix security warning: Add search_path to the new trigger function
CREATE OR REPLACE FUNCTION update_pharmacy_link_timestamp()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Update last_price_update only if price fields changed
  IF (OLD.regular_price IS DISTINCT FROM NEW.regular_price) OR 
     (OLD.sale_price IS DISTINCT FROM NEW.sale_price) THEN
    NEW.last_price_update = now();
  END IF;
  
  RETURN NEW;
END;
$$;