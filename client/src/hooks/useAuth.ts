import { useState, useCallback } from 'react';
import type { AuthResponse, LoginCredentials } from '@/types/user';
import { authService } from '@/services/authService';

export function useAuth() {
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    const stored = sessionStorage.getItem('user');
    return stored ? JSON.parse(stored) as AuthResponse['user'] : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      sessionStorage.setItem('token', response.accessToken);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAuthenticated = user !== null && !!sessionStorage.getItem('token');

  return { user, isAuthenticated, isLoading, error, login, logout };
}
