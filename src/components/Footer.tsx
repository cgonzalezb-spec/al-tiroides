
import { Heart, Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Al-tiroides</h3>
                <p className="text-sm text-gray-400">Información al tiro</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Tu fuente confiable de información sobre problemas de tiroides. 
              Educación médica accesible para todos los chilenos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => scrollToSection('#que-es')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  ¿Qué es la tiroides?
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#autotest')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Autotest de síntomas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#trastornos')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Tipos de trastornos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#consultar')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Cuándo consultar
                </button>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => window.open('/checklist-tiroides.pdf', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Descargar checklist
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#consultar')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Encontrar especialistas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('#mitos-faq')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Mitos y realidades
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.open('https://discord.gg/altiroides', '_blank')} 
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Comunidad de apoyo
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">pitchfisioaltiroide@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Concepción, Chile</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.instagram.com/al_tiroide/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Al-tiroides. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de uso</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Disclaimer médico</a>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              <strong>Disclaimer:</strong> La información proporcionada en este sitio web es solo para fines educativos y no debe considerarse como consejo médico profesional. 
              Siempre consulte con un profesional de la salud calificado para el diagnóstico y tratamiento de cualquier condición médica.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
