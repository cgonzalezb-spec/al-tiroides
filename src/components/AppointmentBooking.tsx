
import { Calendar, Clock, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AppointmentBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('endocrinologia');

  const specialties = [
    {
      id: 'endocrinologia',
      name: 'Endocrinología',
      description: 'Especialistas en trastornos hormonales y tiroides',
      icon: '🏥'
    },
    {
      id: 'medicina-interna',
      name: 'Medicina Interna',
      description: 'Médicos generales que tratan problemas tiroideos',
      icon: '👨‍⚕️'
    },
    {
      id: 'cirugia',
      name: 'Cirugía',
      description: 'Para casos que requieren intervención quirúrgica',
      icon: '⚕️'
    }
  ];

  const handleGoogleCalendarIntegration = () => {
    // En una implementación real, esto se conectaría con la API de Google Calendar
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consulta+médica+tiroides&dates=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Consulta+médica+para+evaluación+de+tiroides&location=Centro+médico`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <section id="agendar" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Agenda tu consulta médica
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra especialistas en tu área y agenda directamente. 
            También puedes sincronizar con tu Google Calendar.
          </p>
        </div>

        {/* Selector de especialidad */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            ¿Qué tipo de especialista necesitas?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <Card 
                key={specialty.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSpecialty === specialty.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSpecialty(specialty.id)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{specialty.icon}</div>
                  <CardTitle className="text-lg">{specialty.name}</CardTitle>
                  <CardDescription>{specialty.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Opciones de agendamiento */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                <span>Sistema de salud público</span>
              </CardTitle>
              <CardDescription>
                Agenda en consultorios y hospitales públicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Salud Responde: 600 360 7777</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Portal web de tu región</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => window.open('https://www.minsal.cl', '_blank')}
              >
                Ir al portal MINSAL
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-6 w-6 text-green-500" />
                <span>Clínicas privadas</span>
              </CardTitle>
              <CardDescription>
                Agenda en clínicas y centros médicos privados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Algunas opciones populares:</p>
                <ul className="text-sm space-y-1">
                  <li>• Clínica Las Condes</li>
                  <li>• Clínica Alemana</li>
                  <li>• Red UC Christus</li>
                  <li>• Clínica Santa María</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.open('https://www.google.com/search?q=endocrinólogo+cerca+de+mí', '_blank')}
              >
                Buscar cerca de mí
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integración con Google Calendar */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Sincroniza con Google Calendar</span>
            </CardTitle>
            <CardDescription>
              Crea un recordatorio automático para tu consulta médica
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Una vez que tengas tu hora agendada, puedes crear un evento en tu calendario 
                para no olvidar la cita y prepararte con anticipación.
              </p>
              <Button 
                onClick={handleGoogleCalendarIntegration}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Crear evento en Google Calendar
              </Button>
              <p className="text-xs text-gray-500">
                Se abrirá Google Calendar con un evento pre-configurado que puedes editar
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AppointmentBooking;
