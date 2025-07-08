
import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Users, Heart, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/contexts/RoleContext';
import { useAuth } from '@/contexts/AuthContext';

const About = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar contenido desde la base de datos
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data: contentData, error } = await supabase
        .from('about_page_content')
        .select('*')
        .in('section_key', ['description', 'mission', 'vision']);

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading content:', error);
        return;
      }

      if (contentData && Array.isArray(contentData)) {
        contentData.forEach(item => {
          if (item.section_key === 'description') {
            setDescription(item.content || '');
            if (item.images && Array.isArray(item.images)) {
              setImages(item.images as string[]);
            }
          } else if (item.section_key === 'mission') {
            setMission(item.content || '');
          } else if (item.section_key === 'vision') {
            setVision(item.content || '');
          }
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Sin permisos",
        description: "Solo los administradores pueden editar esta página."
      });
      return;
    }

    setSaving(true);
    try {
      // Guardar los tres textos
      const updates = [
        {
          section_key: 'description',
          content: description,
          images: images,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        },
        {
          section_key: 'mission',
          content: mission,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        },
        {
          section_key: 'vision',
          content: vision,
          updated_at: new Date().toISOString(),
          updated_by: user?.id
        }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('about_page_content')
          .upsert(update, {
            onConflict: 'section_key'
          });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
      }

      toast({
        title: "Cambios guardados",
        description: "La información de la página ha sido actualizada."
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se pudieron guardar los cambios: ${error.message || 'Error desconocido'}`
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header con botón de regreso */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Quiénes Somos</h1>
            {isAdmin && (
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                disabled={saving}
              >
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hero Section */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-green-500 p-3 rounded-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <span>Al-tiroides</span>
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Información al tiro sobre salud tiroidea
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Misión y Visión */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span>Nuestra Misión</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Describe la misión del proyecto..."
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    {mission || "Compartir información clara, confiable y de fácil acceso sobre la salud tiroidea, con el objetivo de ayudar a la visibilización de la glándula tiroides."}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-green-600" />
                  <span>Nuestra Visión</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    placeholder="Describe la visión del proyecto..."
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    rows={4}
                    className="w-full"
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    {vision || "Ser una página de fácil acceso a la información sobre la glándula tiroides, creando redes de apoyo donde pacientes y profesionales de la salud puedan colaborar para mejorar la calidad de vida de quienes viven con enfermedades tiroideas."}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Descripción del Proyecto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span>Sobre el Proyecto</span>
                {isAdmin && isEditing && (
                  <span className="text-sm text-green-600 font-normal">(Modo edición activo)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe el proyecto, sus objetivos y valores..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    className="w-full"
                  />
                  <Button 
                    onClick={saveChanges} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Guardar descripción"}
                  </Button>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {description ? (
                    <div className="whitespace-pre-wrap text-gray-700">
                      {description}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      <p>Al-tiroides nace como una iniciativa para masificar el acceso a la información sobre la glándula tiroides, todo esto en el marco de la actividad "pitch" de fisiología en la universidad católica de la santísima Concepción.</p>
                      <p className="mt-4">Nuestro objetivo es crear un espacio donde pacientes, familiares y profesionales de la salud puedan encontrar información clara, confiable y de fácil acceso.</p>
                      <p className="mt-4">La información es nuestra principal herramienta, y cuando se trata de salud, entregar un acceso facilitado a datos precisos y confiables puede generar un cambio en la vida de quienes conviven a diario con las enfermedades tiroideas.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Galería de Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle>Galería</CardTitle>
              <CardDescription>
                Imágenes que representan nuestro proyecto y valores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Haz clic para subir imágenes</p>
                    <p className="text-sm text-gray-400">PNG, JPG hasta 5MB</p>
                  </label>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={image}
                            alt={`Imagen ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-110"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
                          <img
                            src={image}
                            alt={`Imagen ${index + 1} ampliada`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && !isEditing && (
                <div className="text-center py-8 text-gray-500">
                  <p>Aún no hay imágenes en la galería.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Valores */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Confianza</h3>
                <p className="text-gray-600 text-sm">
                  Información respaldada por profesionales de la salud
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comunidad</h3>
                <p className="text-gray-600 text-sm">
                  Un espacio de apoyo mutuo y colaboración
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Claridad</h3>
                <p className="text-gray-600 text-sm">
                  Información simple y fácil de entender
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
};

export default About;
