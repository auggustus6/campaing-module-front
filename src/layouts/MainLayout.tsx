import Box  from '@mui/system/Box';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Box pt={8} />
      <Box p={4}>
        <Outlet />
      </Box>
      <Footer />
    </div>
  );
}
