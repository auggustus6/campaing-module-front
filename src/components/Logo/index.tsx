import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="campanhas" style={{ cursor: 'pointer' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        LOGO
      </Typography>
    </Link>
  );
}
