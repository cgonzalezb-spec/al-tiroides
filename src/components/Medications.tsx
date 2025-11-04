import { Pill, Clock, AlertCircle, Heart, CheckCircle, ChevronDown, ExternalLink, ShoppingCart, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
}

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
}

const Medications = () => {
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [openPrices, setOpenPrices] = useState<number | null>(null);
  const [selectedMed, setSelectedMed] = useState<number | null>(null);
  const [pharmacyData, setPharmacyData] = useState<Record<string, PharmacyLink[]>>({});
  const [selectedDose, setSelectedDose] = useState<Record<number, string>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
          mg_per_tablet: link.mg_per_tablet
        });
      });
      setPharmacyData(grouped);
    }
  };

  useEffect(() => {
    fetchPharmacyLinks();
  }, [toast]);

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
            Medicamentos para la tiroides
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce los tratamientos más comunes, cómo funcionan y qué esperar. 
            Recuerda que solo un médico puede recetarte medicamentos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8 items-stretch">
          {medications.map((med, index) => (
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
                  {selectedMed === index ? 'Ocultar detalles' : 'Ver detalles'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenido expandido que ocupa todo el ancho */}
        {selectedMed !== null && (
          <Card className="mb-16 animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{medications[selectedMed].name}</h3>
                <p className="text-gray-600 mt-2">Información farmacológica detallada</p>
              </div>
              
              <div className="space-y-3 max-w-4xl mx-auto">
                <Collapsible 
                  open={openDetails === selectedMed} 
                  onOpenChange={(isOpen) => setOpenDetails(isOpen ? selectedMed : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button 
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        Información farmacológica completa
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openDetails === selectedMed ? 'rotate-180' : ''}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Pill className="h-4 w-4 text-primary" />
                        Farmacodinamia
                      </h4>
                      <p className="text-sm text-muted-foreground">{medications[selectedMed].pharmacodynamics}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Farmacocinética
                      </h4>
                      <p className="text-sm text-muted-foreground">{medications[selectedMed].pharmacokinetics}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary" />
                        Indicación terapéutica
                      </h4>
                      <p className="text-sm text-muted-foreground">{medications[selectedMed].therapeuticIndication}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        Vías de administración
                      </h4>
                      <p className="text-sm text-muted-foreground">{medications[selectedMed].administrationRoutes}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Reacciones adversas a medicamentos
                      </h4>
                      <ul className="space-y-1">
                        {medications[selectedMed].adverseReactions.map((reaction, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {reaction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Interacciones con otros medicamentos y/o alimentos
                      </h4>
                      <ul className="space-y-1">
                        {medications[selectedMed].drugInteractions.map((interaction, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        Interacciones con otras patologías
                      </h4>
                      <ul className="space-y-1">
                        {medications[selectedMed].pathologyInteractions.map((interaction, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {interaction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible 
                  open={openPrices === selectedMed} 
                  onOpenChange={(isOpen) => setOpenPrices(isOpen ? selectedMed : null)}
                >
                  <CollapsibleTrigger asChild>
                    <button 
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm font-medium border"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Comparar precios
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openPrices === selectedMed ? 'rotate-180' : ''}`} />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    {(() => {
                      const links = getPharmacyLinks(medications[selectedMed].medicationKey);
                      
                      // Extraer dosis únicas de los enlaces
                      const uniqueDoses = Array.from(new Set(
                        links
                          .map(link => link.mg_per_tablet)
                          .filter(dose => dose && dose.trim() !== '')
                          .map(dose => {
                            // Extraer solo el número de mcg
                            const match = dose?.match(/(\d+)\s*mcg/i);
                            return match ? match[1] : null;
                          })
                          .filter(Boolean)
                      )).sort((a, b) => parseInt(a!) - parseInt(b!));
                      
                      // Obtener dosis seleccionada para este medicamento
                      const currentDose = selectedDose[selectedMed] || 'all';
                      
                      // Filtrar por dosis si hay una seleccionada
                      let filteredLinks = links;
                      if (currentDose !== 'all') {
                        filteredLinks = links.filter(link => {
                          const match = link.mg_per_tablet?.match(/(\d+)\s*mcg/i);
                          return match && match[1] === currentDose;
                        });
                      }
                      
                      // Ordenar por precio por comprimido si está disponible, sino por precio total
                      const sortedLinks = [...filteredLinks].sort((a, b) => {
                        if (a.pricePerUnit && b.pricePerUnit) {
                          return a.pricePerUnit - b.pricePerUnit;
                        }
                        return a.price - b.price;
                      });
                      
                      // Calcular el mejor valor solo dentro de la dosis seleccionada
                      const minPricePerUnit = sortedLinks.length > 0 && sortedLinks[0].pricePerUnit 
                        ? sortedLinks[0].pricePerUnit 
                        : null;
                      
                      return (
                        <>
                          {uniqueDoses.length > 0 && (
                            <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
                              <div className="flex items-center gap-3">
                                <Label className="text-sm font-medium shrink-0">
                                  Filtrar por dosis:
                                </Label>
                                <Select
                                  value={currentDose}
                                  onValueChange={(value) => {
                                    setSelectedDose(prev => ({ ...prev, [selectedMed]: value }));
                                  }}
                                >
                                  <SelectTrigger className="w-full max-w-xs">
                                    <SelectValue placeholder="Todas las dosis" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">Todas las dosis</SelectItem>
                                    {uniqueDoses.map(dose => (
                                      <SelectItem key={dose} value={dose!}>
                                        {dose} mcg
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            {(() => {
                              // Agrupar por farmacia
                              const groupedByPharmacy = sortedLinks.reduce((acc, link) => {
                                const pharmacyName = link.name;
                                if (!acc[pharmacyName]) {
                                  acc[pharmacyName] = [];
                                }
                                acc[pharmacyName].push(link);
                                return acc;
                              }, {} as Record<string, typeof sortedLinks>);
                              
                              return Object.entries(groupedByPharmacy).map(([pharmacyName, items]) => (
                                <Card key={pharmacyName} className="overflow-hidden">
                                  <CardHeader className="bg-muted/30 pb-3">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-base font-semibold">
                                        {pharmacyName}
                                      </CardTitle>
                                      <span className="text-xs text-muted-foreground">
                                        {items.length} {items.length === 1 ? 'opción' : 'opciones'}
                                      </span>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="p-0">
                                    <div className="divide-y">
                                      {items.map((pharmacy, i) => {
                                        const isBestValue = minPricePerUnit && pharmacy.pricePerUnit 
                                          ? pharmacy.pricePerUnit === minPricePerUnit 
                                          : false;
                                        const pricePerPill = pharmacy.quantity 
                                          ? Math.round(pharmacy.price / pharmacy.quantity)
                                          : null;
                                        
                                        return (
                                          <div 
                                            key={i}
                                            className={`p-4 ${isBestValue ? 'bg-accent/30' : ''}`}
                                          >
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                              {/* Info del producto */}
                                              <div className="flex-1 space-y-2">
                                                <div>
                                                   <h4 className="font-semibold text-sm">
                                                     {pharmacy.commercial_name || pharmacy.brand}
                                                     {isBestValue && (
                                                       <Badge className="ml-2 text-[10px] px-2 py-0.5 bg-green-600 text-white hover:bg-green-700 border-transparent">
                                                         Mejor precio
                                                       </Badge>
                                                     )}
                                                   </h4>
                                                  {pharmacy.laboratory && (
                                                    <p className="text-xs text-muted-foreground">
                                                      {pharmacy.laboratory}
                                                    </p>
                                                  )}
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                  {pharmacy.mg_per_tablet && (
                                                    <span>{pharmacy.mg_per_tablet}</span>
                                                  )}
                                                  {pharmacy.mg_per_tablet && pharmacy.quantity && (
                                                    <span>•</span>
                                                  )}
                                                  {pharmacy.quantity && (
                                                    <span>{pharmacy.quantity} comprimidos</span>
                                                  )}
                                                </div>
                                              </div>
                                              
                                              {/* Precios y acciones */}
                                              <div className="flex flex-col md:items-end gap-3">
                                                <div className="space-y-1">
                                                  <div className="text-2xl font-bold">
                                                    ${pharmacy.price.toLocaleString('es-CL')}
                                                  </div>
                                                  {pricePerPill && (
                                                    <div className="text-xs text-muted-foreground">
                                                      ${pricePerPill.toLocaleString('es-CL')} por comprimido
                                                    </div>
                                                  )}
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                  >
                                                    <a 
                                                      href={pharmacy.url} 
                                                      target="_blank" 
                                                      rel="noopener noreferrer"
                                                      className="flex items-center gap-1"
                                                    >
                                                      Ver tienda
                                                      <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                  </Button>
                                                  
                                                  {isAdmin && (
                                                    <div className="flex gap-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 px-2"
                                                        onClick={() => handleEditLink(pharmacy)}
                                                        disabled={!pharmacy.id}
                                                      >
                                                        <Pencil className="h-4 w-4" />
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 px-2 text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                          if (pharmacy.id && confirm('¿Estás seguro de eliminar este medicamento?')) {
                                                            deleteLinkMutation.mutate(pharmacy.id);
                                                          }
                                                        }}
                                                        disabled={!pharmacy.id}
                                                      >
                                                        <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </CardContent>
                                </Card>
                              ));
                            })()}
                          </div>
                            
                            {isAdmin && (
                              <div className="mt-4 flex justify-center">
                                <Button
                                  onClick={() => setIsAddDialogOpen(true)}
                                  className="bg-primary hover:bg-primary/90"
                                  size="sm"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Agregar Medicamento
                                </Button>
                              </div>
                            )}

                            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                              <p className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  La opción marcada como "Mejor precio" tiene el costo por comprimido más bajo.
                                </span>
                              </p>
                              <p className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>
                                  Los precios son referenciales y pueden variar. Verifica el precio final en cada farmacia.
                                </span>
                              </p>
                            </div>
                        </>
                      );
                    })()}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
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
