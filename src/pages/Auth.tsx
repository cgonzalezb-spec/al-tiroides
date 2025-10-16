
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import HealthProfessionalSignup from '@/components/HealthProfessionalSignup';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'visitor-signup' | 'professional-signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'visitor-signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
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

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error con Google",
        description: error.message,
      });
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

          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-gray-500">o</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </Button>
          
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
