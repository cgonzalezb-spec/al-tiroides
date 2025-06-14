import { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, FileText, Download, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const symptomsList = [
  { id: 'fatigue', label: 'Cansancio o fatiga constante' },
  { id: 'weight_gain', label: 'Aumento de peso sin causa aparente' },
  { id: 'weight_loss', label: 'Pérdida de peso sin causa aparente' },
  { id: 'cold_intolerance', label: 'Intolerancia al frío' },
  { id: 'heat_intolerance', label: 'Intolerancia al calor y sudoración excesiva' },
  { id: 'hair_loss', label: 'Caída de cabello, o pelo seco y quebradizo' },
  { id: 'dry_skin', label: 'Piel seca y áspera' },
  { id: 'heart_palpitations', label: 'Palpitaciones (latidos rápidos o irregulares)' },
  { id: 'anxiety', label: 'Nerviosismo, irritabilidad o ansiedad' },
  { id: 'depression', label: 'Tristeza, desgano o lentitud para pensar' },
  { id: 'memory_issues', label: 'Dificultad para concentrarse o problemas de memoria' },
  { id: 'irregular_periods', label: 'Alteraciones en el ciclo menstrual' }
];

const SymptomsTest = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setShowResults(false);
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const analyzeResults = () => {
    setShowResults(true);
  };

  const resultMessage = useMemo(() => {
    const count = selectedSymptoms.length;

    if (count === 0) {
      return {
        title: 'Sin riesgo aparente',
        message: 'No has seleccionado síntomas. Haz clic en "Analizar mis síntomas" para una evaluación si tienes alguna preocupación.',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: <CheckCircle className="h-8 w-8 text-gray-500" />
      };
    }

    let riskLevel: 'low' | 'moderate' | 'high';
    if (count <= 2) {
      riskLevel = 'low';
    } else if (count <= 4) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'high';
    }

    switch (riskLevel) {
      case 'low':
        return {
          title: 'Riesgo bajo',
          message: `Has seleccionado ${count} síntoma(s). Es poco probable que se deban a un problema de tiroides, pero vigila si aparecen más.`,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          icon: <CheckCircle className="h-8 w-8 text-green-600" />
        };
      case 'moderate':
        return {
          title: 'Riesgo moderado',
          message: `Presentas ${count} síntoma(s) que, en conjunto, sugieren una posible alteración tiroidea. Te recomendamos hablar con tu médico.`,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />
        };
      case 'high':
        return {
          title: 'Riesgo alto',
          message: `La combinación de ${count} síntomas que presentas es altamente sugestiva de un problema de tiroides. Te recomendamos consultar con un especialista pronto.`,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          icon: <AlertTriangle className="h-8 w-8 text-red-600" />
        };
      default:
        return { title: '', message: '', color: '', bgColor: '', icon: null };
    }
  }, [selectedSymptoms]);

  const handleDownloadChecklist = () => {
    const selectedSymptomsDetails = selectedSymptoms.map(id => {
      const symptom = symptomsList.find(s => s.id === id);
      return symptom ? `- ${symptom.label}` : '';
    }).filter(Boolean);

    const checklistContent = `
Checklist de Síntomas de Tiroides
==================================

Fecha: ${new Date().toLocaleDateString('es-CL')}

He experimentado los siguientes síntomas recientemente:
${selectedSymptomsDetails.join('\n')}

Próximos pasos recomendados:
- Hablar con un médico sobre estos síntomas.
- Solicitar exámenes de TSH, T3 y T4.
- Considerar consultar con un endocrinólogo.

Nota: Este documento es una guía y no reemplaza el diagnóstico médico profesional.
    `;

    const blob = new Blob([checklistContent.trim()], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'checklist-sintomas-tiroides.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToAgenda = () => {
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="autotest" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Autotest de síntomas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evalúa tus síntomas y descubre si podrías necesitar una consulta médica. 
            Este test es orientativo y no reemplaza el diagnóstico médico.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Marca los síntomas que has experimentado en las últimas semanas</span>
              </CardTitle>
              <CardDescription>
                Selecciona todos los que apliquen a tu situación actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {symptomsList.map((symptom) => (
                  <div key={symptom.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom.id, checked as boolean)}
                    />
                    <label 
                      htmlFor={symptom.id}
                      className="text-gray-700 cursor-pointer flex-1"
                    >
                      {symptom.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button 
                  onClick={analyzeResults}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3"
                >
                  Analizar mis síntomas
                </Button>
              </div>
            </CardContent>
          </Card>

          {showResults && (
            <Card className={`${resultMessage.bgColor} border-2`}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {resultMessage.icon}
                  <div>
                    <CardTitle className={`text-2xl ${resultMessage.color}`}>
                      {resultMessage.title}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {resultMessage.message}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Próximos pasos recomendados:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">1.</span>
                      <span>Descarga el checklist para llevar a tu médico</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">2.</span>
                      <span>Solicita exámenes de TSH, T3 y T4</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">3.</span>
                      <span>Considera consultar con un endocrinólogo</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="flex-1" onClick={handleDownloadChecklist}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar checklist
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-green-500" onClick={scrollToAgenda}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Encontrar especialistas
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

export default SymptomsTest;
