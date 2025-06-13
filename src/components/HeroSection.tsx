
import { ArrowRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section id="inicio" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tu tiroides{' '}
                <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                  al tiro
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Información clara, confiable y en chileno sobre problemas de tiroides. 
                Aprende, evalúa tus síntomas y toma decisiones informadas sobre tu salud.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-lg px-8 py-4"
              >
                Hacer autotest <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 border-2 hover:bg-blue-50"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Ver video explicativo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5+</div>
                <div className="text-sm text-gray-600">Trastornos explicados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">100%</div>
                <div className="text-sm text-gray-600">Información médica</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">24/7</div>
                <div className="text-sm text-gray-600">Disponible siempre</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">¿Cómo te sientes?</h3>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🦋</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    'Fatiga constante',
                    'Cambios de peso',
                    'Problemas de concentración',
                    'Sensibilidad al frío/calor'
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                      <span className="text-gray-700">{symptom}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                  Evaluar mis síntomas
                </Button>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-blue-400 to-green-300 rounded-full opacity-20"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
