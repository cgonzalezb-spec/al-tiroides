
import { ArrowRight, PlayCircle, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface Video {
  id: string;
  file: File;
  url: string;
  name: string;
}

const HeroSection = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminMode = localStorage.getItem('adminMode');
    setIsAdmin(adminMode === 'true');
    
    // Cargar videos guardados si existen
    const savedVideos = localStorage.getItem('explanatoryVideos');
    if (savedVideos) {
      const parsedVideos = JSON.parse(savedVideos);
      setVideos(parsedVideos);
    }
  }, []);

  // Auto-rotar videos cada 10 segundos
  useEffect(() => {
    if (videos.length > 1 && !isAdmin) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [videos.length, isAdmin]);

  const scrollToTest = () => {
    const element = document.querySelector('#autotest');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo: Video = {
        id: Date.now().toString(),
        file,
        url,
        name: file.name
      };
      
      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      localStorage.setItem('explanatoryVideos', JSON.stringify(updatedVideos.map(v => ({
        id: v.id,
        url: v.url,
        name: v.name
      }))));
      console.log('Video agregado:', file.name);
    }
  };

  const removeVideo = (videoId: string) => {
    const updatedVideos = videos.filter(v => v.id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem('explanatoryVideos', JSON.stringify(updatedVideos.map(v => ({
      id: v.id,
      url: v.url,
      name: v.name
    }))));
    if (currentVideoIndex >= updatedVideos.length && updatedVideos.length > 0) {
      setCurrentVideoIndex(0);
    }
  };

  const toggleAdminMode = () => {
    const newAdminMode = !isAdmin;
    setIsAdmin(newAdminMode);
    localStorage.setItem('adminMode', newAdminMode.toString());
  };

  const handleWatchVideo = (videoIndex?: number) => {
    const indexToShow = videoIndex !== undefined ? videoIndex : currentVideoIndex;
    const videoToShow = videos[indexToShow];
    
    if (videoToShow) {
      const videoModal = document.createElement('div');
      videoModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
      videoModal.innerHTML = `
        <div class="relative max-w-4xl w-full mx-4">
          <video controls autoplay class="w-full rounded-lg">
            <source src="${videoToShow.url}" type="video/mp4">
            Tu navegador no soporta el elemento video.
          </video>
          <button class="absolute top-4 right-4 text-white text-2xl font-bold" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;
      document.body.appendChild(videoModal);
    }
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  return (
    <section id="inicio" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Botón para alternar modo admin */}
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleAdminMode}
            className="text-xs"
          >
            {isAdmin ? '👑 Modo Admin' : '👤 Modo Visitante'}
          </Button>
        </div>

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
                onClick={scrollToTest}
                className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-lg px-8 py-4"
              >
                Hacer autotest <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              {isAdmin ? (
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-4 border-2 hover:bg-blue-50 w-full"
                    onClick={() => document.getElementById('video-upload')?.click()}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Agregar video explicativo
                  </Button>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                videos.length > 0 && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="text-lg px-8 py-4 border-2 hover:bg-blue-50 flex-1"
                      onClick={() => handleWatchVideo()}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Ver video explicativo
                    </Button>
                    {videos.length > 1 && (
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={prevVideo}
                          className="px-3"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={nextVideo}
                          className="px-3"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Administración de videos para admin */}
            {isAdmin && videos.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2">Videos subidos ({videos.length})</h4>
                <div className="space-y-2">
                  {videos.map((video, index) => (
                    <div key={video.id} className="flex justify-between items-center bg-white p-2 rounded">
                      <span className="text-sm">{video.name}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleWatchVideo(index)}
                        >
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeVideo(video.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indicador de video actual para visitantes */}
            {!isAdmin && videos.length > 1 && (
              <div className="flex justify-center gap-2">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVideoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentVideoIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}

            {!isAdmin && videos.length === 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  📹 Próximamente disponible video explicativo sobre tiroides
                </p>
              </div>
            )}

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
                
                <Button 
                  onClick={scrollToTest}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                >
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
