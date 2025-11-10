import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Monitor, Chrome, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Install = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Instala Al Tiroides</h1>
          <p className="text-xl text-muted-foreground">
            Accede más rápido a la información de salud que necesitas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-6 w-6 text-primary" />
                <CardTitle>En Android</CardTitle>
              </div>
              <CardDescription>Chrome, Firefox, Samsung Internet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Abre esta página en tu navegador móvil</li>
                <li>Toca el menú (⋮) en la esquina superior derecha</li>
                <li>Selecciona "Agregar a pantalla de inicio" o "Instalar app"</li>
                <li>Confirma tocando "Agregar" o "Instalar"</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-6 w-6 text-primary" />
                <CardTitle>En iPhone/iPad</CardTitle>
              </div>
              <CardDescription>Safari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Abre esta página en Safari</li>
                <li>Toca el botón de compartir (□↑)</li>
                <li>Desplázate y toca "Agregar a pantalla de inicio"</li>
                <li>Confirma tocando "Agregar"</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-6 w-6 text-primary" />
                <CardTitle>En Escritorio (Chrome)</CardTitle>
              </div>
              <CardDescription>Windows, Mac, Linux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Busca el ícono de instalar (⊕) en la barra de direcciones</li>
                <li>Haz clic en "Instalar"</li>
                <li>O usa el menú (⋮) → "Instalar Al Tiroides"</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-6 w-6 text-primary" />
                <CardTitle>En Escritorio (Edge)</CardTitle>
              </div>
              <CardDescription>Windows, Mac</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Busca el ícono de instalar en la barra de direcciones</li>
                <li>Haz clic en "Instalar Al Tiroides"</li>
                <li>Confirma la instalación</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Beneficios de Instalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>✓ Acceso más rápido desde tu pantalla de inicio</li>
              <li>✓ Funciona sin conexión a internet</li>
              <li>✓ Carga instantánea de páginas</li>
              <li>✓ Experiencia de app nativa</li>
              <li>✓ Actualizaciones automáticas</li>
              <li>✓ No ocupa tanto espacio como una app tradicional</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button onClick={() => navigate("/")} variant="outline" size="lg">
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;