import { Navigate, useNavigate } from 'react-router-dom';
import { type ReactNode, useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      navigate('/admin/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
