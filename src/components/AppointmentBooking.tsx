
import { Calendar, Clock, MapPin, Phone, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AppointmentBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = [
    {
      id: 'endocrinologia',
      name: 'Endocrinología',
      description: 'Especialistas en trastornos hormonales y tiroides',
      icon: '🏥',
      query: 'Endocrinólogo'
    },
    {
      id: 'medicina-interna',
      name: 'Medicina Interna',
      description: 'Médicos generales que tratan problemas tiroideos',
      icon: '👨‍⚕️',
      query: 'Internista'
    },
    {
      id: 'cirugia',
      name: 'Cirugía',
      description: 'Para casos que requieren intervención quirúrgica',
      icon: '⚕️',
      query: 'Cirujano General'
    }
  ];

  const handleUrgentConsultation = () => {
    window.open('tel:412722500', '_blank');
  };

  const handleFindSpecialists = () => {
    window.open('https://www.doctoralia.cl/', '_blank');
  };
  
  const handleFindSelectedSpecialty = () => {
    const specialty = specialties.find(s => s.id === selectedSpecialty);
    if (specialty) {
      const url = `https://www.doctoralia.cl/buscar?q=${encodeURIComponent(specialty.query)}`;
      window.open(url, '_blank');
    }
  };

  const handleGoogleCalendarIntegration = () => {
    // En una implementación real, esto se conectaría con la API de Google Calendar
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consulta+médica+tiroides&dates=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=Consulta+médica+para+evaluación+de+tiroides&location=Centro+médico`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleAppleCalendarIntegration = () => {
    const formatISODateForICS = (date: Date) => date.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    const startDate = new Date();
    const endDate = new Date(Date.now() + 3600 * 1000); // 1 hour later

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatISODateForICS(startDate)}`,
      `DTEND:${formatISODateForICS(endDate)}`,
      'SUMMARY:Consulta médica tiroides',
      'DESCRIPTION:Recordatorio para consulta de evaluación de tiroides.',
      'LOCATION:Centro médico',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'consulta-medica.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          </p>
        </div>

        {/* Selector de especialidad */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            ¿Qué tipo de especialista necesitas?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {specialties.map((specialty) => (
              <Card 
                key={specialty.id}
                className={`h-full flex flex-col cursor-pointer transition-all hover:shadow-lg ${
                  selectedSpecialty === specialty.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSpecialty(prev => prev === specialty.id ? '' : specialty.id)}
              >
                <CardHeader className="text-center flex-1">
                  <div className="text-4xl mb-2">{specialty.icon}</div>
                  <CardTitle className="text-lg">{specialty.name}</CardTitle>
                  <CardDescription>{specialty.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          {selectedSpecialty && (
            <div className="text-center mt-8 animate-in fade-in duration-500">
              <Button onClick={handleFindSelectedSpecialty} className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Buscar {specialties.find(s => s.id === selectedSpecialty)?.name} en Doctoralia
              </Button>
            </div>
          )}
        </div>

        {/* Opciones de agendamiento */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card id="sistema-publico">
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
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => window.open('https://www.minsal.cl', '_blank')}
                >
                  Ir al portal MINSAL
                </Button>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white" 
                  onClick={handleUrgentConsultation}
                >
                  🚨 Urgencia SAMU (412 722 500)
                </Button>
              </div>
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
                <p className="text-sm text-gray-600">Algunas opciones en Concepción:</p>
                <ul className="text-sm space-y-1">
                  <li>• Clínica Andes Salud Concepción</li>
                  <li>• Sanatorio Alemán</li>
                  <li>• Clínica Biobío</li>
                  <li>• Hospital Clínico del Sur</li>
                </ul>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleFindSpecialists}
              >
                Buscar especialistas (Doctoralia)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integración con Calendarios */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Sincroniza con tu calendario favorito</span>
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
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={handleGoogleCalendarIntegration}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="mr-2" />
                  Google Calendar
                </Button>
                <Button 
                  onClick={handleAppleCalendarIntegration}
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Calendar className="mr-2" />
                  Apple Calendar
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Se generará un evento pre-configurado que puedes editar y guardar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AppointmentBooking;
