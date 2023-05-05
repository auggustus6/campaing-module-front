import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function Logo() {
  const { user } = useAuth();
  let name = '';

  useEffect(() => {
    if (user?.company?.name) {
      name = user?.company?.name;
    }
  }, [user]);

  return (
    <Link to="campanhas" style={{ cursor: 'pointer' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {user?.company?.name}
      </Typography>
    </Link>
  );
}
