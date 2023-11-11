import React from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ChatLayout() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowY: "hidden" }}>
      <Header />
      <Box pt={8} />
      <Box sx={{ px: { xs: 0, md: 0, lg: 4 }, py: { xs: 0, md: 2, lg: 4 } }}>
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </div>
  );
}
