
import { TrendingDown, TrendingUp, Circle, Flame, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DisorderTypes = () => {
  const disorders = [
    {
      name: "Hipotiroidismo",
      icon: <TrendingDown className="h-8 w-8 text-blue-500" />,
      description: "La tiroides funciona muy lento",
      symptoms: ["Fatiga", "Aumento de peso", "Frío", "Depresión", "Piel seca"],
      prevalence: "Más común en mujeres",
      color: "blue",
      explanation: "Es como si tu cuerpo fuera un auto sin acelerador. Todo funciona más lento de lo normal."
    },
    {
      name: "Hipertiroidismo",
      icon: <TrendingUp className="h-8 w-8 text-red-500" />,
      description: "La tiroides funciona muy rápido",
      symptoms: ["Nerviosismo", "Pérdida de peso", "Calor", "Palpitaciones", "Temblores"],
      prevalence: "Menos frecuente",
      color: "red",
      explanation: "Es como si tu cuerpo fuera un auto con el acelerador pegado. Todo va demasiado rápido."
    },
    {
      name: "Nódulos tiroideos",
      icon: <Circle className="h-8 w-8 text-purple-500" />,
      description: "Pequeños bultos en la tiroides",
      symptoms: ["Bulto en el cuello", "Dificultad al tragar", "Ronquera", "A veces sin síntomas"],
      prevalence: "Muy comunes",
      color: "purple",
      explanation: "Son como pequeñas bolitas que crecen en la tiroides. La mayoría son benignos."
    },
    {
      name: "Tiroiditis",
      icon: <Flame className="h-8 w-8 text-orange-500" />,
      description: "Inflamación de la tiroides",
      symptoms: ["Dolor en el cuello", "Fiebre", "Fatiga", "Síntomas cambiantes"],
      prevalence: "Variable según tipo",
      color: "orange",
      explanation: "La tiroides se inflama, como cuando te duele la garganta pero en la tiroides."
    },
    {
      name: "Cáncer de tiroides",
      icon: <AlertCircle className="h-8 w-8 text-red-600" />,
      description: "Crecimiento anormal de células",
      symptoms: ["Bulto en el cuello", "Cambios en la voz", "Ganglios inflamados", "Dolor"],
      prevalence: "Poco frecuente",
      color: "red",
      explanation: "Aunque suena grave, la mayoría de los cánceres de tiroides se curan bien si se detectan a tiempo."
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600 border-blue-200 bg-blue-50",
      red: "from-red-500 to-red-600 border-red-200 bg-red-50",
      purple: "from-purple-500 to-purple-600 border-purple-200 bg-purple-50",
      orange: "from-orange-500 to-orange-600 border-orange-200 bg-orange-50"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section id="trastornos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tipos de trastornos tiroideos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce los principales problemas que pueden afectar tu tiroides. 
            Cada uno tiene características distintas y requiere un enfoque específico.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {disorders.map((disorder, index) => (
            <Card key={index} className={`h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 ${getColorClasses(disorder.color).split(' ').slice(2).join(' ')}`}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-white shadow-lg">
                  {disorder.icon}
                </div>
                <CardTitle className="text-xl mb-2">{disorder.name}</CardTitle>
                <CardDescription className="text-base font-medium">
                  {disorder.description}
                </CardDescription>
                <Badge variant="secondary" className="mt-2 w-fit mx-auto">
                  {disorder.prevalence}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="bg-white rounded-lg p-4 flex-1 flex flex-col">
                  <p className="text-sm text-gray-600 mb-3 italic">
                    {disorder.explanation}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">Síntomas comunes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {disorder.symptoms.map((symptom, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-200">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Te identificas con alguno?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Si reconoces varios síntomas de algún trastorno, no te asustes. 
              Muchos síntomas son comunes y pueden tener otras causas. 
              Lo importante es consultar con un profesional para un diagnóstico preciso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                ✅ La mayoría son tratables
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                ✅ Diagnóstico con exámenes simples
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                ✅ Mejor calidad de vida con tratamiento
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisorderTypes;
