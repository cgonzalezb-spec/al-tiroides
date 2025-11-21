import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple, Droplets, Heart, Moon, Shield, Salad } from 'lucide-react';
const ThyroidHealthTips = () => {
  const nutritionTips = [{
    icon: <Droplets className="w-6 h-6" />,
    title: "Yodo",
    description: "Consume sal yodada, pescados y mariscos. El yodo es esencial para la producción de hormonas tiroideas.",
    foods: ["Pescado", "Algas marinas", "Sal yodada", "Lácteos"]
  }, {
    icon: <Shield className="w-6 h-6" />,
    title: "Selenio",
    description: "Este mineral protege la tiroides del estrés oxidativo y ayuda a la conversión de T4 a T3.",
    foods: ["Nueces de Brasil", "Atún", "Huevos", "Semillas de girasol"]
  }, {
    icon: <Apple className="w-6 h-6" />,
    title: "Vitaminas y Minerales",
    description: "Zinc, vitamina D, vitamina B12 y hierro son cruciales para el buen funcionamiento tiroideo.",
    foods: ["Carne magra", "Legumbres", "Frutas cítricas", "Vegetales verdes"]
  }];
  const lifestyleTips = [{
    icon: <Heart className="w-6 h-6" />,
    title: "Ejercicio Regular",
    description: "Mantén actividad física moderada 3-5 veces por semana para apoyar el metabolismo tiroideo."
  }, {
    icon: <Moon className="w-6 h-6" />,
    title: "Sueño de Calidad",
    description: "Duerme 7-8 horas diarias. El descanso adecuado ayuda a regular las hormonas tiroideas."
  }, {
    icon: <Salad className="w-6 h-6" />,
    title: "Dieta Equilibrada",
    description: "Evita el exceso de alimentos procesados y mantén una alimentación variada y nutritiva."
  }];
  return <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            ¿Cómo cuidar mi glándula tiroides?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Consejos prácticos de nutrición y estilo de vida para mantener una tiroides saludable
          </p>
        </div>

        {/* Nutrición */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
            Nutrientes Esenciales
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {nutritionTips.map((tip, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">{tip.icon}</div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tip.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Fuentes alimenticias:</p>
                    <div className="flex flex-wrap gap-2">
                      {tip.foods.map((food, i) => <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {food}
                        </span>)}
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Estilo de Vida */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
            Hábitos Saludables
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {lifestyleTips.map((tip, index) => <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">{tip.icon}</div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Recomendaciones Generales */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Recomendaciones Importantes
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Realiza chequeos médicos regulares, especialmente si tienes antecedentes familiares de problemas tiroideos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Evita el consumo excesivo de alimentos bociógenos crudos (col, brócoli, coliflor) si tienes tendencia a problemas tiroideos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Mantén un peso saludable a través de una dieta balanceada y ejercicio regular</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Reduce el estrés mediante técnicas de relajación como meditación o yoga</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Consulta a tu médico antes de tomar suplementos que puedan afectar la función tiroidea</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default ThyroidHealthTips;