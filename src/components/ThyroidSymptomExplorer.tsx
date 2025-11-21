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
  const groupAList = ['Cansancio, fatiga constante o somnolencia', 'Aumento de peso inexplicable', 'Intolerancia al frío', 'Piel seca, áspera y pálida', 'Caída de cabello, o pelo seco y quebradizo', 'Tristeza, desgano o síntomas depresivos', 'Lentitud para pensar o problemas de memoria', 'Estreñimiento (constipación)', 'Debilidad muscular o dolores', 'Períodos menstruales abundantes o irregulares', 'Ronquera o voz grave'];
  const groupBList = ['Pérdida de peso inexplicable', 'Intolerancia al calor y sudoración excesiva', 'Palpitaciones (latidos rápidos o irregulares)', 'Nerviosismo, irritabilidad o ansiedad', 'Temblor fino (especialmente en manos)', 'Dificultad para dormir (insomnio)', 'Evacuaciones intestinales frecuentes (diarrea)', 'Debilidad muscular (brazos y muslos)', 'Ojos saltones o irritados', 'Períodos menstruales ligeros o ausentes'];
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
      document.getElementById('symptom-results')?.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  };
  const getConclusionText = () => {
    const totalA = groupASymptoms.length;
    const totalB = groupBSymptoms.length;
    const total = totalA + totalB;
    if (total < 3) {
      return {
        title: 'Síntomas Mixtos o Insuficientes',
        content: <p className="text-lg leading-relaxed">
            Has marcado una mezcla de síntomas (o muy pocos). Esto es muy común y demuestra por qué un autotest no puede dar un diagnóstico. 
            El paso correcto es <span className="font-semibold text-primary">hablar con tu médico</span> sobre tus inquietudes.
          </p>,
        type: 'mixed',
        bgColor: 'from-gray-50 to-gray-100',
        borderColor: 'border-gray-300'
      };
    }
    if (totalA > totalB && totalA >= 3) {
      return {
        title: 'Posible Hipotiroidismo',
        content: <div className="space-y-3">
            <p className="text-lg leading-relaxed">
              Has marcado síntomas que podrían estar asociados con el{' '}
              <span className="font-bold text-blue-700">hipotiroidismo</span>{' '}
              <span className="text-muted-foreground">(tiroides hipoactiva)</span>.
            </p>
            <p className="text-base leading-relaxed">
              El siguiente paso recomendado es{' '}
              <span className="font-semibold text-primary">discutir estos síntomas con un médico</span>.
            </p>
          </div>,
        type: 'hypo',
        bgColor: 'from-blue-50 to-blue-100',
        borderColor: 'border-blue-300'
      };
    }
    if (totalB > totalA && totalB >= 3) {
      return {
        title: 'Posible Hipertiroidismo',
        content: <div className="space-y-3">
            <p className="text-lg leading-relaxed">
              Has marcado síntomas que podrían estar asociados con el{' '}
              <span className="font-bold text-green-700">hipertiroidismo</span>{' '}
              <span className="text-muted-foreground">(tiroides hiperactiva)</span>.
            </p>
            <p className="text-base leading-relaxed">
              Estos síntomas deben ser{' '}
              <span className="font-semibold text-primary">evaluados por un profesional</span>.
            </p>
          </div>,
        type: 'hyper',
        bgColor: 'from-green-50 to-green-100',
        borderColor: 'border-green-300'
      };
    }
    return {
      title: 'Síntomas Mixtos',
      content: <p className="text-lg leading-relaxed">
          Has marcado una mezcla de síntomas. Esto es muy común y demuestra por qué un autotest no puede dar un diagnóstico. 
          El paso correcto es <span className="font-semibold text-primary">hablar con tu médico</span> sobre tus inquietudes.
        </p>,
      type: 'mixed',
      bgColor: 'from-gray-50 to-gray-100',
      borderColor: 'border-gray-300'
    };
  };
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const conclusionData = getConclusionText();

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Síntomas para Revisión Médica', pageWidth / 2, yPosition, {
      align: 'center'
    });
    yPosition += 10;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Fecha: ${currentDate}`, pageWidth / 2, yPosition, {
      align: 'center'
    });
    yPosition += 15;

    // Disclaimer box
    doc.setFillColor(255, 252, 231); // Light yellow background
    doc.rect(margin, yPosition, pageWidth - margin * 2, 45, 'F');
    doc.setDrawColor(245, 158, 11); // Yellow border
    doc.rect(margin, yPosition, pageWidth - margin * 2, 45, 'S');
    yPosition += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // Dark yellow text
    doc.text('ADVERTENCIA IMPORTANTE:', margin + 5, yPosition);
    yPosition += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const disclaimerText = 'ESTO NO ES UN DIAGNÓSTICO. Esta herramienta es solo informativa y te ayuda a organizar tus síntomas para discutirlos con un profesional. No reemplaza una evaluación médica. La única forma de obtener un diagnóstico preciso es a través de un análisis de sangre (perfil tiroideo) solicitado por un médico.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - margin * 2 - 10);
    doc.text(disclaimerLines, margin + 5, yPosition);
    yPosition += 50;

    // Reassurance message
    doc.setFillColor(239, 246, 255); // Light blue background
    doc.rect(margin, yPosition, pageWidth - margin * 2, 25, 'F');
    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 78, 216); // Blue text
    doc.text('Mensaje de Tranquilidad:', margin + 5, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const reassuranceText = 'Los trastornos tiroideos son muy comunes y tratables. Con el tratamiento adecuado, la mayoría de las personas llevan una vida completamente normal. Estás tomando el paso correcto al documentar tus síntomas.';
    const reassuranceLines = doc.splitTextToSize(reassuranceText, pageWidth - margin * 2 - 10);
    doc.text(reassuranceLines, margin + 5, yPosition);
    yPosition += 20;

    // Selected symptoms section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Síntomas Seleccionados:', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (groupASymptoms.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(29, 78, 216); // Blue
      doc.text('Grupo A - Síntomas de "Lentitud" (Posible Hipotiroidismo):', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      groupASymptoms.forEach(symptom => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        const lines = doc.splitTextToSize(`• ${symptom}`, pageWidth - margin * 2 - 5);
        doc.text(lines, margin + 5, yPosition);
        yPosition += lines.length * 5 + 2;
      });
      yPosition += 5;
    }
    if (groupBSymptoms.length > 0) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74); // Green
      doc.text('Grupo B - Síntomas de "Aceleración" (Posible Hipertiroidismo):', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      groupBSymptoms.forEach(symptom => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }
        const lines = doc.splitTextToSize(`• ${symptom}`, pageWidth - margin * 2 - 5);
        doc.text(lines, margin + 5, yPosition);
        yPosition += lines.length * 5 + 2;
      });
      yPosition += 5;
    }

    // Add new page for recommendations if needed
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Next steps section
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Proximos Pasos Recomendados:', margin, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const nextSteps = ['1. Agenda una cita con tu médico de cabecera o un endocrinólogo.', '2. Lleva este documento a tu consulta médica.', '3. Solicita un perfil tiroideo completo (TSH, T3, T4).', '4. Menciona cuánto tiempo has experimentado estos síntomas.', '5. Comenta si tienes antecedentes familiares de problemas tiroideos.', '6. No te automediques. Espera los resultados de laboratorio.'];
    nextSteps.forEach(step => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      const stepLines = doc.splitTextToSize(step, pageWidth - margin * 2);
      doc.text(stepLines, margin, yPosition);
      yPosition += stepLines.length * 5 + 3;
    });

    // Additional information based on symptoms
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informacion Adicional:', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let additionalInfo = '';
    if (conclusionData.type === 'hypo') {
      additionalInfo = 'El hipotiroidismo se trata efectivamente con hormona tiroidea sintética (levotiroxina). Con el tratamiento adecuado y seguimiento regular, la mayoría de los síntomas mejoran significativamente en pocas semanas.';
    } else if (conclusionData.type === 'hyper') {
      additionalInfo = 'El hipertiroidismo tiene varias opciones de tratamiento efectivas, incluyendo medicamentos antitiroideos, yodo radiactivo o cirugía. Tu médico determinará cuál es la mejor opción para tu caso específico.';
    } else {
      additionalInfo = 'Los síntomas mixtos o inespecíficos pueden tener múltiples causas. Un análisis de sangre completo ayudará a determinar si existe un problema tiroideo o si los síntomas se deben a otra condición.';
    }
    const additionalLines = doc.splitTextToSize(additionalInfo, pageWidth - margin * 2);
    doc.text(additionalLines, margin, yPosition);
    yPosition += additionalLines.length * 4 + 10;

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    const footerText = 'Este documento fue generado como ayuda para tu consulta médica. No reemplaza el diagnóstico profesional.';
    doc.text(footerText, pageWidth / 2, pageHeight - 10, {
      align: 'center'
    });

    // Save PDF
    doc.save('resumen-sintomas-tiroideos.pdf');
  };
  const scrollToSpecialist = () => {
    const element = document.getElementById('agendar');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                  Grupo A: ¿Tu cuerpo parece ir "más lento"?
                </h3>
                <p className="text-sm text-muted-foreground mb-1">(Posible Hipotiroidismo)</p>
                <p className="text-sm font-medium text-foreground">
                  Marca los que has experimentado de forma persistente:
                </p>
              </div>
              <div className="space-y-3">
                {groupAList.map((symptom, index) => <div key={index} className="flex items-start space-x-3">
                    <Checkbox id={`groupA-${index}`} checked={groupASymptoms.includes(symptom)} onCheckedChange={checked => handleGroupAChange(symptom, checked as boolean)} className="mt-1" />
                    <label htmlFor={`groupA-${index}`} className="text-sm leading-relaxed cursor-pointer">
                      {symptom}
                    </label>
                  </div>)}
              </div>
            </Card>

            {/* Column B - Hyperthyroidism */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  Grupo B: ¿Tu cuerpo parece ir "acelerado"?
                </h3>
                <p className="text-sm text-muted-foreground mb-1">(Posible Hipertiroidismo)</p>
                <p className="text-sm font-medium text-foreground">
                  Marca los que has experimentado de forma persistente:
                </p>
              </div>
              <div className="space-y-3">
                {groupBList.map((symptom, index) => <div key={index} className="flex items-start space-x-3">
                    <Checkbox id={`groupB-${index}`} checked={groupBSymptoms.includes(symptom)} onCheckedChange={checked => handleGroupBChange(symptom, checked as boolean)} className="mt-1" />
                    <label htmlFor={`groupB-${index}`} className="text-sm leading-relaxed cursor-pointer">
                      {symptom}
                    </label>
                  </div>)}
              </div>
            </Card>
          </div>

          {/* Section 3: Action Button */}
          <div className="text-center mb-8">
            <Button onClick={generateSummary} size="lg" className="px-8 py-6 text-lg font-semibold" disabled={groupASymptoms.length === 0 && groupBSymptoms.length === 0}>
              Analizar mis síntomas  
            </Button>
          </div>

          {/* Section 4: Results (Hidden until button click) */}
          {showResults && <div id="symptom-results" className="mt-12 space-y-6 animate-fade-in">
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
                  <Button onClick={generatePDF} variant="default" size="lg" className="flex items-center gap-2 hover-scale">
                    <Download className="h-5 w-5" />
                    Descargar mis Síntomas en PDF
                  </Button>

                  <Button onClick={scrollToSpecialist} variant="secondary" size="lg" className="flex items-center gap-2 hover-scale">
                    <Search className="h-5 w-5" />
                    Encontrar un Especialista
                  </Button>
                </div>
              </Card>
            </div>}
        </div>
      </div>
    </section>;
};
export default ThyroidSymptomExplorer;