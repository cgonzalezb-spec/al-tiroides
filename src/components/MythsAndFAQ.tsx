
import { HelpCircle, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const MythsAndFAQ = () => {
  const myths = [
    {
      myth: "El yodo en la sal causa problemas de tiroides",
      reality: "El yodo es NECESARIO para el funcionamiento normal de la tiroides. La sal yodada previene deficiencias.",
      status: "false"
    },
    {
      myth: "Si tengo hipotiroidismo, nunca podré bajar de peso",
      reality: "Con tratamiento adecuado y hábitos saludables, es posible mantener un peso normal.",
      status: "false"
    },
    {
      myth: "Comer repollo o brócoli daña la tiroides",
      reality: "Solo en cantidades extremas y si ya tienes deficiencia de yodo. En porciones normales son seguros.",
      status: "false"
    },
    {
      myth: "La tiroides se puede curar completamente",
      reality: "Muchos trastornos tiroideos requieren tratamiento de por vida, pero con medicación se puede vivir normalmente.",
      status: "partially-true"
    },
    {
      myth: "Los nódulos tiroideos siempre son cáncer",
      reality: "95% de los nódulos tiroideos son benignos. Solo un pequeño porcentaje es maligno.",
      status: "false"
    },
    {
      myth: "El hipotiroidismo solo afecta a mujeres mayores",
      reality: "Aunque es más común en mujeres, puede afectar a hombres y personas de cualquier edad.",
      status: "false"
    }
  ];

  const faqs = [
    {
      question: "¿Puedo quedar embarazada si tengo problemas de tiroides?",
      answer: "Sí, pero es importante tener la tiroides controlada antes y durante el embarazo. Los problemas tiroideos no tratados pueden afectar la fertilidad y el desarrollo del bebé."
    },
    {
      question: "¿Qué pasa si olvido tomar mi levotiroxina un día?",
      answer: "Si olvidas una dosis, tómala tan pronto como te acuerdes, pero si ya es hora de la siguiente dosis, omite la olvidada. No tomes doble dosis."
    },
    {
      question: "¿Por qué debo tomar la levotiroxina en ayunas?",
      answer: "Los alimentos, especialmente calcio, hierro y café, pueden interferir con la absorción del medicamento, haciendo que sea menos efectivo."
    },
    {
      question: "¿Con qué frecuencia debo hacer exámenes de control?",
      answer: "Al inicio del tratamiento, cada 6-8 semanas hasta estabilizarse. Luego, generalmente cada 6-12 meses, o según indicación médica."
    },
    {
      question: "¿Puedo hacer ejercicio si tengo hipertiroidismo?",
      answer: "Depende de la severidad. Con hipertiroidismo no controlado, el ejercicio intenso puede ser peligroso. Consulta con tu médico primero."
    },
    {
      question: "¿El estrés puede afectar mi tiroides?",
      answer: "El estrés crónico puede empeorar algunos trastornos tiroideos, especialmente la tiroiditis autoinmune. Es importante manejar el estrés."
    },
    {
      question: "¿Puedo tomar suplementos de yodo?",
      answer: "No se recomienda sin supervisión médica. El exceso de yodo puede empeorar algunos problemas tiroideos, especialmente en personas con nódulos."
    },
    {
      question: "¿La tiroides afecta mi estado de ánimo?",
      answer: "Sí. El hipotiroidismo puede causar depresión y el hipertiroidismo puede causar ansiedad. Estos síntomas mejoran con el tratamiento adecuado."
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "false":
        return <X className="h-5 w-5 text-red-500" />;
      case "true":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "partially-true":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "false":
        return <Badge variant="destructive">MITO</Badge>;
      case "true":
        return <Badge className="bg-green-500">VERDAD</Badge>;
      case "partially-true":
        return <Badge variant="secondary">PARCIALMENTE CIERTO</Badge>;
      default:
        return <Badge variant="outline">DESCONOCIDO</Badge>;
    }
  };

  return (
    <section id="mitos-faq" className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mitos y preguntas frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aclaramos las dudas más comunes y desmitificamos creencias populares 
            sobre la tiroides con información basada en evidencia científica.
          </p>
        </div>

        {/* Sección de Mitos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            🕵️ Mitos vs Realidad
          </h3>
          <div className="grid lg:grid-cols-2 gap-6">
            {myths.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(item.status)}
                        {getStatusBadge(item.status)}
                      </div>
                      <CardTitle className="text-lg text-gray-800">
                        "{item.myth}"
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-sm text-blue-800 font-medium">Realidad:</p>
                    <p className="text-sm text-blue-700 mt-1">{item.reality}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sección de FAQ */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            ❓ Preguntas frecuentes
          </h3>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-6 w-6 text-blue-500" />
                <span>Las dudas más comunes de nuestros usuarios</span>
              </CardTitle>
              <CardDescription>
                Respuestas claras y comprensibles a las preguntas que más nos hacen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">
                  Importante: Esta información es educativa
                </h4>
                <p className="text-sm text-amber-700">
                  Las respuestas aquí proporcionadas son para fines informativos únicamente y no reemplazan 
                  la consulta médica profesional. Siempre consulta con tu médico para obtener consejos 
                  específicos sobre tu condición de salud.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MythsAndFAQ;
