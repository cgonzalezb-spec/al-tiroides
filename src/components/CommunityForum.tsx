
import { useState, useEffect } from 'react';
import { MessageSquare, Send, ThumbsUp, Clock, User, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[];
  replies: ForumReply[];
}

interface ForumReply {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  likedBy: string[];
}

const CommunityForum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState({ author: '', title: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState({ author: '', content: '' });
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // Simular usuario actual
    const savedUser = localStorage.getItem('currentForumUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const createPost = () => {
    if (!newPost.author || !newPost.title || !newPost.content) {
      alert('Por favor completa todos los campos');
      return;
    }

    const post: ForumPost = {
      id: Date.now().toString(),
      author: newPost.author,
      title: newPost.title,
      content: newPost.content,
      date: new Date().toLocaleDateString('es-CL'),
      likes: 0,
      likedBy: [],
      replies: []
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    localStorage.setItem('currentForumUser', newPost.author);
    setCurrentUser(newPost.author);
    
    setNewPost({ author: '', title: '', content: '' });
  };

  const addReply = (postId: string) => {
    if (!replyContent.author || !replyContent.content) {
      alert('Por favor completa todos los campos');
      return;
    }

    const reply: ForumReply = {
      id: Date.now().toString(),
      author: replyContent.author,
      content: replyContent.content,
      date: new Date().toLocaleDateString('es-CL'),
      likes: 0,
      likedBy: []
    };

    const updatedPosts = posts.map(post =>
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    );

    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    localStorage.setItem('currentForumUser', replyContent.author);
    setCurrentUser(replyContent.author);
    
    setReplyingTo(null);
    setReplyContent({ author: '', content: '' });
  };

  const toggleLike = (postId: string, replyId?: string) => {
    const userId = currentUser || 'usuario_anonimo';
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        if (replyId) {
          // Like en respuesta
          const updatedReplies = post.replies.map(reply => {
            if (reply.id === replyId) {
              const hasLiked = reply.likedBy.includes(userId);
              return {
                ...reply,
                likes: hasLiked ? reply.likes - 1 : reply.likes + 1,
                likedBy: hasLiked 
                  ? reply.likedBy.filter(u => u !== userId)
                  : [...reply.likedBy, userId]
              };
            }
            return reply;
          });
          return { ...post, replies: updatedReplies };
        } else {
          // Like en post principal
          const hasLiked = post.likedBy.includes(userId);
          return {
            ...post,
            likes: hasLiked ? post.likes - 1 : post.likes + 1,
            likedBy: hasLiked 
              ? post.likedBy.filter(u => u !== userId)
              : [...post.likedBy, userId]
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
  };

  return (
    <section id="foro" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Foro de la comunidad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comparte experiencias, haz preguntas y conecta con otras personas que también están en el proceso de cuidar su tiroides
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario para nuevo post */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                  <span>Crear nueva publicación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Tu nombre"
                  value={newPost.author}
                  onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                />
                <Input
                  placeholder="Título de tu publicación"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                <Textarea
                  placeholder="Comparte tu experiencia, pregunta o consejo..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={4}
                />
                <Button 
                  onClick={createPost}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de posts */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Aún no hay publicaciones. ¡Sé el primero en compartir!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                            <Clock className="h-4 w-4" />
                            <span>{post.date}</span>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {post.replies.length} respuestas
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      {/* Acciones del post */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLike(post.id)}
                          className={`${post.likedBy.includes(currentUser) ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          <Heart className="mr-1 h-4 w-4" />
                          {post.likes} Me gusta
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                        >
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Responder
                        </Button>
                      </div>

                      {/* Formulario de respuesta */}
                      {replyingTo === post.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="space-y-3">
                            <Input
                              placeholder="Tu nombre"
                              value={replyContent.author}
                              onChange={(e) => setReplyContent({...replyContent, author: e.target.value})}
                            />
                            <Textarea
                              placeholder="Escribe tu respuesta..."
                              value={replyContent.content}
                              onChange={(e) => setReplyContent({...replyContent, content: e.target.value})}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => addReply(post.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Responder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent({ author: '', content: '' });
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Respuestas */}
                      {post.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="font-semibold text-gray-900">Respuestas:</h4>
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="bg-gray-50 p-3 rounded-lg ml-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <User className="h-3 w-3" />
                                <span>{reply.author}</span>
                                <Clock className="h-3 w-3" />
                                <span>{reply.date}</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLike(post.id, reply.id)}
                                className={`text-xs ${reply.likedBy.includes(currentUser) ? 'text-red-500' : 'text-gray-500'}`}
                              >
                                <Heart className="mr-1 h-3 w-3" />
                                {reply.likes}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityForum;
