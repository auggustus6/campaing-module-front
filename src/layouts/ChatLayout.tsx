import React from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ChatLayout() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <Box pt={8} />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </div>
  );
}
