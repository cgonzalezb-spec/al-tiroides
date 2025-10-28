import { Pill, Clock, AlertCircle, Heart, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

const Medications = () => {
  const [selectedMed, setSelectedMed] = useState<number | null>(null);

  const medications = [
    {
      name: "Levotiroxina",
      condition: "Hipotiroidismo",
      icon: <Pill className="h-6 w-6 text-blue-500" />,
      description: "Reemplaza la hormona T4 que tu tiroides no produce suficientemente",
      howItWorks: "Se convierte en T3 (hormona activa) en tu cuerpo, normalizando el metabolismo",
      dosage: "Usualmente 25-200 mcg al día, en ayunas",
      sideEffects: ["Palpitaciones si la dosis es muy alta", "Insomnio", "Pérdida de peso"],
      tips: ["Tomar en ayunas", "No mezclar con café o calcio", "Esperar 1 hora antes de desayunar"],
      mechanism: "La levotiroxina es una forma sintética de la hormona tiroidea T4 (tiroxina). Actúa uniéndose a receptores nucleares de hormonas tiroideas en las células, regulando la transcripción de genes específicos que controlan el metabolismo basal, el crecimiento y el desarrollo celular.",
      halfLife: "Aproximadamente 7 días en pacientes eutiroideos",
      adverseReactions: [
        "Reacciones cardíacas: taquicardia, arritmias, angina de pecho",
        "Sistema nervioso: temblor, insomnio, nerviosismo, cefalea",
        "Gastrointestinal: diarrea, vómitos, cambios en el apetito",
        "Metabólico: pérdida de peso, intolerancia al calor, sudoración excesiva",
        "Musculoesquelético: debilidad muscular, calambres"
      ],
      administration: "Vía oral. Tabletas de 25, 50, 75, 100, 125, 150 y 200 mcg",
      pricing: "Precio aproximado: $8.000 - $15.000 CLP por caja de 30 comprimidos. Disponible en farmacias con receta médica. Marcas: Eutirox, Levotiroxina Sódica, T4."
    },
    {
      name: "Metimazol",
      condition: "Hipertiroidismo",
      icon: <Pill className="h-6 w-6 text-red-500" />,
      description: "Reduce la producción excesiva de hormonas tiroideas",
      howItWorks: "Bloquea las enzimas que producen hormonas tiroideas",
      dosage: "5-40 mg al día, según la severidad",
      sideEffects: ["Náuseas", "Dolor articular", "Rash cutáneo"],
      tips: ["Tomar con comida", "Controles de sangre regulares", "Reportar fiebre o dolor de garganta"],
      mechanism: "El metimazol es un fármaco antitiroideo que inhibe la enzima tiroperoxidasa (TPO), esencial para la síntesis de hormonas tiroideas. Impide la oxidación del yoduro y su incorporación en los residuos de tirosina de la tiroglobulina, bloqueando así la formación de T3 y T4.",
      halfLife: "4-6 horas aproximadamente",
      adverseReactions: [
        "Hematológicas: agranulocitosis (rara pero grave), leucopenia, trombocitopenia",
        "Dermatológicas: urticaria, prurito, rash, alopecia",
        "Gastrointestinal: náuseas, vómitos, alteración del gusto",
        "Hepáticas: hepatotoxicidad, ictericia colestásica",
        "Articular: artralgias, síndrome lupus-like"
      ],
      administration: "Vía oral. Tabletas de 5 mg y 10 mg",
      pricing: "Precio aproximado: $10.000 - $18.000 CLP por caja de 30 comprimidos. Disponible en farmacias con receta médica retenida. Marcas: Tapazol, Tirozol."
    },
    {
      name: "Propranolol",
      condition: "Síntomas de hipertiroidismo",
      icon: <Heart className="h-6 w-6 text-green-500" />,
      description: "Controla síntomas como palpitaciones y temblores",
      howItWorks: "Bloquea los efectos del exceso de hormona tiroidea en el corazón",
      dosage: "10-40 mg cada 6-8 horas",
      sideEffects: ["Fatiga", "Mareos", "Manos frías"],
      tips: ["No suspender bruscamente", "Controlar presión arterial", "Cuidado en diabéticos"],
      mechanism: "El propranolol es un betabloqueador no selectivo que antagoniza competitivamente los receptores β1 y β2 adrenérgicos. En el contexto del hipertiroidismo, reduce los síntomas adrenérgicos (taquicardia, temblor, ansiedad) y también inhibe la conversión periférica de T4 a T3.",
      halfLife: "3-6 horas (forma de liberación inmediata)",
      adverseReactions: [
        "Cardiovascular: bradicardia, hipotensión, insuficiencia cardíaca",
        "Respiratorio: broncoespasmo (especialmente en asmáticos)",
        "Sistema nervioso: fatiga, mareos, depresión, insomnio",
        "Metabólico: hipoglucemia enmascarada en diabéticos",
        "Vascular: extremidades frías, fenómeno de Raynaud",
        "Otros: disfunción sexual, alteraciones del sueño"
      ],
      administration: "Vía oral. Tabletas de 10 mg, 40 mg y 80 mg. También disponible en forma de liberación prolongada",
      pricing: "Precio aproximado: $3.000 - $8.000 CLP por caja de 30 comprimidos de 40mg. Disponible en farmacias con receta médica. Marcas: Propranolol genérico, Inderalici."
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
                
                <Dialog open={selectedMed === index} onOpenChange={(open) => !open && setSelectedMed(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setSelectedMed(index)}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Quiero conocer más detalles
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        {med.icon}
                        {med.name}
                      </DialogTitle>
                      <DialogDescription>
                        Información farmacológica detallada
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 mt-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <Pill className="h-5 w-5 text-primary" />
                          Mecanismo de acción
                        </h3>
                        <p className="text-sm text-muted-foreground">{med.mechanism}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Vida media
                        </h3>
                        <p className="text-sm text-muted-foreground">{med.halfLife}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          Vía de administración
                        </h3>
                        <p className="text-sm text-muted-foreground">{med.administration}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          Reacciones adversas a medicamentos
                        </h3>
                        <ul className="space-y-1">
                          {med.adverseReactions.map((reaction, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              • {reaction}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">
                          💰 Precios y opciones de compra
                        </h3>
                        <p className="text-sm text-muted-foreground">{med.pricing}</p>
                        <p className="text-xs text-amber-600 mt-2">
                          ⚠️ Los precios son aproximados y pueden variar según la farmacia y región.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
