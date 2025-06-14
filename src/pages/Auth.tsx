
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/`,
                },
            });
            if (error) throw error;
            toast({
              title: "Registro exitoso",
              description: "Por favor, revisa tu correo para verificar tu cuenta.",
            });
            setIsSignUp(false);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Crear una cuenta' : 'Iniciar sesión'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Ingresa tus datos para registrarte.' : 'Bienvenido de nuevo.'}
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
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600" disabled={loading}>
              {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Iniciar sesión'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Inicia sesión' : 'Regístrate'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
