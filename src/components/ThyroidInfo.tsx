
import { Heart, Zap, Brain, Thermometer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ThyroidInfo = () => {
  const functions = [
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Energía y metabolismo",
      description: "Controla qué tan rápido tu cuerpo quema calorías y usa energía"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Ritmo cardíaco",
      description: "Regula los latidos de tu corazón y la presión arterial"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Función cerebral",
      description: "Influye en tu estado de ánimo, memoria y concentración"
    },
    {
      icon: <Thermometer className="h-8 w-8 text-blue-500" />,
      title: "Temperatura corporal",
      description: "Ayuda a mantener la temperatura ideal de tu cuerpo"
    }
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {functions.map((func, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto mb-4">
                  {func.icon}
                </div>
                <CardTitle className="text-lg">{func.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {func.description}
                </CardDescription>
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
