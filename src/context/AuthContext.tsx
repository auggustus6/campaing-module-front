// make a auth context

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { All_PATHS, PATHS } from '../utils/constants';
import { useToast } from './ToastContext';
import NotActivatedAlert from '../components/NotActivatedAlert';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  isAdmin: boolean;
  companyId: string;
  company?: {
    name: string;
    isActive: boolean;
  };
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserRegister {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

interface AuthContextProps {
  user: User | null;
  login: (user: UserLogin) => Promise<void>;
  logout: () => void;
  isLogging: boolean;
  register: (user: UserRegister) => void;
}

interface LoginResponse {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogging, setIsLogging] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const currentPath = location.pathname.split('/')[1];
  const isOnLoginOrRegister = [All_PATHS.LOGIN, All_PATHS.REGISTER]
    .map((p) => p.slice(1))
    .includes(currentPath);

  useEffect(() => {
    async function revalidate() {
      setIsLogging(true);

      try {
        const { data } = await api.post<LoginResponse>('/auth/revalidate');
        setUser(data.user);
        localStorage.setItem('@campaign:token', data.token);

        if (isOnLoginOrRegister) {
          navigate(All_PATHS.CAMPAIGNS);
        }
      } catch (error) {
        if (!isOnLoginOrRegister) {
          toast.error('Acesso negado!');
          localStorage.removeItem('@campaign:token');
          return navigate(All_PATHS.LOGIN);
        }
      } finally {
        setIsLogging(false);
      }
    }

    revalidate();
  }, []);

  const login = async (user: UserLogin) => {
    try {
      setIsLogging(true);
      const { data } = await api.post<LoginResponse>('auth/login', user);

      setUser(data.user);
      localStorage.setItem('@campaign:token', data.token);
      navigate(All_PATHS.CAMPAIGNS);
    } catch (error) {
      throw error;
    } finally {
      setIsLogging(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@campaign:token');
    navigate(All_PATHS.LOGIN);
  };

  const register = async (user: UserRegister) => {
    try {
      setIsLogging(true);
      await api.post<LoginResponse>('auth/register', user);

      toast.success('Usuário criado com sucesso');

      navigate(All_PATHS.LOGIN);
    } catch (error) {
      throw error;
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLogging, register }}>
      {children}
      {isLogging && <LoadingScreen />}
      {!isOnLoginOrRegister && !user?.company?.isActive && !isLogging && (
        <NotActivatedAlert />
      )}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };
