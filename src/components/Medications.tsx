
import { Pill, Clock, AlertCircle, Heart, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Medications = () => {
  const medications = [
    {
      name: "Levotiroxina",
      condition: "Hipotiroidismo",
      icon: <Pill className="h-6 w-6 text-blue-500" />,
      description: "Reemplaza la hormona T4 que tu tiroides no produce suficientemente",
      howItWorks: "Se convierte en T3 (hormona activa) en tu cuerpo, normalizando el metabolismo",
      dosage: "Usualmente 25-200 mcg al día, en ayunas",
      sideEffects: ["Palpitaciones si la dosis es muy alta", "Insomnio", "Pérdida de peso"],
      tips: ["Tomar en ayunas", "No mezclar con café o calcio", "Esperar 1 hora antes de desayunar"]
    },
    {
      name: "Metimazol",
      condition: "Hipertiroidismo",
      icon: <Pill className="h-6 w-6 text-red-500" />,
      description: "Reduce la producción excesiva de hormonas tiroideas",
      howItWorks: "Bloquea las enzimas que producen hormonas tiroideas",
      dosage: "5-40 mg al día, según la severidad",
      sideEffects: ["Náuseas", "Dolor articular", "Rash cutáneo"],
      tips: ["Tomar con comida", "Controles de sangre regulares", "Reportar fiebre o dolor de garganta"]
    },
    {
      name: "Propranolol",
      condition: "Síntomas de hipertiroidismo",
      icon: <Heart className="h-6 w-6 text-green-500" />,
      description: "Controla síntomas como palpitaciones y temblores",
      howItWorks: "Bloquea los efectos del exceso de hormona tiroidea en el corazón",
      dosage: "10-40 mg cada 6-8 horas",
      sideEffects: ["Fatiga", "Mareos", "Manos frías"],
      tips: ["No suspender bruscamente", "Controlar presión arterial", "Cuidado en diabéticos"]
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
