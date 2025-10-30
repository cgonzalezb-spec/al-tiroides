import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface PharmacyLink {
  id: string;
  medication_name: string;
  pharmacy_name: string;
  presentation: string;
  quantity: number | null;
  price: number;
  product_url: string;
  is_active: boolean;
  commercial_name: string | null;
  laboratory: string | null;
  mg_per_tablet: string | null;
}

interface PharmacyLinkFormData {
  medication_name: string;
  pharmacy_name: string;
  presentation: string;
  quantity: string;
  price: string;
  product_url: string;
  is_active: boolean;
  commercial_name: string;
  laboratory: string;
  mg_per_tablet: string;
}

const PharmacyLinksManagement = () => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<PharmacyLink | null>(null);
  const [formData, setFormData] = useState<PharmacyLinkFormData>({
    medication_name: '',
    pharmacy_name: '',
    presentation: '',
    quantity: '',
    price: '',
    product_url: '',
    is_active: true,
    commercial_name: '',
    laboratory: '',
    mg_per_tablet: '',
  });

  const { data: pharmacyLinks, isLoading } = useQuery({
    queryKey: ['admin-pharmacy-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pharmacy_links')
        .select('*')
        .order('medication_name')
        .order('pharmacy_name');
      
      if (error) throw error;
      return data as PharmacyLink[];
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: PharmacyLinkFormData) => {
      const { error } = await supabase.from('pharmacy_links').insert({
        medication_name: data.medication_name,
        pharmacy_name: data.pharmacy_name,
        presentation: data.presentation,
        quantity: data.quantity ? parseInt(data.quantity) : null,
        price: parseInt(data.price),
        product_url: data.product_url,
        is_active: data.is_active,
        commercial_name: data.commercial_name || null,
        laboratory: data.laboratory || null,
        mg_per_tablet: data.mg_per_tablet || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pharmacy-links'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
      toast({ title: 'Enlace creado exitosamente' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Error al crear enlace', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: PharmacyLinkFormData }) => {
      const { error } = await supabase
        .from('pharmacy_links')
        .update({
          medication_name: data.medication_name,
          pharmacy_name: data.pharmacy_name,
          presentation: data.presentation,
          quantity: data.quantity ? parseInt(data.quantity) : null,
          price: parseInt(data.price),
          product_url: data.product_url,
          is_active: data.is_active,
          commercial_name: data.commercial_name || null,
          laboratory: data.laboratory || null,
          mg_per_tablet: data.mg_per_tablet || null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pharmacy-links'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
      toast({ title: 'Enlace actualizado exitosamente' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: 'Error al actualizar enlace', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pharmacy_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pharmacy-links'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
      toast({ title: 'Enlace eliminado exitosamente' });
    },
    onError: () => {
      toast({ title: 'Error al eliminar enlace', variant: 'destructive' });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('pharmacy_links')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pharmacy-links'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy-links'] });
      toast({ title: 'Estado actualizado' });
    },
  });

  const resetForm = () => {
    setFormData({
      medication_name: '',
      pharmacy_name: '',
      presentation: '',
      quantity: '',
      price: '',
      product_url: '',
      is_active: true,
      commercial_name: '',
      laboratory: '',
      mg_per_tablet: '',
    });
    setEditingLink(null);
  };

  const handleEdit = (link: PharmacyLink) => {
    setEditingLink(link);
    setFormData({
      medication_name: link.medication_name,
      pharmacy_name: link.pharmacy_name,
      presentation: link.presentation,
      quantity: link.quantity?.toString() || '',
      price: link.price.toString(),
      product_url: link.product_url,
      is_active: link.is_active,
      commercial_name: link.commercial_name || '',
      laboratory: link.laboratory || '',
      mg_per_tablet: link.mg_per_tablet || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de URL
    try {
      new URL(formData.product_url);
    } catch {
      toast({ 
        title: 'URL inválida', 
        description: 'Por favor ingresa una URL válida que comience con https://',
        variant: 'destructive' 
      });
      return;
    }

    if (!formData.medication_name || !formData.pharmacy_name || !formData.presentation || !formData.price || !formData.product_url) {
      toast({ title: 'Por favor completa todos los campos requeridos', variant: 'destructive' });
      return;
    }

    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!isAdmin) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Enlaces de Farmacia</h2>
            <p className="text-gray-600">Administra los enlaces directos a productos de farmacias</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Enlace
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingLink ? 'Editar Enlace' : 'Crear Nuevo Enlace'}</DialogTitle>
                <DialogDescription>
                  {editingLink ? 'Modifica los datos del enlace' : 'Completa el formulario para agregar un nuevo enlace de farmacia'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medication_name">Medicamento *</Label>
                  <Select
                    value={formData.medication_name}
                    onValueChange={(value) => setFormData({ ...formData, medication_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="levotiroxina">Levotiroxina</SelectItem>
                      <SelectItem value="metimazol">Metimazol</SelectItem>
                      <SelectItem value="propranolol">Propranolol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacy_name">Farmacia *</Label>
                  <Select
                    value={formData.pharmacy_name}
                    onValueChange={(value) => setFormData({ ...formData, pharmacy_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una farmacia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farmacias Ahumada">Farmacias Ahumada</SelectItem>
                      <SelectItem value="Cruz Verde">Cruz Verde</SelectItem>
                      <SelectItem value="Salcobrand">Salcobrand</SelectItem>
                      <SelectItem value="Dr. Simi">Dr. Simi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commercial_name">Nombre Comercial</Label>
                    <Input
                      id="commercial_name"
                      placeholder="Ej: Eutirox, Levoid"
                      value={formData.commercial_name}
                      onChange={(e) => setFormData({ ...formData, commercial_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="laboratory">Laboratorio</Label>
                    <Input
                      id="laboratory"
                      placeholder="Ej: Merck, Abbott"
                      value={formData.laboratory}
                      onChange={(e) => setFormData({ ...formData, laboratory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mg_per_tablet">mg/Comprimido</Label>
                  <Input
                    id="mg_per_tablet"
                    placeholder="Ej: 100mcg, 5mg"
                    value={formData.mg_per_tablet}
                    onChange={(e) => setFormData({ ...formData, mg_per_tablet: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Dosis por comprimido (ej: 100mcg, 5mg, 10mg)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentation">Presentación *</Label>
                  <Input
                    id="presentation"
                    placeholder="Ej: Levotiroxina 100mcg x30 comprimidos"
                    value={formData.presentation}
                    onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Describe la presentación del producto completa</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad de comprimidos</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Ej: 30"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Usado para calcular precio por comprimido</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (CLP) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Ej: 8790"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_url">URL del Producto *</Label>
                  <Textarea
                    id="product_url"
                    placeholder="https://www.farmacia.com/producto/levotiroxina-..."
                    value={formData.product_url}
                    onChange={(e) => setFormData({ ...formData, product_url: e.target.value })}
                    rows={3}
                  />
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs text-yellow-800 font-medium">⚠️ Importante: URL directa</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      La URL debe ser un enlace DIRECTO a la página del producto específico, no a la página de búsqueda.
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Cómo obtenerla: Ve a la farmacia online → Busca el producto → Haz clic en el producto → Copia la URL de la barra de direcciones
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Enlace activo</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingLink ? 'Actualizar' : 'Crear'} Enlace
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Cargando enlaces...</div>
        ) : (
          <div className="grid gap-4">
            {pharmacyLinks?.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {link.medication_name.charAt(0).toUpperCase() + link.medication_name.slice(1)} - {link.pharmacy_name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {link.presentation}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.is_active}
                        onCheckedChange={(checked) => 
                          toggleActiveMutation.mutate({ id: link.id, is_active: checked })
                        }
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(link)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este enlace?')) {
                            deleteMutation.mutate(link.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Nombre Comercial</p>
                      <p className="font-semibold">{link.commercial_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Laboratorio</p>
                      <p className="font-semibold">{link.laboratory || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">mg/Comprimido</p>
                      <p className="font-semibold">{link.mg_per_tablet || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Cantidad</p>
                      <p className="font-semibold">{link.quantity || 'No especificada'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Precio</p>
                      <p className="font-semibold">${link.price.toLocaleString('es-CL')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Precio por comp.</p>
                      <p className="font-semibold">
                        {link.quantity ? `$${(link.price / link.quantity).toFixed(0)}` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estado</p>
                      <p className="font-semibold">
                        <span className={link.is_active ? 'text-green-600' : 'text-gray-400'}>
                          {link.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-gray-500 text-xs">URL del producto:</p>
                    <a 
                      href={link.product_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs break-all"
                    >
                      {link.product_url}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PharmacyLinksManagement;
