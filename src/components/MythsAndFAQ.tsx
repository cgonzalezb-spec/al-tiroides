import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Book, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MythsAndFAQ = () => {
  const [expandedMyth, setExpandedMyth] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const myths = [
    {
      myth: "El hipotiroidismo es la causa principal de fatiga, aumento de peso y síntomas inespecíficos.",
      reality: "Si bien el hipotiroidismo puede causar fatiga, aumento de peso y otros síntomas, estos son inespecíficos y muy prevalentes en la población general. La mayoría de los pacientes con estos síntomas no tienen disfunción tiroidea, y el diagnóstico debe basarse en pruebas bioquímicas, no solo en la clínica."
    },
    {
      myth: "El hipotiroidismo puede estar presente con pruebas tiroideas normales.",
      reality: "No existe evidencia que respalde la existencia de hipotiroidismo clínicamente significativo con pruebas de función tiroidea normales. El diagnóstico requiere elevación de TSH y, en el caso de hipotiroidismo manifiesto, disminución de T4 libre."
    },
    {
      myth: "La dieta, suplementos o nutracéuticos pueden curar o controlar las enfermedades tiroideas.",
      reality: "Aunque nutrientes como el yodo y el selenio son esenciales para la función tiroidea, la suplementación indiscriminada no está justificada y puede ser perjudicial, especialmente en poblaciones con suficiente ingesta. La evidencia sobre el beneficio de otros suplementos (como zinc, ashwagandha, o dietas libres de gluten o lácteos) es limitada o nula, salvo en casos de deficiencia o intolerancia demostrada."
    },
    {
      myth: "Evitar vegetales crucíferos o la soya es necesario en todos los pacientes con enfermedad tiroidea.",
      reality: "No hay evidencia sólida que justifique la restricción de estos alimentos en la mayoría de los pacientes con enfermedad tiroidea. Solo en casos de ingesta excesiva y deficiencia de yodo podrían tener algún impacto."
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
      question: "¿Puedo tomar levotiroxina con otros medicamentos?",
      answer: "Es importante tomar levotiroxina en ayunas, al menos 30-60 minutos antes del desayuno. Algunos medicamentos como el hierro, calcio, antiácidos pueden interferir con su absorción, por lo que deben tomarse con varias horas de diferencia."
    },
    {
      question: "¿Los problemas de tiroides se heredan?",
      answer: "Sí, existe un componente genético. Si tienes familiares con problemas tiroideos, tienes mayor riesgo de desarrollarlos. Sin embargo, tener predisposición genética no significa que definitivamente desarrollarás la enfermedad."
    },
    {
      question: "¿Puedo quedar embarazada si tengo hipotiroidismo?",
      answer: "Sí, muchas mujeres con hipotiroidismo pueden quedar embarazadas y tener embarazos saludables. Es importante mantener los niveles de TSH controlados antes y durante el embarazo, ya que las necesidades de hormona tiroidea aumentan."
    },
    {
      question: "¿El estrés puede afectar la tiroides?",
      answer: "El estrés severo puede afectar temporalmente la función tiroidea, pero rara vez es la causa principal de los trastornos tiroideos crónicos. Es más común que los problemas tiroideos causen síntomas que se confunden con estrés."
    },
    {
      question: "¿Necesito dieta especial si tengo problemas de tiroides?",
      answer: "En general, no necesitas una dieta especial. Mantén una alimentación balanceada y evita el exceso de yodo (algas marinas, suplementos). Si tomas levotiroxina, evita la soya y fibra en exceso cerca de la hora de medicación."
    }
  ];

  return (
    <section id="mitos-faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mitos, realidades y dudas comunes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Información basada en evidencia científica para aclarar conceptos erróneos sobre la tiroides
          </p>
        </div>

        {/* Introducción científica */}
        <div className="mb-12">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-6 w-6 text-blue-600" />
                <span>Información médica basada en evidencia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Las afecciones tiroideas están rodeadas de numerosos mitos y conceptos erróneos, 
                muchos de los cuales pueden afectar negativamente el diagnóstico y manejo clínico. 
                A continuación se resumen los principales mitos y realidades, sustentados en la 
                literatura médica relevante:
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mitos frecuentes */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mitos frecuentes
          </h3>
          <div className="space-y-4">
            {myths.map((item, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedMyth(expandedMyth === index ? null : index)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <CardTitle className="text-lg text-red-700">
                          MITO: {item.myth}
                        </CardTitle>
                      </div>
                    </div>
                    {expandedMyth === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 mt-1" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 mt-1" />
                    )}
                  </div>
                </CardHeader>
                {expandedMyth === index && (
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-green-800 mb-2">REALIDAD:</p>
                          <p className="text-green-700 mb-2">{item.reality}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Realidades clínicas */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Realidades clínicas
          </h3>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {clinicalRealities.map((reality, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{reality}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <span>Dudas comunes</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-6 w-6 text-blue-500" />
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </div>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
                {expandedFaq === index && (
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <AlertTriangle className="h-6 w-6" />
                <span>Importante: Esta información es educativa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Somos un grupo de estudiantes de la Universidad Católica de la Santísima Concepción 
                con la intención de facilitar el acceso a la información sobre la glándula tiroidea. 
                Esta información no reemplaza la consulta médica profesional. Siempre consulta con 
                un especialista para el diagnóstico y tratamiento de cualquier condición de salud.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MythsAndFAQ;
