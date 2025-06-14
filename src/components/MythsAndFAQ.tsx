
import { HelpCircle, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const MythsAndFAQ = () => {
  const myths = [
    {
      myth: "El hipotiroidismo es la causa principal de fatiga, aumento de peso y síntomas inespecíficos",
      reality: "Si bien el hipotiroidismo puede causar fatiga, aumento de peso y otros síntomas, estos son inespecíficos y muy prevalentes en la población general. La mayoría de los pacientes con estos síntomas no tienen disfunción tiroidea, y el diagnóstico debe basarse en pruebas bioquímicas, no solo en la clínica.",
      status: "false"
    },
    {
      myth: "El hipotiroidismo puede estar presente con pruebas tiroideas normales",
      reality: "No existe evidencia que respalde la existencia de hipotiroidismo clínicamente significativo con pruebas de función tiroidea normales. El diagnóstico requiere elevación de TSH y, en el caso de hipotiroidismo manifiesto, disminución de T4 libre.",
      status: "false"
    },
    {
      myth: "Wilson's syndrome o síndrome de Wilson es una entidad reconocida",
      reality: "La 'síndrome de Wilson' no está reconocida por la comunidad endocrinológica. No existe evidencia científica que respalde su existencia ni la eficacia de la terapia con T3 propuesta para este cuadro. Su diagnóstico es impreciso y puede llevar a tratamientos innecesarios y riesgosos.",
      status: "false"
    },
    {
      myth: "La dieta, suplementos o nutracéuticos pueden curar o controlar las enfermedades tiroideas",
      reality: "Aunque nutrientes como el yodo y el selenio son esenciales para la función tiroidea, la suplementación indiscriminada no está justificada y puede ser perjudicial, especialmente en poblaciones con suficiente ingesta. La evidencia sobre el beneficio de otros suplementos es limitada o nula, salvo en casos de deficiencia o intolerancia demostrada.",
      status: "false"
    },
    {
      myth: "Evitar vegetales crucíferos o la soya es necesario en todos los pacientes con enfermedad tiroidea",
      reality: "No hay evidencia sólida que justifique la restricción de estos alimentos en la mayoría de los pacientes con enfermedad tiroidea. Solo en casos de ingesta excesiva y deficiencia de yodo podrían tener algún impacto.",
      status: "false"
    }
  ];

  const clinicalRealities = [
    "El hipotiroidismo y el hipertiroidismo son enfermedades comunes, con causas bien definidas (autoinmunidad, deficiencia de yodo, fármacos, cirugía, etc.) y diagnóstico basado en pruebas de laboratorio (TSH, T4 libre).",
    "El tratamiento estándar del hipotiroidismo es la levotiroxina, que es segura, eficaz y económica. El uso de T3 o extractos desecados de tiroides no está recomendado de rutina y carece de suficiente respaldo científico.",
    "El hipotiroidismo subclínico solo requiere tratamiento en situaciones específicas (TSH persistentemente >10 mU/L, síntomas claros, embarazo, infertilidad, o presencia de anticuerpos antitiroideos).",
    "La mayoría de los nódulos tiroideos son benignos; la indicación de biopsia o derivación depende de características clínicas y ecográficas.",
    "El exceso de yodo puede inducir disfunción tiroidea, por lo que la suplementación debe ser individualizada."
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
            Mitos y realidades sobre la tiroides
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Las afecciones tiroideas están rodeadas de numerosos mitos y conceptos erróneos, 
            muchos de los cuales pueden afectar negativamente el diagnóstico y manejo clínico. 
            A continuación se resumen los principales mitos y realidades, sustentados en la literatura médica relevante.
          </p>
        </div>

        {/* Sección de Mitos */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            🔍 Mitos frecuentes
          </h3>
          <div className="grid lg:grid-cols-1 gap-6">
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

        {/* Realidades clínicas */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            ✅ Realidades clínicas
          </h3>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {clinicalRealities.map((reality, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{reality}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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

        {/* Disclaimer actualizado */}
        <Card className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">
                  Importante: Esta información es educativa
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  Somos un grupo de estudiantes de la Universidad Católica de la Santísima Concepción 
                  con la intención de facilitar el acceso a la información sobre la glándula tiroidea.
                </p>
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
