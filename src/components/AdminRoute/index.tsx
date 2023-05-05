import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  e: React.ReactNode;
}

export default function AdminRoute({ e }: AdminRouteProps) {
  const { user, isLogging } = useAuth();

  if (user?.isAdmin || isLogging) {
    return <>{e}</>;
  } else {
    return <Navigate to="/campanhas" replace />;
  }
}
