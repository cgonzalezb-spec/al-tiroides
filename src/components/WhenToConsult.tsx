
import { Clock, AlertTriangle, Stethoscope, FileText, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const WhenToConsult = () => {
  const urgentSigns = [
    "Bulto nuevo en el cuello que crece rápidamente",
    "Dificultad para respirar o tragar",
    "Ronquera persistente sin causa aparente",
    "Palpitaciones muy fuertes o irregulares",
    "Pérdida de peso muy rápida (más de 5kg en un mes)"
  ];

  const consultSigns = [
    "Fatiga que no mejora con descanso",
    "Cambios de peso sin modificar dieta",
    "Problemas de concentración o memoria",
    "Cambios en el estado de ánimo",
    "Sensibilidad extrema al frío o calor",
    "Caída excesiva del cabello",
    "Períodos menstruales irregulares"
  ];

  const examTypes = [
    {
      name: "TSH (Hormona estimulante)",
      description: "El examen más importante para detectar problemas",
      icon: <Stethoscope className="h-6 w-6 text-blue-500" />,
      preparation: "En ayunas de 8-12 horas"
    },
    {
      name: "T4 Libre",
      description: "Mide la hormona tiroidea activa en sangre",
      icon: <FileText className="h-6 w-6 text-green-500" />,
      preparation: "En ayunas de 8-12 horas"
    },
    {
      name: "T3 Libre",
      description: "Otra hormona importante para el diagnóstico",
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      preparation: "En ayunas de 8-12 horas"
    },
    {
      name: "Ecografía tiroidea",
      description: "Para ver la forma y detectar nódulos",
      icon: <MapPin className="h-6 w-6 text-orange-500" />,
      preparation: "No requiere preparación especial"
    }
  ];

  const scrollToAgenda = () => {
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Elemento #agendar no encontrado');
    }
  };

  const scrollToPublico = () => {
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Opcional: hacer scroll adicional al sistema público después
      setTimeout(() => {
        const publicoElement = document.getElementById('sistema-publico');
        if (publicoElement) {
          publicoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    } else {
      console.error('Elemento #agendar no encontrado');
    }
  };

  return (
    <section id="consultar" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ¿Cuándo consultar al médico?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce las señales que indican que es momento de buscar ayuda profesional 
            y qué esperar en tu consulta médica.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Señales de alarma */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <CardTitle className="text-red-800">Señales de alarma</CardTitle>
                  <CardDescription className="text-red-600">
                    Consulta urgente si presentas:
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {urgentSigns.map((sign, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-red-500 text-lg font-bold">•</span>
                    <span className="text-gray-700">{sign}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700" onClick={scrollToPublico}>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar consulta urgente
              </Button>
            </CardContent>
          </Card>

          {/* Consulta programada */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-blue-600" />
                <div>
                  <CardTitle className="text-blue-800">Para consulta programada</CardTitle>
                  <CardDescription className="text-blue-600">
                    Si tienes estos síntomas persistentes:
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {consultSigns.map((sign, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-blue-500 text-lg font-bold">•</span>
                    <span className="text-gray-700">{sign}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" onClick={scrollToAgenda}>
                <Calendar className="mr-2 h-4 w-4" />
                Buscar especialistas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Exámenes comunes */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Exámenes que podría pedirte el médico
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {examTypes.map((exam, index) => (
              <Card key={index} className="h-full flex flex-col text-center hover:shadow-lg transition-shadow">
                <CardHeader className="flex-1">
                  <div className="mx-auto mb-2">
                    {exam.icon}
                  </div>
                  <CardTitle className="text-lg">{exam.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {exam.description}
                  </CardDescription>
                  <Badge variant="outline" className="text-xs">
                    {exam.preparation}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Qué esperar en la consulta */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 mb-4">
              ¿Qué esperar en tu primera consulta?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2">Historia clínica</h4>
                <p className="text-sm text-gray-600">
                  El doctor te preguntará sobre tus síntomas, historial familiar y medicamentos
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2">Examen físico</h4>
                <p className="text-sm text-gray-600">
                  Revisará tu cuello, palparA la tiroides y medirá tu pulso y presión
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2">Exámenes</h4>
                <p className="text-sm text-gray-600">
                  Probablemente pedirá análisis de sangre y tal vez una ecografía
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhenToConsult;
