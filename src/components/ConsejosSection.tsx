import { Lightbulb } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";

// Function to fetch the tip of the day
const fetchTipOfTheDay = async () => {
  // 1. Get total number of tips
  const { count, error: countError } = await supabase
    .from('tips')
    .select('*', { count: 'exact', head: true });

  if (countError) throw new Error(countError.message);
  if (!count || count === 0) return null;

  // 2. Calculate the index for the tip of the day to make it change daily
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const tipIndex = dayOfYear % count;

  // 3. Fetch the specific tip
  const { data: tip, error: tipError } = await supabase
    .from('tips')
    .select('content, category')
    .range(tipIndex, tipIndex)
    .single();

  if (tipError) {
    console.error("Error fetching tip:", tipError);
    // As a fallback, let's try to get ANY tip
     const { data: fallbackTip, error: fallbackError } = await supabase
      .from('tips')
      .select('content, category')
      .limit(1)
      .single();
    if(fallbackError) throw new Error(tipError.message);
    return fallbackTip;
  }

  return tip;
};

const ConsejosSection = () => {
  const { data: tip, isLoading, isError } = useQuery({
    queryKey: ['tipOfTheDay'],
    queryFn: fetchTipOfTheDay,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return (
    <section id="consejos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Consejo del Día
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una pequeña dosis de sabiduría para cuidar tu bienestar.
          </p>
        </div>

        <div className="flex justify-center">
          <Card className="w-full max-w-2xl shadow-xl transition-shadow duration-300 bg-white">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <div className="bg-yellow-400 p-3 rounded-full shadow-md">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">
                {isLoading ? <Skeleton className="h-8 w-48" /> : (tip?.category || 'Bienestar')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : isError ? (
                <p className="text-red-600 text-lg font-medium text-center">
                  Tuvimos un problema al cargar el consejo de hoy. Por favor, intenta de nuevo más tarde.
                </p>
              ) : tip ? (
                <blockquote className="border-l-4 border-yellow-400 pl-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                    {tip.content}
                    </p>
                </blockquote>
              ) : (
                 <p className="text-gray-600 text-lg text-center">
                  No hay consejos disponibles en este momento. ¡Vuelve pronto!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ConsejosSection;
