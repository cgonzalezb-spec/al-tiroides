
import { useState, useEffect } from 'react';
import { Plus, Clock, Pill, Trash2, Edit2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  lastTaken?: string;
}

interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string;
  taken: boolean;
  date: string;
}

const MedicationManager = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    // Cargar medicamentos del localStorage
    const savedMeds = localStorage.getItem('thyroid-medications');
    if (savedMeds) {
      setMedications(JSON.parse(savedMeds));
    }

    // Generar recordatorios para hoy
    generateTodayReminders();
  }, []);

  useEffect(() => {
    // Guardar medicamentos en localStorage
    localStorage.setItem('thyroid-medications', JSON.stringify(medications));
    generateTodayReminders();
  }, [medications]);

  const generateTodayReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedReminders = localStorage.getItem(`thyroid-reminders-${today}`);
    
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      const newReminders: Reminder[] = medications.map(med => ({
        id: `${med.id}-${today}`,
        medicationId: med.id,
        medicationName: med.name,
        time: med.time,
        taken: false,
        date: today
      }));
      setReminders(newReminders);
      localStorage.setItem(`thyroid-reminders-${today}`, JSON.stringify(newReminders));
    }
  };

  const addMedication = () => {
    if (!formData.name || !formData.dosage || !formData.time) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newMed: Medication = {
      id: Date.now().toString(),
      ...formData
    };

    setMedications([...medications, newMed]);
    setFormData({ name: '', dosage: '', frequency: '', time: '', notes: '' });
    setShowAddForm(false);
    
    toast({
      title: "Medicamento agregado",
      description: `${formData.name} ha sido agregado a tu lista`,
    });
  };

  const updateMedication = () => {
    if (!editingMed) return;

    setMedications(medications.map(med => 
      med.id === editingMed.id ? { ...editingMed, ...formData } : med
    ));
    setEditingMed(null);
    setFormData({ name: '', dosage: '', frequency: '', time: '', notes: '' });
    
    toast({
      title: "Medicamento actualizado",
      description: "Los cambios han sido guardados",
    });
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medicamento eliminado",
      description: "El medicamento ha sido removido de tu lista",
    });
  };

  const markAsTaken = (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, taken: true } : reminder
    );
    setReminders(updatedReminders);
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`thyroid-reminders-${today}`, JSON.stringify(updatedReminders));
    
    toast({
      title: "¡Bien hecho!",
      description: "Medicamento marcado como tomado",
    });
  };

  const startEdit = (med: Medication) => {
    setEditingMed(med);
    setFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      notes: med.notes || ''
    });
    setShowAddForm(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mis Medicamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Registra tus medicamentos y recibe recordatorios para no olvidar tomarlos
          </p>
        </div>

        {/* Recordatorios de hoy */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <span>Recordatorios de hoy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <p className="text-gray-600">No tienes medicamentos registrados aún</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reminders.map(reminder => (
                  <div key={reminder.id} className={`p-4 rounded-lg border-2 ${reminder.taken ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{reminder.medicationName}</h4>
                      <Badge variant={reminder.taken ? "default" : "outline"}>
                        {reminder.time}
                      </Badge>
                    </div>
                    {!reminder.taken && (
                      <Button 
                        size="sm" 
                        onClick={() => markAsTaken(reminder.id)}
                        className="w-full"
                      >
                        Marcar como tomado
                      </Button>
                    )}
                    {reminder.taken && (
                      <p className="text-green-600 text-sm font-medium">✓ Tomado</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lista de medicamentos */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mis Medicamentos</CardTitle>
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map(med => (
                  <div key={med.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{med.name}</h4>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                        <p className="text-sm text-gray-600">Cada {med.frequency} a las {med.time}</p>
                        {med.notes && (
                          <p className="text-xs text-gray-500 mt-1">{med.notes}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(med)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteMedication(med.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {medications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No has agregado medicamentos aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulario */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMed ? 'Editar Medicamento' : 'Agregar Medicamento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre del medicamento *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="ej: Levotiroxina"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dosage">Dosis *</Label>
                    <Input
                      id="dosage"
                      value={formData.dosage}
                      onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                      placeholder="ej: 50 mcg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">Frecuencia</Label>
                    <Input
                      id="frequency"
                      value={formData.frequency}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                      placeholder="ej: 24 horas, día"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Hora *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="ej: En ayunas, con agua"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={editingMed ? updateMedication : addMedication}
                      className="flex-1"
                    >
                      {editingMed ? 'Actualizar' : 'Agregar'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingMed(null);
                        setFormData({ name: '', dosage: '', frequency: '', time: '', notes: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default MedicationManager;
