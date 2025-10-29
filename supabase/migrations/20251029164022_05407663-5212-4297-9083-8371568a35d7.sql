-- Expandir la lista de farmacias y medicamentos con enlaces de búsqueda funcionales
-- Los enlaces de búsqueda son más confiables que enlaces directos a productos

-- Agregar más variaciones de Levotiroxina en diferentes farmacias y marcas
INSERT INTO pharmacy_links (medication_name, pharmacy_name, presentation, price, product_url) VALUES
-- Levotiroxina - más opciones y marcas
('levotiroxina', 'Cruz Verde', 'Eutirox 50mcg x30', 7990, 'https://www.cruzverde.cl/search?q=levotiroxina+50mcg'),
('levotiroxina', 'Cruz Verde', 'Eutirox 75mcg x30', 8490, 'https://www.cruzverde.cl/search?q=levotiroxina+75mcg'),
('levotiroxina', 'Cruz Verde', 'Levotiroxina Sódica 100mcg x30', 7490, 'https://www.cruzverde.cl/search?q=levotiroxina'),
('levotiroxina', 'Salcobrand', 'Eutirox 50mcg x30', 8290, 'https://www.salcobrand.cl/buscar?q=levotiroxina+50mcg'),
('levotiroxina', 'Salcobrand', 'Eutirox 75mcg x30', 8990, 'https://www.salcobrand.cl/buscar?q=levotiroxina+75mcg'),
('levotiroxina', 'Salcobrand', 'Levotiroxina Sódica 100mcg x30', 7990, 'https://www.salcobrand.cl/buscar?q=levotiroxina'),
('levotiroxina', 'Farmacias del Dr. Simi', 'Levotiroxina 50mcg x30', 6990, 'https://www.farmaciasdesimi.cl/search?q=levotiroxina'),
('levotiroxina', 'Farmacias del Dr. Simi', 'Levotiroxina 75mcg x30', 7490, 'https://www.farmaciasdesimi.cl/search?q=levotiroxina'),
('levotiroxina', 'Farmacias Ahumada', 'Eutirox 50mcg x30', 8190, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina+50mcg'),
('levotiroxina', 'Farmacias Ahumada', 'Eutirox 75mcg x30', 8690, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina+75mcg'),
('levotiroxina', 'Farmacias Ahumada', 'Levotiroxina Sódica 100mcg x30', 7690, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina+sodica'),

-- Metimazol - más opciones y marcas
('metimazol', 'Cruz Verde', 'Tapazol 10mg x30', 16990, 'https://www.cruzverde.cl/search?q=metimazol'),
('metimazol', 'Cruz Verde', 'Metimazol 5mg x50', 18990, 'https://www.cruzverde.cl/search?q=metimazol'),
('metimazol', 'Salcobrand', 'Tapazol 10mg x30', 17490, 'https://www.salcobrand.cl/buscar?q=metimazol'),
('metimazol', 'Salcobrand', 'Metimazol 5mg x50', 19990, 'https://www.salcobrand.cl/buscar?q=metimazol'),
('metimazol', 'Farmacias del Dr. Simi', 'Metimazol 10mg x30', 14990, 'https://www.farmaciasdesimi.cl/search?q=metimazol'),
('metimazol', 'Farmacias del Dr. Simi', 'Metimazol 5mg x50', 16990, 'https://www.farmaciasdesimi.cl/search?q=metimazol'),
('metimazol', 'Farmacias Ahumada', 'Tapazol 10mg x30', 15990, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=metimazol'),
('metimazol', 'Farmacias Ahumada', 'Metimazol 5mg x50', 17990, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=metimazol'),

-- Propranolol - más opciones y marcas
('propranolol', 'Cruz Verde', 'Propranolol 10mg x30', 4990, 'https://www.cruzverde.cl/search?q=propranolol'),
('propranolol', 'Cruz Verde', 'Propranolol 80mg x30', 7990, 'https://www.cruzverde.cl/search?q=propranolol+80mg'),
('propranolol', 'Salcobrand', 'Propranolol 10mg x30', 5490, 'https://www.salcobrand.cl/buscar?q=propranolol'),
('propranolol', 'Salcobrand', 'Propranolol 80mg x30', 8490, 'https://www.salcobrand.cl/buscar?q=propranolol+80mg'),
('propranolol', 'Farmacias del Dr. Simi', 'Propranolol 10mg x30', 2990, 'https://www.farmaciasdesimi.cl/search?q=propranolol'),
('propranolol', 'Farmacias del Dr. Simi', 'Propranolol 80mg x30', 5990, 'https://www.farmaciasdesimi.cl/search?q=propranolol'),
('propranolol', 'Farmacias Ahumada', 'Propranolol 10mg x30', 4290, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=propranolol'),
('propranolol', 'Farmacias Ahumada', 'Propranolol 80mg x30', 6990, 'https://www.farmaciasahumada.cl/catalogsearch/result/?q=propranolol+80mg');

-- Actualizar los enlaces existentes que están apuntando a las páginas principales
-- Para usar enlaces de búsqueda más funcionales
UPDATE pharmacy_links 
SET product_url = 'https://www.cruzverde.cl/search?q=levotiroxina',
    updated_at = now()
WHERE pharmacy_name = 'Cruz Verde' AND medication_name = 'levotiroxina' AND presentation = 'Eutirox 100mcg x30';

UPDATE pharmacy_links 
SET product_url = 'https://www.salcobrand.cl/buscar?q=levotiroxina',
    updated_at = now()
WHERE pharmacy_name = 'Salcobrand' AND medication_name = 'levotiroxina';

UPDATE pharmacy_links 
SET product_url = 'https://www.farmaciasdesimi.cl/search?q=levotiroxina',
    updated_at = now()
WHERE pharmacy_name = 'Farmacias del Dr. Simi' AND medication_name = 'levotiroxina';

UPDATE pharmacy_links 
SET product_url = 'https://www.cruzverde.cl/search?q=metimazol',
    updated_at = now()
WHERE pharmacy_name = 'Cruz Verde' AND medication_name = 'metimazol';

UPDATE pharmacy_links 
SET product_url = 'https://www.salcobrand.cl/buscar?q=metimazol',
    updated_at = now()
WHERE pharmacy_name = 'Salcobrand' AND medication_name = 'metimazol';

UPDATE pharmacy_links 
SET product_url = 'https://www.farmaciasdesimi.cl/search?q=metimazol',
    updated_at = now()
WHERE pharmacy_name = 'Farmacias del Dr. Simi' AND medication_name = 'metimazol';

UPDATE pharmacy_links 
SET product_url = 'https://www.cruzverde.cl/search?q=propranolol',
    updated_at = now()
WHERE pharmacy_name = 'Cruz Verde' AND medication_name = 'propranolol';

UPDATE pharmacy_links 
SET product_url = 'https://www.salcobrand.cl/buscar?q=propranolol',
    updated_at = now()
WHERE pharmacy_name = 'Salcobrand' AND medication_name = 'propranolol';

UPDATE pharmacy_links 
SET product_url = 'https://www.farmaciasdesimi.cl/search?q=propranolol',
    updated_at = now()
WHERE pharmacy_name = 'Farmacias del Dr. Simi' AND medication_name = 'propranolol';