
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/contexts/RoleContext';
import { Shield, Stethoscope, User } from 'lucide-react';

const RoleIndicator = () => {
  const { userRole, loading } = useRole();

  if (loading || !userRole) return null;

  const getRoleInfo = () => {
    switch (userRole) {
      case 'admin':
        return {
          label: 'Administrador',
          icon: Shield,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'health_professional':
        return {
          label: 'Profesional',
          icon: Stethoscope,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'visitor':
        return {
          label: 'Usuario General',
          icon: User,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return null;
    }
  };

  const roleInfo = getRoleInfo();
  if (!roleInfo) return null;

  const Icon = roleInfo.icon;

  return (
    <Badge variant="outline" className={roleInfo.className}>
      <Icon className="h-3 w-3 mr-1" />
      {roleInfo.label}
    </Badge>
  );
};

export default RoleIndicator;
