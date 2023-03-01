import { Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Home } from '../views/Home';

export default function PublicRoutes() {
  return <Route path="/" element={<MainLayout />}></Route>;
}
