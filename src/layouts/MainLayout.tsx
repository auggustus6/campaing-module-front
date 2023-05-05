import Box from '@mui/system/Box';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header />
      <Box pt={8} />
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
      <Footer />
    </div>
  );
}
