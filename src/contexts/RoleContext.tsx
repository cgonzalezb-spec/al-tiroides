
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
      // Usar SQL directo para obtener el rol mientras se actualizan los tipos
      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error getting user role:', error);
        // Si es tu email de admin, asignar admin automáticamente
        if (user.email === 'cristobal804g@gmail.com') {
          setUserRole('admin');
        } else {
          setUserRole('visitor'); // fallback to visitor
        }
      } else {
        setUserRole(data?.role || 'visitor');
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      // Si es tu email de admin, asignar admin automáticamente
      if (user.email === 'cristobal804g@gmail.com') {
        setUserRole('admin');
      } else {
        setUserRole('visitor');
      }
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
