import { Heart, Pill, Activity, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ThyroidSurgery = () => {
  const scenarios = [
    {
      title: "Vida sin Tiroides (Tiroidectomía Total)",
      icon: Shield,
      color: "text-blue-600",
      description: "Cuando la glándula tiroides se extirpa completamente",
      details: [
        "Tu cuerpo necesitará hormona tiroidea sintética (levotiroxina) de por vida",
        "Con el tratamiento adecuado, puedes llevar una vida completamente normal",
        "Es fundamental tomar la medicación diariamente en ayunas",
        "Necesitarás controles regulares para ajustar la dosis según tus necesidades"
      ]
    },
    {
      title: "Media Tiroides (Hemitiroidectomía)",
      icon: Activity,
      color: "text-green-600",
      description: "Cuando se extirpa solo un lóbulo de la tiroides",
      details: [
        "El lóbulo restante puede producir suficiente hormona tiroidea en muchos casos",
        "Aproximadamente el 50-70% de los pacientes no necesitan medicación",
        "Si el lóbulo restante no produce suficiente hormona, se inicia tratamiento",
        "Los controles periódicos son esenciales para monitorear la función tiroidea"
      ]
    },
    {
      title: "Tratamiento de Reemplazo Hormonal",
      icon: Pill,
      color: "text-purple-600",
      description: "La hormona sintética sustituye la función natural",
      details: [
        "La levotiroxina es idéntica a la hormona natural T4",
        "Se absorbe mejor con el estómago vacío, 30-60 minutos antes del desayuno",
        "Evita tomar suplementos de calcio o hierro al mismo tiempo",
        "La dosis se ajusta según análisis de TSH hasta encontrar tu nivel óptimo"
      ]
    },
    {
      title: "Calidad de Vida",
      icon: Heart,
      color: "text-red-600",
      description: "Viviendo plenamente con tratamiento",
      details: [
        "Con el tratamiento correcto, la energía y el metabolismo se normalizan",
        "Puedes hacer ejercicio, trabajar y disfrutar de todas las actividades normales",
        "El embarazo es seguro con monitoreo adecuado de los niveles hormonales",
        "La comunicación con tu endocrinólogo es clave para optimizar tu bienestar"
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Vida sin Tiroides o con Tiroidectomía Parcial
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Muchas personas viven sin tiroides o con solo una parte de ella debido a cirugía por 
            cáncer, nódulos grandes, hipertiroidismo u otras condiciones. Conoce cómo tu cuerpo 
            se adapta y qué esperar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {scenarios.map((scenario, index) => {
            const IconComponent = scenario.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg bg-gray-50 ${scenario.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {scenario.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-800">
              💙 Mensaje Importante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-base leading-relaxed max-w-3xl mx-auto text-blue-800">
              La ausencia total o parcial de la glándula tiroides no te impide vivir una vida plena y activa. 
              Con el tratamiento hormonal adecuado y controles regulares, tu cuerpo funcionará con normalidad. 
              Millones de personas en todo el mundo viven exitosamente con esta condición, trabajando, haciendo 
              deporte, teniendo familias y disfrutando de todas las actividades cotidianas.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ThyroidSurgery;