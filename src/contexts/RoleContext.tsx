
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type UserRole = 'visitor' | 'health_professional' | 'admin';

interface RoleContextType {
  userRole: UserRole | null;
  isAdmin: boolean;
  isHealthProfessional: boolean;
  isVisitor: boolean;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();

  const refreshRole = async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      // Si es tu email de admin, asignar admin directamente
      if (user.email === 'cgonzalezb@medicina.ucsc.cl') {
        setUserRole('admin');
        setLoading(false);
        return;
      }

      // Para otros usuarios, intentar obtener del metadata primero
      const userMetadata = user.user_metadata;
      if (userMetadata?.user_type === 'health_professional') {
        setUserRole('health_professional');
      } else {
        setUserRole('visitor');
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      setUserRole('visitor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRole();
  }, [user]);

  const value = {
    userRole,
    isAdmin: userRole === 'admin',
    isHealthProfessional: userRole === 'health_professional',
    isVisitor: userRole === 'visitor' || userRole === null,
    loading,
    refreshRole,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
