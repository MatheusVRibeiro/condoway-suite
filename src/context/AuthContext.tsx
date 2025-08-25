import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'sindico' | 'porteiro' | 'morador';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserRole;
  telefone?: string;
  status?: 'ativo' | 'inativo';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          // Fetch user profile from our usuarios table
          const { data: userData, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (userData && !error) {
            setUser({
              id: userData.id,
              nome: userData.nome,
              email: userData.email,
              tipo: userData.user_tipo as UserRole,
              telefone: userData.telefone,
              status: userData.status
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // This will trigger the onAuthStateChange above
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll use our mock authentication
      // In production, this would use Supabase auth
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // In production, use proper password hashing
        .single();

      if (userData && !error) {
        setUser({
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          tipo: userData.user_tipo as UserRole,
          telefone: userData.telefone,
          status: userData.status
        });
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const value: AuthContextType = {
    user,
    session,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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