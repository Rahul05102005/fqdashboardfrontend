import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: LoginCredentials & { name: string; role?: UserRole }) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (!data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as UserRole,
    department: data.department || undefined,
    avatar: data.avatar || undefined,
    createdAt: data.created_at,
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setAuthState({
          user: profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setAuthState({
          user: profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
    // Auth state change listener will handle the rest
    return true;
  }, []);

  const signup = useCallback(async (credentials: LoginCredentials & { name: string; role?: UserRole }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
          role: credentials.role || 'student',
        },
      },
    });
    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
