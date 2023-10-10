import { Container, Grid, Typography } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  title?: React.ReactNode;
  handleSubmit: () => void;
};

export const CrudDefaultContainer = ({
  children,
  title,
  handleSubmit,
}: Props) => {
  return (
    <Container sx={{ p: 0 }}>
      <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
        <Grid item xs={12}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
        {children}
      </Grid>
    </Container>
  );
};
