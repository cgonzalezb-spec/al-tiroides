
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
      // Query the user_roles table to get the user's role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        // No role found in user_roles; default to safe role and log for visibility
        console.warn('Role lookup failed in user_roles, defaulting to visitor for user:', user.id);
        setUserRole('visitor');
      } else {
        // Use the role from the database
        setUserRole(roleData.role as UserRole);
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
