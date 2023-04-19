// make a auth context

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
  companyId: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: UserLogin) => void;
  logout: () => void;
  isLogging: boolean;
}

interface LoginResponse {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user && !isRevalidating) {
      navigate('/login');
    }
  }, [location.pathname, user]);

  useEffect(() => {
    setIsRevalidating(true);
    // TODO - Refactor this
    async function revalidate() {
      try {
        const { data } = await api.post<LoginResponse>(
          '/auth/revalidate',
          {},
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem('@campaign:user') || ''
              )}`,
            },
          }
        );
        setUser(data.user);
        navigate('/campanhas');
      } catch (error) {
      } finally {
        setIsRevalidating(false);
      }
    }

    revalidate();
  }, []);

  const login = async (user: UserLogin) => {
    try {
      setIsLogging(true);
      const { data } = await api.post<LoginResponse>('auth/login', user);

      setUser(data.user);
      localStorage.setItem('@campaign:user', JSON.stringify(data.token));
      navigate('/campanhas');
    } catch (error) {
    } finally {
      setIsLogging(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@campaign:user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLogging }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
