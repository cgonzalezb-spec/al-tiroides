import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Article {
  id: string;
  title: string;
  description: string;
  source: string;
  published_date: string;
  url: string;
  language: 'es' | 'en';
}

const ThyroidArticles = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_active', true)
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      return data as Article[];
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>
              Error al cargar los artículos. Por favor, intenta de nuevo más tarde.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article) => (
                <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={article.language === 'es' ? 'default' : 'secondary'}>
                        {article.language === 'es' ? 'Español' : 'English'}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.published_date)}
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

            {articles && articles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay artículos disponibles en este momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ThyroidArticles;