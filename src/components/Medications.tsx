import { Pill, Clock, AlertCircle, Heart, CheckCircle, ChevronDown, ExternalLink, ShoppingCart, Pencil, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MedicationDetails } from './MedicationDetails';

interface PharmacyLink {
  id?: string;
  name: string;
  brand: string;
  price: number;
  presentation: string;
  url: string;
  quantity?: number;
  pricePerUnit?: number;
  medication_name?: string;
  pharmacy_name?: string;
  commercial_name?: string;
  laboratory?: string;
  mg_per_tablet?: string;
  is_bioequivalent?: boolean;
}

// Logos de farmacias chilenas
const pharmacyLogos: Record<string, string> = {
  "Cruz Verde": "https://www.cruzverde.cl/on/demandware.static/-/Sites/default/dw8c0e9e21/images/logo-cv.svg",
  "Salcobrand": "https://www.salcobrand.cl/static/version1701357111/frontend/Cencosud/Salcobrand/es_CL/images/logo.svg",
  "Farmacias Ahumada": "https://www.farmaciasahumada.cl/on/demandware.static/Sites-FA-Site/-/default/dw0ce7c0de/images/logo.svg",
  "Dr. Simi": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Farmacias_del_Dr._Simi_logo.svg/200px-Farmacias_del_Dr._Simi_logo.svg.png"
};

interface EditFormData {
  id: string;
  medication_name: string;
  pharmacy_name: string;
  presentation: string;
  quantity: string;
  price: string;
  product_url: string;
  commercial_name: string;
  laboratory: string;
  mg_per_tablet: string;
  is_bioequivalent: boolean;
}

const Medications = () => {
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [openPrices, setOpenPrices] = useState<number | null>(null);
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [pharmacyData, setPharmacyData] = useState<Record<string, PharmacyLink[]>>({});
  const [selectedDose, setSelectedDose] = useState<Record<number, string>>({});
  const [showAllPrices, setShowAllPrices] = useState<Record<string, boolean>>({});
  const [filterBioequivalent, setFilterBioequivalent] = useState<Record<number, 'all' | 'only' | 'exclude'>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
  const [pharmacyLogosDb, setPharmacyLogosDb] = useState<Record<string, string>>({});
  const [editingLink, setEditingLink] = useState<EditFormData | null>(null);
  const [addFormData, setAddFormData] = useState<EditFormData>({
    id: '',
    medication_name: '',
    pharmacy_name: '',
    presentation: '',
    quantity: '',
    price: '',
    product_url: '',
    commercial_name: '',
    laboratory: '',
    mg_per_tablet: '',
    is_bioequivalent: false,
  });
  const { toast } = useToast();
  const { isAdmin } = useRole();
  const queryClient = useQueryClient();

  // Mutation para crear enlaces
  const createLinkMutation = useMutation({
    mutationFn: async (data: Omit<EditFormData, 'id'>) => {
      const { error } = await supabase
        .from('pharmacy_links')
        .insert({
          medication_name: data.medication_name,
          pharmacy_name: data.pharmacy_name,
          presentation: data.presentation,
          quantity: data.quantity ? parseInt(data.quantity) : null,
          price: parseInt(data.price),
          product_url: data.product_url,
          commercial_name: data.commercial_name || null,
          laboratory: data.laboratory || null,
          mg_per_tablet: data.mg_per_tablet || null,
          is_bioequivalent: data.is_bioequivalent,
          is_active: true,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Medicamento creado exitosamente' });
      setIsAddDialogOpen(false);
      setAddFormData({
        id: '',
        medication_name: '',
        pharmacy_name: '',
        presentation: '',
        quantity: '',
        price: '',
        product_url: '',
        commercial_name: '',
        laboratory: '',
        mg_per_tablet: '',
        is_bioequivalent: false,
      });
      fetchPharmacyLinks();
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
    },
    onError: () => {
      toast({ title: 'Error al crear medicamento', variant: 'destructive' });
    },
  });

  // Mutation para actualizar enlaces
  const updateLinkMutation = useMutation({
    mutationFn: async (data: EditFormData) => {
      const { error } = await supabase
        .from('pharmacy_links')
        .update({
          medication_name: data.medication_name,
          pharmacy_name: data.pharmacy_name,
          presentation: data.presentation,
          quantity: data.quantity ? parseInt(data.quantity) : null,
          price: parseInt(data.price),
          product_url: data.product_url,
          commercial_name: data.commercial_name || null,
          laboratory: data.laboratory || null,
          mg_per_tablet: data.mg_per_tablet || null,
          is_bioequivalent: data.is_bioequivalent,
        })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Enlace actualizado exitosamente' });
      setIsEditDialogOpen(false);
      setEditingLink(null);
      fetchPharmacyLinks();
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
    },
    onError: () => {
      toast({ title: 'Error al actualizar enlace', variant: 'destructive' });
    },
  });

  // Mutation para eliminar enlaces
  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pharmacy_links')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Medicamento eliminado exitosamente' });
      fetchPharmacyLinks();
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
    },
    onError: () => {
      toast({ title: 'Error al eliminar medicamento', variant: 'destructive' });
    },
  });

  // Cargar enlaces de farmacias desde la base de datos
  const fetchPharmacyLinks = async () => {
    const { data, error } = await supabase
      .from('pharmacy_links')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('Error loading pharmacy links:', error);
      toast({
        title: "Error al cargar precios",
        description: "Mostrando enlaces de búsqueda por defecto",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      const grouped: Record<string, PharmacyLink[]> = {};
      data.forEach((link) => {
        if (!grouped[link.medication_name]) {
          grouped[link.medication_name] = [];
        }
        // Extract brand from presentation or use pharmacy name as fallback
        const brand = link.presentation.split(' ')[0];
        const quantity = link.quantity || null;
        const pricePerUnit = quantity ? link.price / quantity : null;
        
        grouped[link.medication_name].push({
          id: link.id,
          name: link.pharmacy_name,
          brand: brand,
          price: link.price,
          presentation: link.presentation,
          url: link.product_url,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
          medication_name: link.medication_name,
          pharmacy_name: link.pharmacy_name,
          commercial_name: link.commercial_name,
          laboratory: link.laboratory,
          mg_per_tablet: link.mg_per_tablet,
          is_bioequivalent: link.is_bioequivalent || false,
        });
      });
      setPharmacyData(grouped);
    }
  };

  // Fetch pharmacy logos from database
  const fetchPharmacyLogos = async () => {
    const { data, error } = await supabase
      .from('pharmacy_logos')
      .select('pharmacy_name, logo_path');

    if (data && !error) {
      const logosMap: Record<string, string> = {};
      data.forEach(logo => {
        const { data: { publicUrl } } = supabase.storage
          .from('pharmacy-logos')
          .getPublicUrl(logo.logo_path);
        logosMap[logo.pharmacy_name] = publicUrl;
      });
      setPharmacyLogosDb(logosMap);
    }
  };

  useEffect(() => {
    fetchPharmacyLinks();
    fetchPharmacyLogos();
  }, [toast]);

  // Handle logo upload
  const handleLogoUpload = async (pharmacyName: string, file: File) => {
    try {
      setUploadingLogo(pharmacyName);
      
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Tipo de archivo no válido',
          description: 'Solo se permiten imágenes PNG, JPG, SVG o WEBP',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Archivo muy grande',
          description: 'El logo debe ser menor a 2MB',
          variant: 'destructive',
        });
        return;
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${pharmacyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('pharmacy-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Check if pharmacy logo already exists in database
      const { data: existing } = await supabase
        .from('pharmacy_logos')
        .select('id')
        .eq('pharmacy_name', pharmacyName)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pharmacy_logos')
          .update({ logo_path: fileName })
          .eq('pharmacy_name', pharmacyName);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pharmacy_logos')
          .insert({
            pharmacy_name: pharmacyName,
            logo_path: fileName,
          });

        if (insertError) throw insertError;
      }

      toast({
        title: 'Logo actualizado',
        description: `El logo de ${pharmacyName} se ha actualizado correctamente`,
      });

      // Refresh logos
      await fetchPharmacyLogos();
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Error al subir logo',
        description: error.message || 'Ocurrió un error al subir el logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(null);
    }
  };

  const handleEditLink = (link: PharmacyLink) => {
    if (!link.id) return;
    setEditingLink({
      id: link.id,
      medication_name: link.medication_name || '',
      pharmacy_name: link.pharmacy_name || '',
      presentation: link.presentation,
      quantity: link.quantity?.toString() || '',
      price: link.price.toString(),
      product_url: link.url,
      commercial_name: link.commercial_name || '',
      laboratory: link.laboratory || '',
      mg_per_tablet: link.mg_per_tablet || '',
      is_bioequivalent: link.is_bioequivalent || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    // Validación de URL
    try {
      new URL(editingLink.product_url);
    } catch {
      toast({ 
        title: 'URL inválida', 
        description: 'Por favor ingresa una URL válida',
        variant: 'destructive' 
      });
      return;
    }

    updateLinkMutation.mutate(editingLink);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de URL
    try {
      new URL(addFormData.product_url);
    } catch {
      toast({ 
        title: 'URL inválida', 
        description: 'Por favor ingresa una URL válida que comience con https://',
        variant: 'destructive' 
      });
      return;
    }

    if (!addFormData.medication_name || !addFormData.pharmacy_name || !addFormData.presentation || !addFormData.price || !addFormData.product_url) {
      toast({ title: 'Por favor completa todos los campos requeridos', variant: 'destructive' });
      return;
    }

    createLinkMutation.mutate(addFormData);
  };

  // Función para obtener enlaces de farmacias con fallback
  const getPharmacyLinks = (medicationKey: string): PharmacyLink[] => {
    // Si hay datos en la BD, usarlos
    if (pharmacyData[medicationKey] && pharmacyData[medicationKey].length > 0) {
      return pharmacyData[medicationKey];
    }
    
    // Fallback a búsquedas si no hay datos
    const fallbackLinks: Record<string, PharmacyLink[]> = {
      'levotiroxina': [
        { name: "Cruz Verde", brand: "Eutirox", price: 8990, presentation: "Eutirox 100mcg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 8990/30 },
        { name: "Salcobrand", brand: "Eutirox", price: 9490, presentation: "Eutirox 100mcg x30", url: "https://www.salcobrand.cl/", quantity: 30, pricePerUnit: 9490/30 },
        { name: "Farmacias Ahumada", brand: "Levotiroxina", price: 8790, presentation: "Levotiroxina 100mcg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina", quantity: 30, pricePerUnit: 8790/30 },
        { name: "Farmacias del Dr. Simi", brand: "Levotiroxina", price: 7990, presentation: "Levotiroxina 100mcg x30", url: "https://www.farmaciasdesimi.cl/", quantity: 30, pricePerUnit: 7990/30 },
        { name: "Cruz Verde", brand: "Euthyrox", price: 10490, presentation: "Euthyrox 100mcg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 10490/30 },
        { name: "Salcobrand", brand: "Levoid", price: 8290, presentation: "Levoid 100mcg x30", url: "https://www.salcobrand.cl/", quantity: 30, pricePerUnit: 8290/30 }
      ],
      'metimazol': [
        { name: "Cruz Verde", brand: "Tapazol", price: 14990, presentation: "Tapazol 5mg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 14990/30 },
        { name: "Salcobrand", brand: "Tapazol", price: 15490, presentation: "Tapazol 5mg x30", url: "https://www.salcobrand.cl/", quantity: 30, pricePerUnit: 15490/30 },
        { name: "Farmacias Ahumada", brand: "Metimazol", price: 13990, presentation: "Metimazol 5mg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=metimazol", quantity: 30, pricePerUnit: 13990/30 },
        { name: "Farmacias del Dr. Simi", brand: "Metimazol", price: 12990, presentation: "Metimazol 5mg x30", url: "https://www.farmaciasdesimi.cl/", quantity: 30, pricePerUnit: 12990/30 },
        { name: "Cruz Verde", brand: "Thiamazol", price: 13490, presentation: "Thiamazol 5mg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 13490/30 }
      ],
      'propranolol': [
        { name: "Cruz Verde", brand: "Propranolol", price: 5990, presentation: "Propranolol 40mg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 5990/30 },
        { name: "Salcobrand", brand: "Propranolol", price: 6490, presentation: "Propranolol 40mg x30", url: "https://www.salcobrand.cl/", quantity: 30, pricePerUnit: 6490/30 },
        { name: "Farmacias Ahumada", brand: "Propranolol", price: 4990, presentation: "Propranolol 40mg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=propranolol", quantity: 30, pricePerUnit: 4990/30 },
        { name: "Farmacias del Dr. Simi", brand: "Propranolol", price: 3990, presentation: "Propranolol 40mg x30", url: "https://www.farmaciasdesimi.cl/", quantity: 30, pricePerUnit: 3990/30 },
        { name: "Cruz Verde", brand: "Inderalici", price: 6990, presentation: "Inderalici 40mg x30", url: "https://www.cruzverde.cl/", quantity: 30, pricePerUnit: 6990/30 }
      ]
    };
    
    return fallbackLinks[medicationKey] || [];
  };

  const medications = [
    {
      name: "Levotiroxina",
      medicationKey: "levotiroxina",
      condition: "Hipotiroidismo",
      icon: <Pill className="h-6 w-6 text-blue-500" />,
      description: "Reemplaza la hormona T4 que tu tiroides no produce suficientemente",
      howItWorks: "Se convierte en T3 (hormona activa) en tu cuerpo, normalizando el metabolismo",
      dosage: "Usualmente 25-200 mcg al día, en ayunas",
      sideEffects: ["Palpitaciones si la dosis es muy alta", "Insomnio", "Pérdida de peso"],
      tips: ["Tomar en ayunas", "No mezclar con café o calcio", "Esperar 1 hora antes de desayunar"],
      pharmacodynamics: "Actúa uniéndose a receptores nucleares de hormonas tiroideas (TRα y TRβ) en las células, formando complejos con el ADN que regulan la transcripción de genes específicos que controlan el metabolismo basal, el crecimiento y el desarrollo celular.",
      pharmacokinetics: "Absorción: 40-80% en intestino delgado. Distribución: 99.97% unida a proteínas plasmáticas. Metabolismo: desyodación periférica a T3 (activa). Eliminación: vida media de 7 días, excreción renal y fecal.",
      therapeuticIndication: "Tratamiento de hipotiroidismo primario y secundario, supresión de TSH en cáncer de tiroides, bocio eutiroideo, mixedema y coma mixedematoso.",
      administrationRoutes: "Vía oral, preferiblemente en ayunas 30-60 minutos antes del desayuno. Tabletas de 25, 50, 75, 100, 125, 150 y 200 mcg.",
      adverseReactions: [
        "Cardiovascular: taquicardia, palpitaciones, arritmias, angina de pecho",
        "Sistema nervioso: temblor, insomnio, nerviosismo, cefalea, ansiedad",
        "Gastrointestinal: diarrea, vómitos, náuseas, cambios en el apetito",
        "Metabólico: pérdida de peso, intolerancia al calor, sudoración excesiva",
        "Musculoesquelético: debilidad muscular, calambres, pérdida de densidad ósea (sobredosis crónica)"
      ],
      drugInteractions: [
        "Antiácidos y sales de calcio: reducen absorción (separar 4 horas)",
        "Warfarina: aumenta efecto anticoagulante (ajustar dosis)",
        "Insulina/antidiabéticos: puede requerir ajuste de dosis",
        "Amiodarona: interfiere con conversión T4 a T3",
        "Café: reduce absorción hasta 55% (tomar en ayunas sin café)"
      ],
      pathologyInteractions: [
        "Diabetes mellitus: puede requerir ajuste de insulina/antidiabéticos",
        "Enfermedad cardiovascular: iniciar con dosis bajas, titular lentamente",
        "Insuficiencia adrenal: corregir antes de iniciar levotiroxina",
        "Osteoporosis: monitorear densidad ósea en terapia supresora"
      ]
    },
    {
      name: "Metimazol",
      medicationKey: "metimazol",
      condition: "Hipertiroidismo",
      icon: <Pill className="h-6 w-6 text-red-500" />,
      description: "Reduce la producción excesiva de hormonas tiroideas",
      howItWorks: "Bloquea las enzimas que producen hormonas tiroideas",
      dosage: "5-40 mg al día, según la severidad",
      sideEffects: ["Náuseas", "Dolor articular", "Rash cutáneo"],
      tips: ["Tomar con comida", "Controles de sangre regulares", "Reportar fiebre o dolor de garganta"],
      pharmacodynamics: "Inhibe la enzima tiroperoxidasa (TPO), esencial para la síntesis de hormonas tiroideas. Impide la oxidación del yoduro y su incorporación en los residuos de tirosina de la tiroglobulina, bloqueando así la formación de T3 y T4.",
      pharmacokinetics: "Absorción: rápida y casi completa (>90%). Distribución: concentración en tiroides. Metabolismo: hepático. Eliminación: vida media de 4-6 horas, excreción renal principal.",
      therapeuticIndication: "Hipertiroidismo (enfermedad de Graves, bocio tóxico multinodular), preparación prequirúrgica de tiroidectomía, crisis tirotóxica.",
      administrationRoutes: "Vía oral, puede tomarse con o sin alimentos. Tabletas de 5 mg y 10 mg. Dosis única diaria o dividida.",
      adverseReactions: [
        "Hematológicas: agranulocitosis (0.2-0.5%, grave), leucopenia, trombocitopenia",
        "Dermatológicas: urticaria, prurito, rash cutáneo, alopecia",
        "Gastrointestinal: náuseas, vómitos, alteración del gusto, epigastralgia",
        "Hepáticas: hepatotoxicidad, ictericia colestásica, elevación de transaminasas",
        "Articular: artralgias, mialgias, síndrome lupus-like"
      ],
      drugInteractions: [
        "Anticoagulantes (warfarina): puede potenciar efecto anticoagulante",
        "Beta-bloqueadores: efectos aditivos en control de síntomas",
        "Digoxina: niveles pueden aumentar al corregir hipertiroidismo",
        "Teofilina: aclaramiento aumenta en hipertiroidismo"
      ],
      pathologyInteractions: [
        "Embarazo: usar dosis mínima efectiva, riesgo de hipotiroidismo fetal",
        "Insuficiencia hepática: usar con precaución, riesgo de hepatotoxicidad",
        "Discrasias sanguíneas: contraindicado en agranulocitosis previa",
        "Lactancia: pasa a leche materna, usar con precaución"
      ]
    },
    {
      name: "Propranolol",
      medicationKey: "propranolol",
      condition: "Síntomas de hipertiroidismo",
      icon: <Heart className="h-6 w-6 text-green-500" />,
      description: "Controla síntomas como palpitaciones y temblores",
      howItWorks: "Bloquea los efectos del exceso de hormona tiroidea en el corazón",
      dosage: "10-40 mg cada 6-8 horas",
      sideEffects: ["Fatiga", "Mareos", "Manos frías"],
      tips: ["No suspender bruscamente", "Controlar presión arterial", "Cuidado en diabéticos"],
      pharmacodynamics: "Betabloqueador no selectivo que antagoniza competitivamente los receptores β1 y β2 adrenérgicos. Reduce síntomas adrenérgicos del hipertiroidismo (taquicardia, temblor, ansiedad) e inhibe la conversión periférica de T4 a T3.",
      pharmacokinetics: "Absorción: rápida, efecto de primer paso hepático significativo (biodisponibilidad 25%). Distribución: liposoluble, cruza barrera hematoencefálica. Metabolismo: hepático extenso. Eliminación: vida media 3-6 horas.",
      therapeuticIndication: "Control sintomático de hipertiroidismo (taquicardia, temblor, ansiedad), hipertensión arterial, angina de pecho, arritmias, profilaxis de migraña.",
      administrationRoutes: "Vía oral. Tabletas de 10 mg, 40 mg y 80 mg. Liberación inmediata o prolongada. Puede tomarse con o sin alimentos.",
      adverseReactions: [
        "Cardiovascular: bradicardia, hipotensión, insuficiencia cardíaca, bloqueo AV",
        "Respiratorio: broncoespasmo (especialmente en asmáticos/EPOC)",
        "Sistema nervioso: fatiga, mareos, depresión, insomnio, pesadillas",
        "Metabólico: hipoglucemia enmascarada en diabéticos, dislipidemia",
        "Vascular: extremidades frías, fenómeno de Raynaud, claudicación",
        "Otros: disfunción sexual, alteraciones del sueño, náuseas"
      ],
      drugInteractions: [
        "Antidiabéticos: enmascara síntomas de hipoglucemia",
        "Calcioantagonistas (verapamilo, diltiazem): riesgo de bradicardia severa",
        "Antiarrítmicos: efectos aditivos, riesgo de bradicardia",
        "AINEs: pueden reducir efecto antihipertensivo",
        "Alcohol: potencia efectos sedantes"
      ],
      pathologyInteractions: [
        "Asma/EPOC: contraindicado, riesgo de broncoespasmo severo",
        "Insuficiencia cardíaca descompensada: contraindicado",
        "Diabetes mellitus: enmascara síntomas de hipoglucemia",
        "Bradicardia/bloqueo AV: contraindicado",
        "Enfermedad vascular periférica: usar con precaución"
      ]
    }
  ];

  return (
    <section id="medicamentos" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Medicamentos para patologías tiroideas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce los tratamientos más comunes, cómo funcionan y qué esperar. 
            Recuerda que solo un médico puede recetarte medicamentos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {medications.map((med, index) => (
            <React.Fragment key={index}>
            <Card
              key={index} 
              className={`h-full flex flex-col hover:shadow-lg transition-shadow ${selectedMed === index ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  {med.icon}
                  <Badge variant="outline">{med.condition}</Badge>
                </div>
                <CardTitle className="text-xl">{med.name}</CardTitle>
                <CardDescription>{med.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Tabs defaultValue="how" className="w-full flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="how">¿Cómo?</TabsTrigger>
                    <TabsTrigger value="dose">Dosis</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="how" className="mt-4">
                    <p className="text-sm text-gray-600">{med.howItWorks}</p>
                  </TabsContent>
                  
                  <TabsContent value="dose" className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{med.dosage}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium">Efectos secundarios:</p>
                      {med.sideEffects.map((effect, i) => (
                        <p key={i} className="text-xs text-gray-600">• {effect}</p>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tips" className="mt-4">
                    <div className="space-y-2">
                      {med.tips.map((tip, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  variant={selectedMed === index ? "default" : "outline"} 
                  className="w-full mt-4"
                  onClick={() => setSelectedMed(selectedMed === index ? null : index)}
                >
                  {selectedMed === index ? 'Ver menos' : 'Más detalles'}
                </Button>
              </CardContent>
            </Card>

            {/* Contenido expandido debajo del medicamento - Mobile: debajo de cada card, Desktop: se muestra después del grid */}
            {selectedMed === index && (
              <>
                {/* Versión Mobile/Tablet - muestra debajo de cada card */}
                <Card className="lg:hidden mb-8 animate-fade-in">
                  <MedicationDetails
                    medication={med}
                    medIndex={index}
                    openDetails={openDetails}
                    setOpenDetails={setOpenDetails}
                    openPrices={openPrices}
                    setOpenPrices={setOpenPrices}
                    getPharmacyLinks={getPharmacyLinks}
                    selectedDose={selectedDose}
                    setSelectedDose={setSelectedDose}
                    showAllPrices={showAllPrices}
                    setShowAllPrices={setShowAllPrices}
                    pharmacyLogos={pharmacyLogos}
                    pharmacyLogosDb={pharmacyLogosDb}
                    isAdmin={isAdmin}
                    uploadingLogo={uploadingLogo}
                    handleLogoUpload={handleLogoUpload}
                    setEditingLink={setEditingLink}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    deleteLinkMutation={deleteLinkMutation}
                  />
                </Card>
              </>
            )}
          </React.Fragment>
          ))}
        </div>

        {/* Versión Desktop - muestra debajo de las 3 cajas */}
        {selectedMed !== null && (
          <Card className="hidden lg:block mb-8 animate-fade-in">
            <MedicationDetails
              medication={medications[selectedMed]}
              medIndex={selectedMed}
              openDetails={openDetails}
              setOpenDetails={setOpenDetails}
              openPrices={openPrices}
              setOpenPrices={setOpenPrices}
              getPharmacyLinks={getPharmacyLinks}
              selectedDose={selectedDose}
              setSelectedDose={setSelectedDose}
              showAllPrices={showAllPrices}
              setShowAllPrices={setShowAllPrices}
              pharmacyLogos={pharmacyLogos}
              pharmacyLogosDb={pharmacyLogosDb}
              isAdmin={isAdmin}
              uploadingLogo={uploadingLogo}
              handleLogoUpload={handleLogoUpload}
              setEditingLink={setEditingLink}
              setIsEditDialogOpen={setIsEditDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              deleteLinkMutation={deleteLinkMutation}
            />
          </Card>
        )}

        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-amber-800">
              ⚠️ Importante sobre medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Nunca te automediques</h4>
                <p className="text-sm text-amber-700">
                  Solo un médico puede determinar qué medicamento necesitas y en qué dosis
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Sigue las indicaciones</h4>
                <p className="text-sm text-amber-700">
                  Los medicamentos tiroideos requieren horarios específicos y controles regulares
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de edición para administradores */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Enlace de Farmacia</DialogTitle>
            <DialogDescription>
              Modifica los datos del enlace del medicamento
            </DialogDescription>
          </DialogHeader>
          {editingLink && (
              <form onSubmit={handleSubmitEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medication_name">Medicamento *</Label>
                  <Select
                    value={editingLink.medication_name}
                    onValueChange={(value) => setEditingLink({ ...editingLink, medication_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="levotiroxina">Levotiroxina</SelectItem>
                      <SelectItem value="metimazol">Metimazol</SelectItem>
                      <SelectItem value="propranolol">Propranolol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacy_name">Farmacia *</Label>
                  <Select
                    value={editingLink.pharmacy_name}
                    onValueChange={(value) => setEditingLink({ ...editingLink, pharmacy_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una farmacia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmacias Ahumada">Farmacias Ahumada</SelectItem>
                      <SelectItem value="Cruz Verde">Cruz Verde</SelectItem>
                      <SelectItem value="Salcobrand">Salcobrand</SelectItem>
                      <SelectItem value="Dr. Simi">Dr. Simi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commercial_name">Nombre Comercial</Label>
                    <Input
                      id="commercial_name"
                      placeholder="Ej: Eutirox, Levoid"
                      value={editingLink.commercial_name}
                      onChange={(e) => setEditingLink({ ...editingLink, commercial_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="laboratory">Laboratorio</Label>
                    <Input
                      id="laboratory"
                      placeholder="Ej: Merck, Abbott"
                      value={editingLink.laboratory}
                      onChange={(e) => setEditingLink({ ...editingLink, laboratory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mg_per_tablet">mg/Comprimido</Label>
                  <Input
                    id="mg_per_tablet"
                    placeholder="Ej: 100mcg, 5mg"
                    value={editingLink.mg_per_tablet}
                    onChange={(e) => setEditingLink({ ...editingLink, mg_per_tablet: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Dosis por comprimido</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación *</Label>
                  <Input
                    id="presentation"
                    placeholder="Ej: Levotiroxina 100mcg x30 comprimidos"
                    value={editingLink.presentation}
                    onChange={(e) => setEditingLink({ ...editingLink, presentation: e.target.value })}
                  />
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad de comprimidos</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Ej: 30"
                    value={editingLink.quantity}
                    onChange={(e) => setEditingLink({ ...editingLink, quantity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio (CLP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Ej: 8790"
                    value={editingLink.price}
                    onChange={(e) => setEditingLink({ ...editingLink, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_url">URL del Producto *</Label>
                <Textarea
                  id="product_url"
                  placeholder="https://www.farmacia.com/producto/..."
                  value={editingLink.product_url}
                  onChange={(e) => setEditingLink({ ...editingLink, product_url: e.target.value })}
                  rows={3}
                />
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                  <p className="text-xs text-yellow-800">
                    ⚠️ Debe ser un enlace DIRECTO al producto, no a una página de búsqueda
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit_is_bioequivalent"
                    checked={editingLink.is_bioequivalent}
                    onChange={(e) => setEditingLink({ ...editingLink, is_bioequivalent: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="edit_is_bioequivalent" className="cursor-pointer">
                    Es bioequivalente
                  </Label>
                </div>
                <p className="text-xs text-gray-500">Marca si este medicamento es bioequivalente</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingLink(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Actualizar Enlace
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de agregar medicamento para administradores */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo enlace de farmacia
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add_medication_name">1. Medicamento *</Label>
              <Select
                value={addFormData.medication_name}
                onValueChange={(value) => setAddFormData({ ...addFormData, medication_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un medicamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="levotiroxina">Levotiroxina</SelectItem>
                  <SelectItem value="metimazol">Metimazol</SelectItem>
                  <SelectItem value="propranolol">Propranolol</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add_pharmacy_name">2. Farmacia *</Label>
              <Select
                value={addFormData.pharmacy_name}
                onValueChange={(value) => setAddFormData({ ...addFormData, pharmacy_name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una farmacia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farmacias Ahumada">Farmacias Ahumada</SelectItem>
                  <SelectItem value="Cruz Verde">Cruz Verde</SelectItem>
                  <SelectItem value="Salcobrand">Salcobrand</SelectItem>
                  <SelectItem value="Dr. Simi">Dr. Simi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_commercial_name">3. Nombre Comercial</Label>
                <Input
                  id="add_commercial_name"
                  placeholder="Ej: Eutirox, Levoid"
                  value={addFormData.commercial_name}
                  onChange={(e) => setAddFormData({ ...addFormData, commercial_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add_laboratory">4. Laboratorio</Label>
                <Input
                  id="add_laboratory"
                  placeholder="Ej: Merck, Abbott"
                  value={addFormData.laboratory}
                  onChange={(e) => setAddFormData({ ...addFormData, laboratory: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add_presentation">5. Presentación *</Label>
              <Input
                id="add_presentation"
                placeholder="Ej: Levotiroxina 100mcg x30 comprimidos"
                value={addFormData.presentation}
                onChange={(e) => setAddFormData({ ...addFormData, presentation: e.target.value })}
              />
              <p className="text-xs text-gray-500">Describe la presentación del producto completa</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add_mg_per_tablet">6. Dosis (mcg, mg o g)</Label>
                <Input
                  id="add_mg_per_tablet"
                  placeholder="Ej: 100mcg, 5mg, 1g"
                  value={addFormData.mg_per_tablet}
                  onChange={(e) => setAddFormData({ ...addFormData, mg_per_tablet: e.target.value })}
                />
                <p className="text-xs text-gray-500">Dosis por comprimido</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add_quantity">7. Cantidad de comprimidos</Label>
                <Input
                  id="add_quantity"
                  type="number"
                  placeholder="Ej: 30"
                  value={addFormData.quantity}
                  onChange={(e) => setAddFormData({ ...addFormData, quantity: e.target.value })}
                />
                <p className="text-xs text-gray-500">N° de comprimidos en el envase</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add_price">8. Precio (CLP) *</Label>
              <Input
                id="add_price"
                type="number"
                placeholder="Ej: 8790"
                value={addFormData.price}
                onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add_product_url">9. URL del Producto *</Label>
              <Textarea
                id="add_product_url"
                placeholder="https://www.farmacia.com/producto/levotiroxina-..."
                value={addFormData.product_url}
                onChange={(e) => setAddFormData({ ...addFormData, product_url: e.target.value })}
                rows={3}
              />
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-xs text-yellow-800 font-medium">⚠️ Importante: URL directa</p>
                <p className="text-xs text-yellow-700 mt-1">
                  La URL debe ser un enlace DIRECTO a la página del producto específico, no a la página de búsqueda.
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Cómo obtenerla: Ve a la farmacia online → Busca el producto → Haz clic en el producto → Copia la URL de la barra de direcciones
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add_is_bioequivalent"
                  checked={addFormData.is_bioequivalent}
                  onChange={(e) => setAddFormData({ ...addFormData, is_bioequivalent: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="add_is_bioequivalent" className="cursor-pointer">
                  10. Es bioequivalente
                </Label>
              </div>
              <p className="text-xs text-gray-500">Marca si este medicamento es bioequivalente</p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setAddFormData({
                    id: '',
                    medication_name: '',
                    pharmacy_name: '',
                    presentation: '',
                    quantity: '',
                    price: '',
                    product_url: '',
                    commercial_name: '',
                    laboratory: '',
                    mg_per_tablet: '',
                    is_bioequivalent: false,
                  });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Crear Medicamento
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Medications;
