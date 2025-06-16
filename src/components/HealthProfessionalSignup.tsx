
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface HealthProfessionalSignupProps {
  onBack: () => void;
}

const HealthProfessionalSignup = ({ onBack }: HealthProfessionalSignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('');
  const [institution, setInstitution] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const areas = [
    'Endocrinología',
    'Medicina Interna',
    'Medicina Familiar',
    'Cirugía General',
    'Nutrición',
    'Enfermería',
    'Estudiante de Medicina',
    'Estudiante de Enfermería',
    'Estudiante de Nutrición',
    'Estudiante de Kinesiología',
    'Estudiante de Tecnología Médica',
    'Estudiante de Fonoaudiología',
    'Otro'
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!area || !institution) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            area,
            institution,
            experience,
            user_type: 'health_professional'
          }
        },
      });

      if (error) throw error;

      toast({
        title: "Registro exitoso",
        description: "Por favor, revisa tu correo para verificar tu cuenta como profesional de salud.",
      });
      
      onBack();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.error_description || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle>Registro Profesional de Salud</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="area">Área de salud</Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((areaOption) => (
                  <SelectItem key={areaOption} value={areaOption}>
                    {areaOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="institution">Institución / Universidad</Label>
            <Input
              id="institution"
              placeholder="Hospital, clínica o universidad"
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="experience">Experiencia adicional (opcional)</Label>
            <Textarea
              id="experience"
              placeholder="Describe brevemente tu experiencia o estudios..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600" 
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse como Profesional'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={onBack}
            >
              Volver
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthProfessionalSignup;
