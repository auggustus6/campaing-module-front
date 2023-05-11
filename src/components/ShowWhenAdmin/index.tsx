import { useAuth } from '../../context/AuthContext';

interface ShowWhenAdminProps {
  children: React.ReactNode;
}

export default function ShowWhenAdmin({ children }: ShowWhenAdminProps) {
  const { user } = useAuth();

  return <>{user?.isAdmin && user?.company?.isActive ? children : null}</>;
}
