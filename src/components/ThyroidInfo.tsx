
import { Heart, Zap, Brain, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const ThyroidInfo = () => {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const functions = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Energía y metabolismo",
      description: "Controla qué tan rápido tu cuerpo quema calorías y usa energía",
      expandedInfo: "La tiroides produce hormonas T3 y T4 que regulan la velocidad de todas las funciones corporales. Cuando funciona bien, tienes energía suficiente para tus actividades diarias. Si está lenta (hipotiroidismo), te sientes cansado y puedes subir de peso. Si está acelerada (hipertiroidismo), puedes sentirte inquieto y bajar de peso rápidamente."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Ritmo cardíaco",
      description: "Regula los latidos de tu corazón y la presión arterial",
      expandedInfo: "Las hormonas tiroideas afectan directamente la fuerza y velocidad de los latidos del corazón. En el hipertiroidismo, el corazón late más rápido y fuerte, pudiendo causar palpitaciones. En el hipotiroidismo, el ritmo cardíaco se vuelve más lento y puede aumentar la presión arterial."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Función cerebral",
      description: "Influye en tu estado de ánimo, memoria y concentración",
      expandedInfo: "La tiroides es fundamental para el funcionamiento del cerebro. Los problemas tiroideos pueden causar dificultades de concentración, problemas de memoria, depresión o ansiedad. Muchas veces estos síntomas mejoran significativamente cuando se normaliza la función tiroidea."
    },
    {
      icon: <Thermometer className="h-8 w-8 text-blue-500" />,
      title: "Temperatura corporal",
      description: "Ayuda a mantener la temperatura ideal de tu cuerpo",
      expandedInfo: "La tiroides regula cómo tu cuerpo produce y conserva calor. En el hipotiroidismo, puedes sentir frío constantemente, especialmente en manos y pies. En el hipertiroidismo, puedes sentir calor excesivo y sudar más de lo normal, incluso en ambientes frescos."
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const expandAll = () => {
    setExpandedCards(functions.map((_, index) => index));
  };

  const collapseAll = () => {
    setExpandedCards([]);
  };

  const allExpanded = expandedCards.length === functions.length;

  return (
    <section id="que-es" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Qué es la tiroides?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una pequeña glándula con forma de mariposa que tiene un trabajo gigante: 
            controlar el metabolismo de todo tu cuerpo. Está ubicada en el cuello, 
            justo debajo de la manzana de Adán.
          </p>
        </div>

        {/* Botón para expandir/colapsar todo */}
        <div className="text-center mb-8">
          <Button 
            variant="outline"
            onClick={allExpanded ? collapseAll : expandAll}
            className="mb-4"
          >
            {allExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Colapsar todo
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Expandir todo
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {functions.map((func, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
              onClick={() => toggleCard(index)}
            >
              <CardHeader className="flex-shrink-0">
                <div className="mx-auto mb-4">
                  {func.icon}
                </div>
                <CardTitle className="text-lg">{func.title}</CardTitle>
                <div className="flex justify-center mt-2">
                  {expandedCards.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm mb-3">
                  {func.description}
                </CardDescription>
                {expandedCards.includes(index) && (
                  <div className="bg-blue-50 p-4 rounded-lg border-t mt-2 animate-in fade-in-50 duration-200">
                    <p className="text-sm text-gray-700 text-left leading-relaxed">
                      {func.expandedInfo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué es tan importante?
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  Imagínate que tu cuerpo es como un auto y la tiroides es el acelerador. 
                  Si funciona bien, todo marcha perfecto. Pero si se desajusta:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>Muy rápida = hipertiroidismo (como un auto acelerado)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Muy lenta = hipotiroidismo (como un auto sin fuerza)</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-8xl">
                🦋
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Glándula tiroides
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThyroidInfo;
