import { ArrowRight, PlayCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { ExplanatoryVideo } from '@/types/video';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
const HeroSection = () => {
  const [videos, setVideos] = useState<ExplanatoryVideo[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showDescriptionForm, setShowDescriptionForm] = useState(false);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<ExplanatoryVideo | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [pendingThumbnailFile, setPendingThumbnailFile] = useState<File | null>(null);
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [watchingVideoUrl, setWatchingVideoUrl] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState('');
  const [buttonSection, setButtonSection] = useState('');
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();
  const { isAdmin } = useRole();

  // Secciones disponibles en la página
  const availableSections = [
    { id: 'inicio', name: 'Inicio' },
    { id: 'que-es-tiroides', name: 'Qué es la tiroides' },
    { id: 'fisiologia', name: 'Fisiología de la tiroides' },
    { id: 'sintomas', name: 'Explorador de síntomas' },
    { id: 'tipos-trastornos', name: 'Tipos de trastornos' },
    { id: 'cirugia', name: 'Cirugía tiroidea' },
    { id: 'medicamentos', name: 'Medicamentos' },
    { id: 'mis-medicamentos', name: 'Mis medicamentos' },
    { id: 'agenda', name: 'Agendar hora' },
    { id: 'cuando-consultar', name: 'Cuándo consultar' },
    { id: 'mitos-faq', name: 'Mitos y preguntas frecuentes' },
    { id: 'consejos-salud', name: 'Consejos de salud tiroidea' },
    { id: 'consejos', name: 'Consejos generales' },
    { id: 'articulos', name: 'Artículos científicos' },
    { id: 'preguntas', name: 'Consultas de usuarios' },
    { id: 'foro', name: 'Foro comunitario' },
  ];
  useEffect(() => {
    // Intentar cargar videos, pero no mostrar errores al usuario
    loadVideosFromSupabase();
  }, []);

  // Auto-rotar videos y actualizar indicador
  useEffect(() => {
    if (!api) return;
    const handleSelect = () => {
      if (api.selectedScrollSnap() !== -1) {
        setCurrent(api.selectedScrollSnap());
      }
    };
    api.on("select", handleSelect);
    handleSelect();
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (videos.length > 1 && !isAdmin) {
      intervalId = setInterval(() => {
        if (document.hasFocus()) {
          api.scrollNext();
        }
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      api.off("select", handleSelect);
    };
  }, [api, videos.length, isAdmin]);
  const loadVideosFromSupabase = async () => {
    try {
      console.log('📥 Intentando cargar videos desde Supabase...');

      // Usar función RPC para obtener videos
      const {
        data: videoData,
        error: dbError
      } = await supabase.rpc('get_explanatory_videos');
      if (dbError) {
        console.log('ℹ️ No se encontraron videos o tabla no existe:', dbError.message);
        setVideos([]);
        return;
      }
      console.log(`✅ Videos encontrados: ${videoData?.length || 0}`);

      // Si no hay videos, establecer array vacío
      if (!videoData || videoData.length === 0) {
        setVideos([]);
        return;
      }

      // Generar URLs públicas para cada video
      const videosWithUrls: ExplanatoryVideo[] = [];
      for (const video of videoData as any[]) {
        try {
          const {
            data: urlData
          } = supabase.storage.from('explanatory-videos').getPublicUrl(video.file_path);
          videosWithUrls.push({
            id: video.id,
            title: video.title,
            description: video.description,
            file_path: video.file_path,
            file_name: video.file_name,
            file_size: video.file_size,
            created_at: video.created_at,
            uploaded_by: video.uploaded_by,
            thumbnail_url: video.thumbnail_url,
            url: urlData.publicUrl,
            button_text: video.button_text,
            button_section: video.button_section
          });
        } catch (error) {
          console.log('⚠️ Error generando URL para video:', video.file_name, error);
          // Continuar con otros videos sin fallar
        }
      }
      setVideos(videosWithUrls);
      console.log('📋 Videos cargados exitosamente:', videosWithUrls.length);
    } catch (error) {
      console.log('ℹ️ No se pudieron cargar videos:', error);
      // Establecer array vacío en lugar de mostrar error
      setVideos([]);
    }
  };
  const scrollToTest = () => {
    const element = document.querySelector('#autotest');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Archivo no válido",
          description: "Por favor selecciona un archivo de video",
          variant: "destructive"
        });
        return;
      }

      // Validar tamaño (máximo 50MB para plan gratuito de Supabase)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast({
          title: "Archivo demasiado grande",
          description: "El video no puede superar los 50MB. Para videos más grandes, usa la opción de enlace externo (YouTube/Drive).",
          variant: "destructive"
        });
        return;
      }
      setPendingVideoFile(file);
      setShowDescriptionForm(true);
      setVideoDescription('');
    }
  };
  const uploadToSupabase = async (file: File, description: string, thumbnailUrlParam?: string, btnText?: string, btnSection?: string) => {
    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar autenticado para subir videos",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    try {
      console.log('📤 Iniciando subida de video...');

      // Generar nombre único y seguro para el archivo
      const timestamp = Date.now();
      const originalName = file.name;
      const lastDot = originalName.lastIndexOf('.');
      const ext = lastDot !== -1 ? originalName.slice(lastDot + 1) : '';
      const base = lastDot !== -1 ? originalName.slice(0, lastDot) : originalName;
      // Normalizar y limpiar caracteres problemáticos (acentos, símbolos, espacios)
      const safeBase = base
        .normalize('NFD').replace(/\p{Diacritic}+/gu, '') // quitar acentos
        .replace(/[^a-zA-Z0-9-_\.]+/g, '-')               // reemplazar todo lo no permitido por '-'
        .replace(/-+/g, '-')                               // colapsar guiones
        .replace(/^[-_.]+|[-_.]+$/g, '')                   // quitar guiones/puntos al inicio/fin
        .toLowerCase();
      const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const safeFileName = `${timestamp}-${safeBase}.${safeExt || 'mp4'}`;
      const filePath = `videos/${safeFileName}`;
      console.log('📁 Subiendo archivo:', filePath);

      // Crear una promesa para manejar el progreso de subida
      const uploadPromise = new Promise((resolve, reject) => {
        const chunkSize = 6 * 1024 * 1024; // 6MB chunks para archivos grandes
        let uploadedBytes = 0;
        
        // Simular progreso mientras se sube
        const progressInterval = setInterval(() => {
          if (uploadedBytes < file.size * 0.9) {
            uploadedBytes += chunkSize;
            const progress = Math.min(Math.floor((uploadedBytes / file.size) * 100), 90);
            setUploadProgress(progress);
          }
        }, 500);

        // Subir archivo a Supabase Storage
        supabase.storage
          .from('explanatory-videos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
          .then(({ data, error }) => {
            clearInterval(progressInterval);
            if (error) {
              reject(error);
            } else {
              setUploadProgress(100);
              resolve(data);
            }
          })
          .catch(error => {
            clearInterval(progressInterval);
            reject(error);
          });
      });

      const uploadData = await uploadPromise;
      console.log('✅ Archivo subido exitosamente');

      // Usar función RPC para guardar metadatos
      const {
        data: dbData,
        error: dbError
      } = await supabase.rpc('insert_explanatory_video', {
        p_title: description.trim() || file.name,
        p_description: description.trim() || null,
        p_file_path: filePath,
        p_file_name: file.name,
        p_file_size: file.size,
        p_uploaded_by: user.id,
        p_thumbnail_url: thumbnailUrlParam?.trim() || null,
        p_button_text: btnText?.trim() || null,
        p_button_section: btnSection?.trim() || null
      });
      if (dbError) {
        console.error('❌ Error guardando metadatos:', dbError);
        // Si falla guardar metadatos, eliminar archivo subido
        await supabase.storage.from('explanatory-videos').remove([filePath]);
        throw dbError;
      }
      console.log('✅ Video subido completamente');
      toast({
        title: "¡Video subido exitosamente!",
        description: "El video está ahora disponible"
      });

      // Recargar lista de videos
      await loadVideosFromSupabase();
    } catch (error: any) {
      console.error('❌ Error en proceso de subida:', error);
      const errorMessage = error?.message || 'Error desconocido';
      toast({
        title: "Error subiendo video",
        description: `No se pudo subir el video: ${errorMessage}. Verifica tu conexión e intenta nuevamente.`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const handleDescriptionSubmit = async () => {
    if (pendingVideoFile) {
      let finalThumbnailUrl = thumbnailUrl;

      // Si hay un archivo de miniatura, subirlo primero
      if (pendingThumbnailFile) {
        const uploadedThumbnailUrl = await uploadThumbnailToSupabase(pendingThumbnailFile);
        if (uploadedThumbnailUrl) {
          finalThumbnailUrl = uploadedThumbnailUrl;
        }
      }

      await uploadToSupabase(pendingVideoFile, videoDescription, finalThumbnailUrl, buttonText, buttonSection);

      // Limpiar formulario
      setShowDescriptionForm(false);
      setPendingVideoFile(null);
      setPendingThumbnailFile(null);
      setVideoDescription('');
      setThumbnailUrl('');
      setButtonText('');
      setButtonSection('');
    }
  };
  const handleDescriptionCancel = () => {
    setShowDescriptionForm(false);
    setPendingVideoFile(null);
    setPendingThumbnailFile(null);
    setVideoDescription('');
    setThumbnailUrl('');
    setButtonText('');
    setButtonSection('');
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Archivo no válido",
          description: "Por favor selecciona una imagen (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      setPendingThumbnailFile(file);
    }
  };

  const uploadThumbnailToSupabase = async (file: File): Promise<string | null> => {
    try {
      const timestamp = Date.now();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `thumbnail-${timestamp}.${ext}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('explanatory-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error subiendo miniatura:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('explanatory-videos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error en uploadThumbnailToSupabase:', error);
      return null;
    }
  };

  const handleUrlSubmit = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL válida",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error de autenticación",
        description: "Debes estar autenticado para agregar videos",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Subir miniatura primero si hay un archivo
      let finalThumbnailUrl = thumbnailUrl.trim();
      if (pendingThumbnailFile) {
        const uploadedThumbnailUrl = await uploadThumbnailToSupabase(pendingThumbnailFile);
        if (uploadedThumbnailUrl) {
          finalThumbnailUrl = uploadedThumbnailUrl;
        }
      }

      // Auto-extraer miniatura de YouTube si no se proporciona una personalizada
      if (!finalThumbnailUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'))) {
        finalThumbnailUrl = getYouTubeThumbnail(videoUrl) || '';
      }

      // Guardar directamente en la base de datos con URL externa
      const { data: dbData, error: dbError } = await supabase.rpc('insert_explanatory_video', {
        p_title: videoDescription.trim() || 'Video externo',
        p_description: videoDescription.trim() || null,
        p_file_path: videoUrl,
        p_file_name: 'external_video',
        p_file_size: 0,
        p_uploaded_by: user.id,
        p_thumbnail_url: finalThumbnailUrl || null,
        p_button_text: buttonText?.trim() || null,
        p_button_section: buttonSection?.trim() || null
      });

      if (dbError) {
        console.error('❌ Error guardando video externo:', dbError);
        throw dbError;
      }

      toast({
        title: "¡Video agregado exitosamente!",
        description: "El video externo está ahora disponible"
      });

      await loadVideosFromSupabase();
      setShowUrlForm(false);
      setVideoUrl('');
      setVideoDescription('');
      setThumbnailUrl('');
      setPendingThumbnailFile(null);
      setButtonText('');
      setButtonSection('');
    } catch (error: any) {
      console.error('❌ Error agregando video externo:', error);
      toast({
        title: "Error agregando video",
        description: error.message || "No se pudo agregar el video externo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleEditVideo = (video: ExplanatoryVideo) => {
    setEditingVideo(video);
    setVideoDescription(video.description || '');
    setVideoUrl(isExternalVideo(video.url || '') ? (video.file_path || '') : '');
    setThumbnailUrl(video.thumbnail_url || '');
    setButtonText(video.button_text || '');
    setButtonSection(video.button_section || '');
    setShowEditForm(true);
  };

  const handleUpdateVideo = async () => {
    if (!editingVideo) return;

    setIsUploading(true);
    try {
      // Subir miniatura primero si hay un archivo
      let finalThumbnailUrl = thumbnailUrl.trim();
      if (pendingThumbnailFile) {
        const uploadedThumbnailUrl = await uploadThumbnailToSupabase(pendingThumbnailFile);
        if (uploadedThumbnailUrl) {
          finalThumbnailUrl = uploadedThumbnailUrl;
        }
      }

      const { error } = await supabase.rpc('update_explanatory_video', {
        p_video_id: editingVideo.id,
        p_title: videoDescription.trim() || null,
        p_description: videoDescription.trim() || null,
        p_file_path: videoUrl.trim() || null,
        p_thumbnail_url: finalThumbnailUrl || null,
        p_button_text: buttonText?.trim() || null,
        p_button_section: buttonSection?.trim() || null
      });

      if (error) {
        console.error('❌ Error actualizando video:', error);
        throw error;
      }

      toast({
        title: "¡Video actualizado!",
        description: "Los cambios se han guardado exitosamente"
      });

      await loadVideosFromSupabase();
      setShowEditForm(false);
      setEditingVideo(null);
      setVideoDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
      setPendingThumbnailFile(null);
      setButtonText('');
      setButtonSection('');
    } catch (error: any) {
      console.error('❌ Error actualizando video:', error);
      toast({
        title: "Error actualizando video",
        description: error.message || "No se pudo actualizar el video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = async (videoId: string) => {
    try {
      console.log('🗑️ Eliminando video:', videoId);

      // Buscar el video en la lista actual
      const videoToDelete = videos.find(v => v.id === videoId);
      if (!videoToDelete) {
        toast({
          title: "Error",
          description: "Video no encontrado",
          variant: "destructive"
        });
        return;
      }

      // Eliminar archivo de Storage (usando el nuevo bucket)
      const {
        error: storageError
      } = await supabase.storage.from('explanatory-videos').remove([videoToDelete.file_path]);
      if (storageError) {
        console.log('⚠️ Error eliminando archivo de storage:', storageError);
        // Continuar aunque falle eliminar el archivo
      }

      // Usar función RPC para eliminar registro
      const {
        error: dbError
      } = await supabase.rpc('delete_explanatory_video', {
        p_video_id: videoId
      });
      if (dbError) {
        console.error('❌ Error eliminando de base de datos:', dbError);
        throw dbError;
      }
      console.log('✅ Video eliminado exitosamente');
      toast({
        title: "Video eliminado",
        description: "El video ha sido eliminado exitosamente"
      });

      // Recargar lista de videos
      await loadVideosFromSupabase();
    } catch (error: any) {
      console.error('❌ Error eliminando video:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el video",
        variant: "destructive"
      });
    }
  };
  const extractYouTubeVideoId = (url: string) => {
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    if (url.includes('youtube.com')) {
      return url.split('v=')[1]?.split('&')[0];
    }
    return null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convertir URLs de YouTube a formato embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // Google Drive
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/[-\w]{25,}/)?.[0];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }
    return url;
  };

  const isExternalVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com') || url.startsWith('http');
  };

  const handleWatchVideo = (videoIndex: number) => {
    const videoToShow = videos[videoIndex];
    if (videoToShow && videoToShow.url) {
      setWatchingVideoUrl(videoToShow.url);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
    return <section id="inicio" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Video modal */}
        {watchingVideoUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setWatchingVideoUrl(null)}>
            <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              {isExternalVideo(watchingVideoUrl) ? (
                <iframe 
                  src={getVideoEmbedUrl(watchingVideoUrl)} 
                  className="w-full aspect-video rounded-lg" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              ) : (
                <video controls autoPlay className="w-full rounded-lg">
                  <source src={watchingVideoUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento video.
                </video>
              )}
              <button 
                className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300" 
                onClick={() => setWatchingVideoUrl(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Formulario de edición de video */}
        {showEditForm && editingVideo && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Editar video</h3>
              <div className="space-y-4">
                {isExternalVideo(editingVideo.url || '') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      URL del video
                    </label>
                    <Input 
                      type="url"
                      value={videoUrl} 
                      onChange={e => setVideoUrl(e.target.value)} 
                      placeholder="https://youtube.com/watch?v=..." 
                      className="w-full" 
                      disabled={isUploading}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Miniatura (opcional)
                  </label>
                  <div className="space-y-2">
                    <div>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="w-full" 
                        disabled={isUploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Sube una imagen JPG, PNG, etc.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500">o</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                      <Input 
                        type="url"
                        value={thumbnailUrl} 
                        onChange={e => setThumbnailUrl(e.target.value)} 
                        placeholder="https://..." 
                        className="w-full" 
                        disabled={isUploading || !!pendingThumbnailFile}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O pega una URL de imagen
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <Textarea 
                    value={videoDescription} 
                    onChange={e => setVideoDescription(e.target.value)} 
                    placeholder="Escribe una breve descripción del video..." 
                    className="w-full" 
                    rows={3} 
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Botón de navegación (opcional)
                  </label>
                  <div className="space-y-2">
                    <Input 
                      value={buttonText} 
                      onChange={e => setButtonText(e.target.value)} 
                      placeholder='Ej: "Ir a más detalles de fisiología"' 
                      className="w-full" 
                      disabled={isUploading}
                    />
                    <select 
                      value={buttonSection} 
                      onChange={e => setButtonSection(e.target.value)} 
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      disabled={isUploading}
                    >
                      <option value="">Selecciona una sección</option>
                      {availableSections.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Agrega un botón que lleve a una sección específica de la página
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingVideo(null);
                      setVideoUrl('');
                      setVideoDescription('');
                      setThumbnailUrl('');
                      setButtonText('');
                      setButtonSection('');
                    }} 
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdateVideo} 
                    className="bg-blue-600 hover:bg-blue-700" 
                    disabled={isUploading}
                  >
                    {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </div>
            </div>
          </div>}

        {/* Formulario de URL de video externo */}
        {showUrlForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Agregar video desde enlace externo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL del video (YouTube o Google Drive) *
                  </label>
                  <Input 
                    type="url"
                    value={videoUrl} 
                    onChange={e => setVideoUrl(e.target.value)} 
                    placeholder="https://youtube.com/watch?v=..." 
                    className="w-full" 
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Pega el enlace de YouTube o Google Drive
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Miniatura (opcional)
                  </label>
                  <div className="space-y-2">
                    <div>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="w-full" 
                        disabled={isUploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Sube una imagen JPG, PNG, etc.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500">o</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                      <Input 
                        type="url"
                        value={thumbnailUrl} 
                        onChange={e => setThumbnailUrl(e.target.value)} 
                        placeholder="https://..." 
                        className="w-full" 
                        disabled={isUploading || !!pendingThumbnailFile}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        YouTube extrae miniatura automáticamente. Opcional para otros.
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descripción (opcional)
                  </label>
                  <Textarea 
                    value={videoDescription} 
                    onChange={e => setVideoDescription(e.target.value)} 
                    placeholder="Escribe una breve descripción del video..." 
                    className="w-full" 
                    rows={3} 
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Botón de navegación (opcional)
                  </label>
                  <div className="space-y-2">
                    <Input 
                      value={buttonText} 
                      onChange={e => setButtonText(e.target.value)} 
                      placeholder='Ej: "Ir a más detalles de fisiología"' 
                      className="w-full" 
                      disabled={isUploading}
                    />
                    <select 
                      value={buttonSection} 
                      onChange={e => setButtonSection(e.target.value)} 
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      disabled={isUploading}
                    >
                      <option value="">Selecciona una sección</option>
                      {availableSections.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Agrega un botón que lleve a una sección específica de la página
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowUrlForm(false);
                      setVideoUrl('');
                      setVideoDescription('');
                      setThumbnailUrl('');
                      setButtonText('');
                      setButtonSection('');
                    }}
                    disabled={isUploading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUrlSubmit} 
                    className="bg-blue-600 hover:bg-blue-700" 
                    disabled={isUploading || !videoUrl.trim()}
                  >
                    {isUploading ? 'Guardando...' : 'Guardar Video'}
                  </Button>
                </div>
              </div>
            </div>
          </div>}

        {/* Formulario de descripción de video */}
        {showDescriptionForm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Agregar descripción al video</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Archivo: {pendingVideoFile?.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Tamaño: {pendingVideoFile ? (pendingVideoFile.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Miniatura (opcional)
                  </label>
                  <div className="space-y-2">
                    <div>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="w-full" 
                        disabled={isUploading}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Sube una imagen JPG, PNG, etc.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500">o</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                      <Input 
                        type="url"
                        value={thumbnailUrl} 
                        onChange={e => setThumbnailUrl(e.target.value)} 
                        placeholder="https://..." 
                        className="w-full" 
                        disabled={isUploading || !!pendingThumbnailFile}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O pega una URL de imagen
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descripción (opcional)
                  </label>
                  <Textarea value={videoDescription} onChange={e => setVideoDescription(e.target.value)} placeholder="Escribe una breve descripción del video..." className="w-full" rows={3} disabled={isUploading} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Botón de navegación (opcional)
                  </label>
                  <div className="space-y-2">
                    <Input 
                      value={buttonText} 
                      onChange={e => setButtonText(e.target.value)} 
                      placeholder='Ej: "Ir a más detalles de fisiología"' 
                      className="w-full" 
                      disabled={isUploading}
                    />
                    <select 
                      value={buttonSection} 
                      onChange={e => setButtonSection(e.target.value)} 
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      disabled={isUploading}
                    >
                      <option value="">Selecciona una sección</option>
                      {availableSections.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">
                      Agrega un botón que lleve a una sección específica de la página
                    </p>
                  </div>
                </div>
                {isUploading && <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subiendo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{
                  width: `${uploadProgress}%`
                }}></div>
                    </div>
                  </div>}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleDescriptionCancel} disabled={isUploading}>
                    Cancelar
                  </Button>
                  <Button onClick={handleDescriptionSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={isUploading}>
                    {isUploading ? 'Subiendo...' : 'Subir Video'}
                  </Button>
                </div>
              </div>
            </div>
          </div>}

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Título y descripción */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Todo sobre la{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                tiroides
              </span>{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                al tiro
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Información clara, confiable y en chileno sobre problemas de tiroides. 
              Aprende, evalúa tus síntomas y toma decisiones informadas sobre tu salud.
            </p>
          </div>

          {/* Grid: Video y Recuadro "¿Cómo te sientes?" */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Videos */}
            <div className="space-y-6">
              {isAdmin ? <div className="space-y-2">
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-blue-50" onClick={() => document.getElementById('video-upload')?.click()} disabled={isUploading}>
                      <Upload className="mr-2 h-5 w-5" />
                      {isUploading ? 'Subiendo...' : 'Subir archivo (máx 50MB)'}
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-green-50" onClick={() => setShowUrlForm(true)} disabled={isUploading}>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Enlace externo
                    </Button>
                  </div>
                  <input id="video-upload" type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={isUploading} />
                </div> : videos.length > 0 && <div className="w-full">
                    <Carousel setApi={setApi} className="w-full" opts={{
                loop: videos.length > 1
              }}>
                      <CarouselContent>
                         {videos.map((video, index) => <CarouselItem key={video.id}>
                            <div className="p-1">
                              <div className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group shadow-lg" onClick={() => handleWatchVideo(index)}>
                                {video.thumbnail_url ? (
                                  <img 
                                    src={video.thumbnail_url} 
                                    alt={video.title || 'Video thumbnail'} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : isExternalVideo(video.url || '') ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <PlayCircle className="h-16 w-16 text-white/90 drop-shadow-lg" />
                                  </div>
                                ) : (
                                  <video src={video.url} className="w-full h-full object-cover" playsInline muted preload="metadata">
                                    Tu navegador no soporta videos.
                                  </video>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                   <PlayCircle className="h-12 w-12 text-white/90 drop-shadow-lg transform transition-transform group-hover:scale-110" />
                                 </div>
                               </div>
                               
                               {/* Descripción y botón debajo del video */}
                               <div className="mt-3 px-2 space-y-2">
                                 {video.description && (
                                   <p className="text-muted-foreground text-sm">
                                     {video.description}
                                   </p>
                                 )}
                                 {video.button_text && video.button_section && (
                                   <Button 
                                     variant="outline" 
                                     size="sm"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       scrollToSection(video.button_section!);
                                     }}
                                     className="w-full"
                                   >
                                     <ArrowRight className="mr-2 h-4 w-4" />
                                     {video.button_text}
                                   </Button>
                                 )}
                               </div>
                            </div>
                          </CarouselItem>)}
                      </CarouselContent>
                      {videos.length > 1 && <>
                          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" />
                          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10" />
                        </>}
                    </Carousel>
                  </div>}
              
              {/* Administración de videos para admin */}
              {isAdmin && videos.length > 0 && <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2">Videos almacenados ({videos.length})</h4>
                  <div className="space-y-2">
                    {videos.map((video, index) => <div key={video.id} className="flex justify-between items-start bg-white p-3 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Video {index + 1}: {video.file_name}
                          </div>
                          {video.description && <div className="text-sm text-gray-700">{video.description}</div>}
                          {!video.description && <div className="text-sm text-gray-400 italic">Sin descripción</div>}
                          <div className="text-xs text-gray-500 mt-1">
                            Subido: {new Date(video.created_at).toLocaleDateString('es-CL')}
                            {video.file_size && ` • ${(video.file_size / (1024 * 1024)).toFixed(2)} MB`}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleWatchVideo(index)}>
                            Ver
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditVideo(video)} className="bg-green-50 hover:bg-green-100">
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeVideo(video.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </div>)}
                  </div>
                </div>}

              {/* Indicador de video actual para visitantes */}
              {!isAdmin && videos.length > 1 && <div className="flex justify-center gap-2">
                  {videos.map((_, index) => <button key={index} onClick={() => api?.scrollTo(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${current === index ? 'w-4 bg-blue-600' : 'bg-gray-300'}`} aria-label={`Ir al video ${index + 1}`} />)}
                </div>}

              {!isAdmin && videos.length === 0 && <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <p className="text-blue-800 text-sm">
                    📹 Próximamente disponible video explicativo sobre tiroides
                  </p>
                </div>}
            </div>

            {/* Síntomas comunes */}
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
                    {['Fatiga constante', 'Cambios de peso', 'Problemas de concentración', 'Sensibilidad al frío/calor'].map((symptom, index) => <div key={index} className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-400 rounded-full"></div>
                        <span className="text-gray-700">{symptom}</span>
                      </div>)}
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-blue-400 to-green-300 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;