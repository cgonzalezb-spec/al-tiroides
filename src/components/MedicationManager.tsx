import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Bell, Pill, Edit2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string;
}

interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  taken: boolean;
  date: string;
}

const MedicationManager = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newMed, setNewMed] = useState({ name: '', dose: '', frequency: '', time: '' });
  const [editingMed, setEditingMed] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');

  // Medicamentos comunes con dosis frecuentes
  const commonMedications = [
    { name: 'Levotiroxina', doses: ['25 mcg', '50 mcg', '75 mcg', '100 mcg', '125 mcg'], frequency: 'Una vez al día', time: '07:00' },
    { name: 'Metimazol', doses: ['5 mg', '10 mg', '15 mg', '20 mg'], frequency: 'Una vez al día', time: '08:00' },
    { name: 'Propranolol', doses: ['10 mg', '20 mg', '40 mg'], frequency: 'Cada 8 horas', time: '08:00' },
    { name: 'Eutirox', doses: ['25 mcg', '50 mcg', '75 mcg', '100 mcg'], frequency: 'Una vez al día', time: '07:00' },
    { name: 'Tiamazol', doses: ['5 mg', '10 mg', '20 mg'], frequency: 'Una vez al día', time: '08:00' }
  ];

  useEffect(() => {
    const savedMeds = localStorage.getItem('thyroid_medications');
    const savedReminders = localStorage.getItem('thyroid_reminders');
    
    if (savedMeds) setMedications(JSON.parse(savedMeds));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
  }, []);

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication = {
      ...medication,
      id: Date.now().toString()
    };
    
    const updatedMeds = [...medications, newMedication];
    setMedications(updatedMeds);
    localStorage.setItem('thyroid_medications', JSON.stringify(updatedMeds));
    
    setNewMed({ name: '', dose: '', frequency: '', time: '' });
  };

  const addQuickMedication = (commonMed: typeof commonMedications[0], selectedDose: string, customTime?: string) => {
    addMedication({
      name: commonMed.name,
      dose: selectedDose,
      frequency: commonMed.frequency,
      time: customTime || commonMed.time
    });
  };

  const updateMedicationTime = (id: string, newTime: string) => {
    const updatedMeds = medications.map(med =>
      med.id === id ? { ...med, time: newTime } : med
    );
    setMedications(updatedMeds);
    localStorage.setItem('thyroid_medications', JSON.stringify(updatedMeds));
    setEditingMed(null);
    setEditTime('');
  };

  const isUnusualTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 6 || hour > 22;
  };

  const removeMedication = (id: string) => {
    const updatedMeds = medications.filter(med => med.id !== id);
    setMedications(updatedMeds);
    localStorage.setItem('thyroid_medications', JSON.stringify(updatedMeds));
    
    const updatedReminders = reminders.filter(reminder => reminder.medicationId !== id);
    setReminders(updatedReminders);
    localStorage.setItem('thyroid_reminders', JSON.stringify(updatedReminders));
  };

  const markAsTaken = (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, taken: true } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('thyroid_reminders', JSON.stringify(updatedReminders));
  };

  const getTodaysReminders = () => {
    const today = new Date().toDateString();
    return medications.flatMap(med => 
      reminders.filter(reminder => 
        reminder.medicationId === med.id && 
        reminder.date === today
      ).map(reminder => ({ ...reminder, medication: med }))
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Gestión de medicamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Registra tus medicamentos y configura recordatorios para no olvidar ninguna dosis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Medicamentos comunes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-6 w-6 text-blue-500" />
                <span>Medicamentos comunes</span>
              </CardTitle>
              <CardDescription>
                Selecciona medicamentos frecuentes con dosis estándar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMedications.map((commonMed, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-2">{commonMed.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{commonMed.frequency}</p>
                    
                    {/* Horario personalizable */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">Horario:</label>
                      <Input
                        type="time"
                        defaultValue={commonMed.time}
                        className="text-sm"
                        onChange={(e) => {
                          const time = e.target.value;
                          if (isUnusualTime(time)) {
                            alert('⚠️ Advertencia: Esta es una hora poco común para tomar medicamentos. ¿Estás seguro?');
                          }
                          commonMed.time = time;
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {commonMed.doses.map((dose, doseIndex) => (
                        <Button
                          key={doseIndex}
                          variant="outline"
                          size="sm"
                          onClick={() => addQuickMedication(commonMed, dose)}
                          className="text-xs"
                        >
                          {dose}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agregar medicamento personalizado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-6 w-6 text-green-500" />
                <span>Agregar medicamento personalizado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Nombre del medicamento"
                  value={newMed.name}
                  onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                />
                <Input
                  placeholder="Dosis (ej: 50 mcg)"
                  value={newMed.dose}
                  onChange={(e) => setNewMed({...newMed, dose: e.target.value})}
                />
                <Input
                  placeholder="Frecuencia (ej: Una vez al día)"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                />
                <Input
                  type="time"
                  value={newMed.time}
                  onChange={(e) => setNewMed({...newMed, time: e.target.value})}
                />
                <Button 
                  onClick={() => addMedication(newMed)}
                  disabled={!newMed.name || !newMed.dose || !newMed.frequency || !newMed.time}
                  className="w-full"
                >
                  Agregar medicamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de medicamentos registrados */}
        {medications.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mis medicamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((med) => (
                  <div key={med.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{med.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Dosis:</strong> {med.dose}</p>
                      <p><strong>Frecuencia:</strong> {med.frequency}</p>
                      <div className="flex items-center justify-between">
                        <p><strong>Hora:</strong> {med.time}</p>
                        {editingMed === med.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={editTime}
                              onChange={(e) => {
                                setEditTime(e.target.value);
                                if (isUnusualTime(e.target.value)) {
                                  alert('⚠️ Advertencia: Esta es una hora poco común para tomar medicamentos.');
                                }
                              }}
                              className="text-xs h-6 w-20"
                            />
                            <Button
                              size="sm"
                              onClick={() => updateMedicationTime(med.id, editTime)}
                              className="h-6 px-2 text-xs"
                            >
                              ✓
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMed(med.id);
                              setEditTime(med.time);
                            }}
                            className="h-6 px-2"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      {isUnusualTime(med.time) && (
                        <div className="flex items-center gap-1 text-amber-600 text-xs">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Hora poco común</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recordatorios de hoy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-orange-500" />
              <span>Recordatorios de hoy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getTodaysReminders().length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay recordatorios programados para hoy
              </p>
            ) : (
              <div className="space-y-3">
                {getTodaysReminders().map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                    <div>
                      <h4 className="font-semibold">{reminder.medication.name}</h4>
                      <p className="text-sm text-gray-600">{reminder.medication.dose} - {reminder.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {reminder.taken ? (
                        <Badge className="bg-green-500">Tomado</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markAsTaken(reminder.id)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Marcar como tomado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MedicationManager;
