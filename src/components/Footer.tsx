
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
              <li><a href="#que-es" className="text-gray-400 hover:text-white transition-colors">¿Qué es la tiroides?</a></li>
              <li><a href="#autotest" className="text-gray-400 hover:text-white transition-colors">Autotest de síntomas</a></li>
              <li><a href="#trastornos" className="text-gray-400 hover:text-white transition-colors">Tipos de trastornos</a></li>
              <li><a href="#consultar" className="text-gray-400 hover:text-white transition-colors">Cuándo consultar</a></li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Descargar checklist</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Encontrar especialistas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Mitos y realidades</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Comunidad de apoyo</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">info@al-tiroides.cl</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+56 9 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Santiago, Chile</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
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
