
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { getStoredUser, storeUser, clearStoredUser } from '@/lib/localStorageHelper';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, role: UserRole) => {
    // Simulate login - in a real app, this would involve an API call
    const mockUser: User = { id: Date.now().toString(), username, role };
    storeUser(mockUser);
    setUser(mockUser);
    if (role === 'hew') {
      router.push('/hew');
    } else if (role === 'officer') {
      router.push('/officer');
    }
  }, [router]);

  const logout = useCallback(() => {
    clearStoredUser();
    setUser(null);
    router.push('/');
  }, [router]);

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
