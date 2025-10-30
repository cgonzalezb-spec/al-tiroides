-- Agregar columna para cantidad de comprimidos
ALTER TABLE pharmacy_links
ADD COLUMN quantity INTEGER;

COMMENT ON COLUMN pharmacy_links.quantity IS 'Cantidad de comprimidos/tabletas en la presentación';