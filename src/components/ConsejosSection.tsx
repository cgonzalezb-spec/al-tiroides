
import { Leaf, Utensils, Bed, Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const consejos = [
  {
    icon: <Utensils className="h-8 w-8 text-green-500" />,
    title: "Nutrición Consciente",
    description: "Una dieta rica en selenio, zinc y yodo puede ayudar a tu tiroides. Incluye nueces de Brasil, pescado y legumbres."
  },
  {
    icon: <Bed className="h-8 w-8 text-blue-500" />,
    title: "Descanso Reparador",
    description: "Dormir entre 7 y 9 horas es crucial. Un buen descanso ayuda a regular las hormonas y a reducir el estrés."
  },
  {
    icon: <Brain className="h-8 w-8 text-purple-500" />,
    title: "Manejo del Estrés",
    description: "Practica técnicas de relajación como meditación o yoga. El estrés crónico puede afectar negativamente la función tiroidea."
  },
  {
    icon: <Leaf className="h-8 w-8 text-teal-500" />,
    title: "Suplementos con Cuidado",
    description: "Consulta siempre a tu médico antes de tomar suplementos. Algunos, como el yodo en exceso, pueden ser perjudiciales."
  }
];

const ConsejosSection = () => {
  return (
    <section id="consejos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Consejos para tu Bienestar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pequeños hábitos que pueden hacer una gran diferencia en tu día a día.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {consejos.map((consejo, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {consejo.icon}
                </div>
                <CardTitle>{consejo.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{consejo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsejosSection;
