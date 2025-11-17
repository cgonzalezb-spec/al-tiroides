import { useState } from 'react';
import { AlertTriangle, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import jsPDF from 'jspdf';

const ThyroidSymptomExplorer = () => {
  const [groupASymptoms, setGroupASymptoms] = useState<string[]>([]);
  const [groupBSymptoms, setGroupBSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const groupAList = [
    'Cansancio, fatiga constante o somnolencia',
    'Aumento de peso inexplicable',
    'Intolerancia al frío',
    'Piel seca, áspera y pálida',
    'Caída de cabello, o pelo seco y quebradizo',
    'Tristeza, desgano o síntomas depresivos',
    'Lentitud para pensar o problemas de memoria',
    'Estreñimiento (constipación)',
    'Debilidad muscular o dolores',
    'Períodos menstruales abundantes o irregulares',
    'Ronquera o voz grave',
  ];

  const groupBList = [
    'Pérdida de peso inexplicable',
    'Intolerancia al calor y sudoración excesiva',
    'Palpitaciones (latidos rápidos o irregulares)',
    'Nerviosismo, irritabilidad o ansiedad',
    'Temblor fino (especialmente en manos)',
    'Dificultad para dormir (insomnio)',
    'Evacuaciones intestinales frecuentes (diarrea)',
    'Debilidad muscular (brazos y muslos)',
    'Ojos saltones o irritados',
    'Períodos menstruales ligeros o ausentes',
  ];

  const handleGroupAChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setGroupASymptoms([...groupASymptoms, symptom]);
    } else {
      setGroupASymptoms(groupASymptoms.filter(s => s !== symptom));
    }
  };

  const handleGroupBChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setGroupBSymptoms([...groupBSymptoms, symptom]);
    } else {
      setGroupBSymptoms(groupBSymptoms.filter(s => s !== symptom));
    }
  };

  const generateSummary = () => {
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('symptom-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getConclusionText = () => {
    const totalA = groupASymptoms.length;
    const totalB = groupBSymptoms.length;
    const total = totalA + totalB;

    if (total < 3) {
      return {
        title: 'Síntomas Mixtos o Insuficientes',
        content: (
          <p className="text-lg leading-relaxed">
            Has marcado una mezcla de síntomas (o muy pocos). Esto es muy común y demuestra por qué un autotest no puede dar un diagnóstico. 
            El paso correcto es <span className="font-semibold text-primary">hablar con tu médico</span> sobre tus inquietudes.
          </p>
        ),
        type: 'mixed',
        bgColor: 'from-gray-50 to-gray-100',
        borderColor: 'border-gray-300',
      };
    }

    if (totalA > totalB && totalA >= 3) {
      return {
        title: 'Posible Hipotiroidismo',
        content: (
          <div className="space-y-3">
            <p className="text-lg leading-relaxed">
              Has marcado síntomas que podrían estar asociados con el{' '}
              <span className="font-bold text-blue-700">hipotiroidismo</span>{' '}
              <span className="text-muted-foreground">(tiroides hipoactiva)</span>.
            </p>
            <p className="text-base leading-relaxed">
              El siguiente paso recomendado es{' '}
              <span className="font-semibold text-primary">discutir estos síntomas con un médico</span>.
            </p>
          </div>
        ),
        type: 'hypo',
        bgColor: 'from-blue-50 to-blue-100',
        borderColor: 'border-blue-300',
      };
    }

    if (totalB > totalA && totalB >= 3) {
      return {
        title: 'Posible Hipertiroidismo',
        content: (
          <div className="space-y-3">
            <p className="text-lg leading-relaxed">
              Has marcado síntomas que podrían estar asociados con el{' '}
              <span className="font-bold text-green-700">hipertiroidismo</span>{' '}
              <span className="text-muted-foreground">(tiroides hiperactiva)</span>.
            </p>
            <p className="text-base leading-relaxed">
              Estos síntomas deben ser{' '}
              <span className="font-semibold text-primary">evaluados por un profesional</span>.
            </p>
          </div>
        ),
        type: 'hyper',
        bgColor: 'from-green-50 to-green-100',
        borderColor: 'border-green-300',
      };
    }

    return {
      title: 'Síntomas Mixtos',
      content: (
        <p className="text-lg leading-relaxed">
          Has marcado una mezcla de síntomas. Esto es muy común y demuestra por qué un autotest no puede dar un diagnóstico. 
          El paso correcto es <span className="font-semibold text-primary">hablar con tu médico</span> sobre tus inquietudes.
        </p>
      ),
      type: 'mixed',
      bgColor: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300',
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Síntomas para Revisión Médica', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Disclaimer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ADVERTENCIA IMPORTANTE:', 15, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    const disclaimerText = 'ESTO NO ES UNA HERRAMIENTA DE DIAGNÓSTICO. Esta herramienta es solo para fines informativos y te ayuda a organizar tus síntomas para discutirlos con un profesional. No reemplaza una evaluación médica. La única forma de obtener un diagnóstico preciso es a través de un análisis de sangre (perfil tiroideo) solicitado por un médico.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - 30);
    doc.text(disclaimerLines, 15, yPosition);
    yPosition += disclaimerLines.length * 5 + 10;

    // Selected symptoms
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Síntomas seleccionados:', 15, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (groupASymptoms.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Grupo A (Posible Hipotiroidismo):', 15, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');

      groupASymptoms.forEach(symptom => {
        const lines = doc.splitTextToSize(`• ${symptom}`, pageWidth - 30);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 2;
      });
      yPosition += 5;
    }

    if (groupBSymptoms.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Grupo B (Posible Hipertiroidismo):', 15, yPosition);
      yPosition += 7;
      doc.setFont('helvetica', 'normal');

      groupBSymptoms.forEach(symptom => {
        const lines = doc.splitTextToSize(`• ${symptom}`, pageWidth - 30);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 2;
      });
    }

    // Save PDF
    doc.save('resumen-sintomas-tiroideos.pdf');
  };

  const scrollToSpecialist = () => {
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Explorador de Síntomas Tiroideos
          </h2>

          {/* Section 1: Disclaimer */}
          <Alert className="mb-8 bg-yellow-50 border-yellow-300">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-sm leading-relaxed">
              <strong className="text-yellow-800">ADVERTENCIA IMPORTANTE: ESTO NO ES UNA HERRAMIENTA DE DIAGNÓSTICO.</strong>
              <br />
              Esta herramienta es solo para fines informativos y te ayuda a organizar tus síntomas para discutirlos con un profesional. No reemplaza una evaluación médica. La única forma de obtener un diagnóstico preciso es a través de un análisis de sangre (perfil tiroideo) solicitado por un médico.
            </AlertDescription>
          </Alert>

          {/* Section 2: Two Column Explorer */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Column A - Hypothyroidism */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  Grupo A: ¿Tu cuerpo parece ir 'más lento'?
                </h3>
                <p className="text-sm text-muted-foreground mb-1">(Posible Hipotiroidismo)</p>
                <p className="text-sm font-medium text-foreground">
                  Marca los que has experimentado de forma persistente:
                </p>
              </div>
              <div className="space-y-3">
                {groupAList.map((symptom, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Checkbox
                      id={`groupA-${index}`}
                      checked={groupASymptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleGroupAChange(symptom, checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`groupA-${index}`}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Column B - Hyperthyroidism */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  Grupo B: ¿Tu cuerpo parece ir 'acelerado'?
                </h3>
                <p className="text-sm text-muted-foreground mb-1">(Posible Hipertiroidismo)</p>
                <p className="text-sm font-medium text-foreground">
                  Marca los que has experimentado de forma persistente:
                </p>
              </div>
              <div className="space-y-3">
                {groupBList.map((symptom, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Checkbox
                      id={`groupB-${index}`}
                      checked={groupBSymptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleGroupBChange(symptom, checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`groupB-${index}`}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Section 3: Action Button */}
          <div className="text-center mb-8">
            <Button
              onClick={generateSummary}
              size="lg"
              className="px-8 py-6 text-lg font-semibold"
              disabled={groupASymptoms.length === 0 && groupBSymptoms.length === 0}
            >
              Generar mi Resumen de Síntomas
            </Button>
          </div>

          {/* Section 4: Results (Hidden until button click) */}
          {showResults && (
            <div id="symptom-results" className="mt-12 space-y-6 animate-fade-in">
              <Card className={`p-8 bg-gradient-to-br ${getConclusionText().bgColor} border-2 ${getConclusionText().borderColor} shadow-xl`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {getConclusionText().title}
                  </h3>
                  <div className="text-foreground">
                    {getConclusionText().content}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={generatePDF}
                    variant="default"
                    size="lg"
                    className="flex items-center gap-2 hover-scale"
                  >
                    <Download className="h-5 w-5" />
                    Descargar mis Síntomas en PDF
                  </Button>

                  <Button
                    onClick={scrollToSpecialist}
                    variant="secondary"
                    size="lg"
                    className="flex items-center gap-2 hover-scale"
                  >
                    <Search className="h-5 w-5" />
                    Encontrar un Especialista
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ThyroidSymptomExplorer;
