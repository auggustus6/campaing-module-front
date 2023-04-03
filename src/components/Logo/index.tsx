import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="campanhas" style={{ cursor: 'pointer' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Multiformulas
      </Typography>
    </Link>
  );
}
