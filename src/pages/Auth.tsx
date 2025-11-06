
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import HealthProfessionalSignup from '@/components/HealthProfessionalSignup';
import { useNavigate } from 'react-router-dom';

import { z } from 'zod';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'visitor-signup' | 'professional-signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const authSchema = z.object({
    email: z.string().trim().email({ message: 'Correo inválido' }).max(255),
    password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }).max(128)
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const values = { email: email.trim(), password };
    const parsed = authSchema.safeParse(values);
    if (!parsed.success) {
      toast({
        variant: 'destructive',
        title: 'Datos inválidos',
        description: parsed.error.issues[0]?.message ?? 'Revisa tu correo y contraseña.'
      });
      setLoading(false);
      return;
    }

    const { email: validEmail, password: validPassword } = parsed.data;
      try {
        if (mode === 'visitor-signup') {
          const { data, error } = await supabase.auth.signUp({
            email: validEmail,
            password: validPassword,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                user_type: 'visitor'
              }
            },
          });
          
          if (error) throw error;
          
          toast({
            title: "Registro exitoso",
            description: "Por favor, revisa tu correo para verificar tu cuenta.",
          });
          setMode('login');
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email: validEmail, password: validPassword });
          if (error) throw error;
          toast({
            title: "Inicio de sesión exitoso",
            description: "¡Bienvenido de nuevo!",
          });
        }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: error.error_description || error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  const handleGuestAccess = () => {
    toast({
      title: "Acceso como invitado",
      description: "Navegando como invitado. Algunas funciones estarán limitadas.",
    });
    navigate('/');
  };

  if (mode === 'professional-signup') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <HealthProfessionalSignup onBack={() => setMode('login')} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta de usuario general'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' 
              ? 'Bienvenido de nuevo.' 
              : 'Regístrate como usuario general para acceder a funciones básicas.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
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
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600" 
              disabled={loading}
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            {mode === 'login' ? (
              <>
                <div className="text-center text-sm text-gray-600">
                  ¿No tienes una cuenta?
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setMode('visitor-signup')}
                  >
                    Registrarse como usuario general
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-500 text-green-600 hover:bg-green-50" 
                    onClick={() => setMode('professional-signup')}
                  >
                    Soy profesional de salud
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-600 hover:text-gray-800" 
                    onClick={handleGuestAccess}
                  >
                    Continuar como invitado
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Button variant="link" onClick={() => setMode('login')}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
