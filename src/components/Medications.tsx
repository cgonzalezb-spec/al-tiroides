import { Pill, Clock, AlertCircle, Heart, CheckCircle, ChevronDown, ExternalLink, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PharmacyLink {
  name: string;
  price: number;
  presentation: string;
  url: string;
}

const Medications = () => {
  const [openDetails, setOpenDetails] = useState<number | null>(null);
  const [openPrices, setOpenPrices] = useState<number | null>(null);
  const [pharmacyData, setPharmacyData] = useState<Record<string, PharmacyLink[]>>({});
  const { toast } = useToast();

  // Cargar enlaces de farmacias desde la base de datos
  useEffect(() => {
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
          grouped[link.medication_name].push({
            name: link.pharmacy_name,
            price: link.price,
            presentation: link.presentation,
            url: link.product_url
          });
        });
        setPharmacyData(grouped);
      }
    };

    fetchPharmacyLinks();
  }, [toast]);

  // Función para obtener enlaces de farmacias con fallback
  const getPharmacyLinks = (medicationKey: string): PharmacyLink[] => {
    // Si hay datos en la BD, usarlos
    if (pharmacyData[medicationKey] && pharmacyData[medicationKey].length > 0) {
      return pharmacyData[medicationKey];
    }
    
    // Fallback a búsquedas si no hay datos
    const fallbackLinks: Record<string, PharmacyLink[]> = {
      'levotiroxina': [
        { name: "Cruz Verde", price: 8990, presentation: "Eutirox 100mcg x30", url: "https://www.cruzverde.cl/buscador?q=eutirox" },
        { name: "Salcobrand", price: 9490, presentation: "Eutirox 100mcg x30", url: "https://www.salcobrand.cl/search/?text=eutirox" },
        { name: "Farmacias Ahumada", price: 8790, presentation: "Levotiroxina 100mcg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=levotiroxina" },
        { name: "Farmacias del Dr. Simi", price: 7990, presentation: "Levotiroxina 100mcg x30", url: "https://www.google.com/search?q=site:farmaciasdelsimi.cl+levotiroxina" }
      ],
      'metimazol': [
        { name: "Cruz Verde", price: 14990, presentation: "Tapazol 5mg x30", url: "https://www.cruzverde.cl/buscador?q=tapazol" },
        { name: "Salcobrand", price: 15490, presentation: "Tapazol 5mg x30", url: "https://www.salcobrand.cl/search/?text=tapazol" },
        { name: "Farmacias Ahumada", price: 13990, presentation: "Metimazol 5mg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=metimazol" },
        { name: "Farmacias del Dr. Simi", price: 12990, presentation: "Metimazol 5mg x30", url: "https://www.google.com/search?q=site:farmaciasdelsimi.cl+metimazol" }
      ],
      'propranolol': [
        { name: "Cruz Verde", price: 5990, presentation: "Propranolol 40mg x30", url: "https://www.cruzverde.cl/buscador?q=propranolol" },
        { name: "Salcobrand", price: 6490, presentation: "Propranolol 40mg x30", url: "https://www.salcobrand.cl/search/?text=propranolol" },
        { name: "Farmacias Ahumada", price: 4990, presentation: "Propranolol 40mg x30", url: "https://www.farmaciasahumada.cl/catalogsearch/result/?q=propranolol" },
        { name: "Farmacias del Dr. Simi", price: 3990, presentation: "Propranolol 40mg x30", url: "https://www.google.com/search?q=site:farmaciasdelsimi.cl+propranolol" }
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

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {medications.map((med, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  {med.icon}
                  <Badge variant="outline">{med.condition}</Badge>
                </div>
                <CardTitle className="text-xl">{med.name}</CardTitle>
                <CardDescription>{med.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="how" className="w-full">
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
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Collapsible 
                    open={openDetails === index} 
                    onOpenChange={(isOpen) => setOpenDetails(isOpen ? index : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        Más detalles
                        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${openDetails === index ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          Farmacodinamia
                        </h4>
                        <p className="text-xs text-muted-foreground">{med.pharmacodynamics}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Farmacocinética
                        </h4>
                        <p className="text-xs text-muted-foreground">{med.pharmacokinetics}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          Indicación terapéutica
                        </h4>
                        <p className="text-xs text-muted-foreground">{med.therapeuticIndication}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          Vías de administración
                        </h4>
                        <p className="text-xs text-muted-foreground">{med.administrationRoutes}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          Reacciones adversas a medicamentos
                        </h4>
                        <ul className="space-y-1">
                          {med.adverseReactions.map((reaction, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {reaction}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          Interacciones con otros medicamentos y/o alimentos
                        </h4>
                        <ul className="space-y-1">
                          {med.drugInteractions.map((interaction, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {interaction}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          Interacciones con otras patologías
                        </h4>
                        <ul className="space-y-1">
                          {med.pathologyInteractions.map((interaction, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              • {interaction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible 
                    open={openPrices === index} 
                    onOpenChange={(isOpen) => setOpenPrices(isOpen ? index : null)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        ¿Dónde comprar?
                        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${openPrices === index ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="rounded-lg border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Farmacia</TableHead>
                              <TableHead>Presentación</TableHead>
                              <TableHead className="text-right">Precio</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getPharmacyLinks(med.medicationKey).map((pharmacy, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-medium text-xs">{pharmacy.name}</TableCell>
                                <TableCell className="text-xs">{pharmacy.presentation}</TableCell>
                                <TableCell className="text-right text-xs font-semibold">
                                  ${pharmacy.price.toLocaleString('es-CL')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7"
                                    asChild
                                  >
                                    <a 
                                      href={pharmacy.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <p className="text-xs text-amber-600 mt-3 text-center">
                        ⚠️ Los precios son aproximados y pueden variar según disponibilidad y región
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
    </section>
  );
};

export default Medications;
