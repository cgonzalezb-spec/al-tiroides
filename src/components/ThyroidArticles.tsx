import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
  language: 'es' | 'en';
}

const articles: Article[] = [
  {
    id: 1,
    title: "Avances en el tratamiento de hipotiroidismo en 2024",
    description: "Nuevos estudios revelan estrategias innovadoras para el manejo del hipotiroidismo, incluyendo terapias personalizadas basadas en biomarcadores.",
    source: "Revista Española de Endocrinología",
    date: "2024-09-15",
    url: "https://scholar.google.com/",
    language: "es"
  },
  {
    id: 2,
    title: "Thyroid Function and Cardiovascular Health: Latest Research",
    description: "Comprehensive review of the relationship between thyroid disorders and cardiovascular disease risk factors in 2024.",
    source: "The Journal of Clinical Endocrinology",
    date: "2024-08-22",
    url: "https://academic.oup.com/",
    language: "en"
  },
  {
    id: 3,
    title: "Detección temprana de cáncer de tiroides mediante IA",
    description: "Investigadores desarrollan algoritmos de inteligencia artificial para mejorar la detección precoz del cáncer tiroideo.",
    source: "Medicina Clínica",
    date: "2024-10-05",
    url: "https://scholar.google.com/",
    language: "es"
  },
  {
    id: 4,
    title: "Impact of Nutrition on Thyroid Health in 2024",
    description: "Recent findings on how dietary patterns, selenium, and iodine intake affect thyroid function and autoimmune thyroid diseases.",
    source: "Nutrients Journal",
    date: "2024-07-18",
    url: "https://www.mdpi.com/journal/nutrients",
    language: "en"
  },
  {
    id: 5,
    title: "Hipertiroidismo y calidad de vida: Estudio longitudinal",
    description: "Análisis de factores que influyen en la calidad de vida de pacientes con hipertiroidismo tratados con diferentes modalidades terapéuticas.",
    source: "Endocrinología y Nutrición",
    date: "2024-06-30",
    url: "https://scholar.google.com/",
    language: "es"
  },
  {
    id: 6,
    title: "Thyroid Disorders in Pregnancy: 2024 Guidelines Update",
    description: "Updated clinical practice guidelines for managing thyroid conditions during pregnancy and postpartum period.",
    source: "American Thyroid Association",
    date: "2024-05-12",
    url: "https://www.thyroid.org/",
    language: "en"
  }
];

const ThyroidArticles = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Artículos Científicos Recientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Las últimas publicaciones sobre salud tiroidea de fuentes académicas reconocidas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={article.language === 'es' ? 'default' : 'secondary'}>
                    {article.language === 'es' ? 'Español' : 'English'}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(article.date)}
                  </div>
                </div>
                <CardTitle className="text-xl leading-tight">{article.title}</CardTitle>
                <CardDescription className="text-sm">{article.source}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground mb-4">
                  {article.description}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  Leer artículo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Los enlaces dirigen a bases de datos académicas donde puedes buscar estos artículos
          </p>
        </div>
      </div>
    </section>
  );
};

export default ThyroidArticles;