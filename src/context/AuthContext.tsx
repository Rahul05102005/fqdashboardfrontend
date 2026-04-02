import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, UserRole } from '@/types';
import api from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (credentials: LoginCredentials & { name: string; role?: UserRole }) => Promise<boolean>;
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

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      setAuthState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false, user: null, isAuthenticated: false }));
      return false;
    }
  }, []);

  const signup = useCallback(async (credentials: LoginCredentials & { name: string; role?: UserRole }): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await api.post('/auth/register', {
        ...credentials,
        department: 'General' // Default for now
      });
      const { token, ...user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
