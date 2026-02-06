import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types';

// Mock users for demonstration (will be replaced with Supabase auth)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@university.edu',
    password: 'admin123',
    name: 'Dr. Sarah Johnson',
    role: 'admin',
    department: 'Administration',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'faculty@university.edu',
    password: 'faculty123',
    name: 'Prof. Michael Chen',
    role: 'faculty',
    department: 'Computer Science',
    createdAt: new Date().toISOString(),
  },
];

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('dashboard_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('dashboard_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const { password, ...user } = foundUser;
      localStorage.setItem('dashboard_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }

    setAuthState(prev => ({ ...prev, isLoading: false }));
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dashboard_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const hasRole = useCallback((role: UserRole): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasRole }}>
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
