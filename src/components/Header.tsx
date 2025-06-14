
import { useState } from 'react';
import { Menu, X, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (href: string) => {
    if (window.location.pathname !== '/') {
      navigate(`/${href}`);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const navInfo = [
    { name: '¿Qué es?', href: '#que-es' },
    { name: 'Autotest', href: '#autotest' },
    { name: 'Trastornos', href: '#trastornos' },
    { name: 'Medicamentos', href: '#medicamentos' },
  ];

  const navUser = [
    { name: 'Mis Meds', href: '#mis-medicamentos' },
    { name: 'Síntomas', href: '#sintomas' },
    { name: 'Agendar', href: '#agendar' },
  ];
  
  const navGeneral = [
    { name: 'Inicio', href: '/' },
    { name: 'Consultar', href: '#consultar' },
    { name: 'FAQ', href: '#mitos-faq' },
    { name: 'Consejos', href: '#consejos' },
  ];

  const handleNavigate = (href: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href);
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigate('/')}>
            <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Al-tiroides</h1>
              <p className="text-xs text-gray-600">Información al tiro</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navGeneral.map((item) => (
              <Button key={item.name} variant="ghost" onClick={() => handleNavigate(item.href)}>{item.name}</Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Información <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navInfo.map((item) => (
                  <DropdownMenuItem key={item.name} onSelect={() => handleNavigate(item.href)}>
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Mi Salud <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {navUser.map((item) => (
                    <DropdownMenuItem key={item.name} onSelect={() => handleNavigate(item.href)}>
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {user ? (
                <Button onClick={signOut} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 ml-2">
                    Cerrar sesión
                </Button>
            ) : (
                <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 ml-2">
                    Iniciar sesión
                </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1 pt-4">
              {[...navGeneral, ...navInfo, ...(user ? navUser : [])].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium rounded-md hover:bg-gray-100"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t">
                {user ? (
                  <Button onClick={signOut} className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                      Cerrar sesión
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                      Iniciar sesión
                  </Button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
