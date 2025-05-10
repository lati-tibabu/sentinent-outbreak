
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { getStoredUser, storeUser, clearStoredUser } from '@/lib/localStorageHelper';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage on initial mount for session persistence
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const apiUser = data.user as User;
      
      storeUser(apiUser); // Store in localStorage for session persistence
      setUser(apiUser);

      toast({ title: 'Login Successful', description: `Welcome, ${apiUser.username}!` });

      if (apiUser.role === 'hew') {
        router.push('/hew');
      } else if (apiUser.role === 'officer') {
        router.push('/officer');
      } else {
        router.push('/'); // Fallback
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({ variant: 'destructive', title: 'Login Failed', description: error.message || 'An unexpected error occurred.' });
      setUser(null); // Ensure user is null on failed login
      clearStoredUser(); // Clear any potentially stale user data
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const logout = useCallback(() => {
    // Future: Call '/api/auth/logout' if server-side sessions/tokens are implemented
    clearStoredUser(); // Clear from localStorage
    setUser(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/');
  }, [router, toast]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
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
