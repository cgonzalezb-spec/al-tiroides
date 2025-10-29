-- Actualizar URLs de farmacias para que funcionen correctamente
-- Cambiar a las páginas principales de cada farmacia para mejor compatibilidad

UPDATE pharmacy_links 
SET product_url = 'https://www.cruzverde.cl/',
    updated_at = now()
WHERE pharmacy_name = 'Cruz Verde';

UPDATE pharmacy_links 
SET product_url = 'https://www.salcobrand.cl/',
    updated_at = now()
WHERE pharmacy_name = 'Salcobrand';

UPDATE pharmacy_links 
SET product_url = 'https://www.farmaciasdesimi.cl/',
    updated_at = now()
WHERE pharmacy_name = 'Farmacias del Dr. Simi';