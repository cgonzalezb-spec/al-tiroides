
import { useState, useEffect } from 'react';
import { MessageCircle, Send, Mail, User, Calendar, Reply } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';

interface Question {
  id: string;
  name: string;
  email: string;
  question: string;
  created_at: string;
  response?: string;
  response_date?: string;
  responded_by?: string;
}

const UserQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState({ name: '', email: '', question: '' });
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isHealthProfessional } = useRole();
  
  // Usuarios que pueden responder preguntas
  const canRespond = isAdmin || isHealthProfessional;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedQuestions: Question[] = data.map(q => ({
        id: q.id,
        name: q.name,
        email: q.email,
        question: q.question,
        created_at: new Date(q.created_at).toLocaleDateString('es-CL'),
        response: q.response || undefined,
        response_date: q.response_date ? new Date(q.response_date).toLocaleDateString('es-CL') : undefined,
        responded_by: q.responded_by || undefined
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las preguntas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (!newQuestion.name || !newQuestion.email || !newQuestion.question) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_questions')
        .insert({
          name: newQuestion.name,
          email: newQuestion.email,
          question: newQuestion.question
        });

      if (error) throw error;

      toast({
        title: "¡Pregunta enviada!",
        description: "Te responderemos pronto."
      });

      setNewQuestion({ name: '', email: '', question: '' });
      await fetchQuestions(); // Refrescar la lista
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la pregunta",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const submitResponse = async (questionId: string) => {
    if (!responseText.trim()) return;

    try {
      const { error } = await supabase
        .from('user_questions')
        .update({ 
          response: responseText,
          response_date: new Date().toISOString(),
          responded_by: user?.id || null
        })
        .eq('id', questionId);

      if (error) throw error;

      toast({
        title: "Respuesta enviada",
        description: "La respuesta ha sido publicada."
      });

      setRespondingTo(null);
      setResponseText('');
      await fetchQuestions(); // Refrescar la lista
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <section id="preguntas" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando preguntas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="preguntas" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Haz tu pregunta
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes dudas sobre la tiroides? Envíanos tu pregunta y te responderemos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario para enviar preguntas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-purple-500" />
                <span>Envía tu pregunta</span>
              </CardTitle>
              <CardDescription>
                Completa el formulario y te responderemos lo antes posible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <Input
                  placeholder="Tu nombre"
                  value={newQuestion.name}
                  onChange={(e) => setNewQuestion({...newQuestion, name: e.target.value})}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email {canRespond && <span className="text-xs text-gray-500">(solo visible para profesionales)</span>}
                </label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={newQuestion.email}
                  onChange={(e) => setNewQuestion({...newQuestion, email: e.target.value})}
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pregunta</label>
                <Textarea
                  placeholder="Escribe tu pregunta sobre tiroides..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  rows={4}
                  disabled={submitting}
                />
              </div>
              <Button 
                onClick={submitQuestion}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={submitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? 'Enviando...' : 'Enviar pregunta'}
              </Button>
            </CardContent>
          </Card>

          {/* Lista de preguntas y respuestas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Reply className="h-6 w-6 text-blue-500" />
                <span>Preguntas recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aún no hay preguntas. ¡Sé el primero en preguntar!
                  </p>
                ) : (
                  questions.map((q) => (
                    <div key={q.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-sm">{q.name}</span>
                          {canRespond && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{q.email}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{q.created_at}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{q.question}</p>
                      
                      {q.response ? (
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <p className="text-sm text-blue-800 font-medium mb-1">Respuesta:</p>
                          <p className="text-sm text-blue-700">{q.response}</p>
                          <p className="text-xs text-blue-600 mt-2">Respondido el {q.response_date}</p>
                        </div>
                      ) : (
                        <>
                          {canRespond && (
                            <div className="mt-3">
                              {respondingTo === q.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Escribe tu respuesta..."
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => submitResponse(q.id)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Enviar respuesta
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setRespondingTo(null);
                                        setResponseText('');
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setRespondingTo(q.id)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  <Reply className="mr-1 h-3 w-3" />
                                  Responder
                                </Button>
                              )}
                            </div>
                          )}
                          {!canRespond && (
                            <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-700">
                              Pendiente de respuesta
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserQuestions;
