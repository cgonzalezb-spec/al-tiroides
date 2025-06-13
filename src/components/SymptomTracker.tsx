
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Heart, Thermometer, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SymptomEntry {
  id: string;
  date: string;
  weight?: number;
  energy: number;
  mood: number;
  temperature?: number;
  symptoms: string[];
  notes?: string;
}

const SymptomTracker = () => {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weight: '',
    energy: 5,
    mood: 5,
    temperature: '',
    symptoms: [] as string[],
    notes: ''
  });

  const commonSymptoms = [
    'Fatiga', 'Dolor de cabeza', 'Palpitaciones', 'Insomnio',
    'Frío', 'Calor', 'Sudoración', 'Temblores',
    'Ansiedad', 'Depresión', 'Irritabilidad', 'Olvidos'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('thyroid-symptoms');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('thyroid-symptoms', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const newEntry: SymptomEntry = {
      id: Date.now().toString(),
      date: today,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      energy: formData.energy,
      mood: formData.mood,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      symptoms: formData.symptoms,
      notes: formData.notes
    };

    setEntries([newEntry, ...entries]);
    setFormData({
      weight: '',
      energy: 5,
      mood: 5,
      temperature: '',
      symptoms: [],
      notes: ''
    });
    setShowForm(false);

    toast({
      title: "Síntomas registrados",
      description: "Tu entrada de hoy ha sido guardada",
    });
  };

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Seguimiento de Síntomas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Registra cómo te sientes día a día para llevar un mejor control
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mis Registros</CardTitle>
                <Button onClick={() => setShowForm(!showForm)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Nuevo registro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {entries.map(entry => (
                  <div key={entry.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{entry.date}</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline">
                          Energía: {entry.energy}/10
                        </Badge>
                        <Badge variant="outline">
                          Ánimo: {entry.mood}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                      {entry.weight && (
                        <div className="flex items-center space-x-1">
                          <Scale className="h-4 w-4" />
                          <span>{entry.weight} kg</span>
                        </div>
                      )}
                      {entry.temperature && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="h-4 w-4" />
                          <span>{entry.temperature}°C</span>
                        </div>
                      )}
                    </div>

                    {entry.symptoms.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Síntomas:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.symptoms.map(symptom => (
                            <Badge key={symptom} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.notes && (
                      <p className="text-sm text-gray-600 italic">"{entry.notes}"</p>
                    )}
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No has registrado síntomas aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Registro de hoy</CardTitle>
                <CardDescription>
                  Completa la información que quieras registrar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Peso (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        placeholder="70.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperatura (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                        placeholder="36.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Nivel de energía: {formData.energy}/10</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.energy}
                      onChange={(e) => setFormData({...formData, energy: parseInt(e.target.value)})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Estado de ánimo: {formData.mood}/10</Label>
                    <Input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.mood}
                      onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Síntomas presentes</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {commonSymptoms.map(symptom => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className={`p-2 text-sm rounded border transition-colors ${
                            formData.symptoms.includes(symptom)
                              ? 'bg-blue-100 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="¿Cómo te sientes hoy?"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={addEntry} className="flex-1">
                      Guardar registro
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
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

export default SymptomTracker;
