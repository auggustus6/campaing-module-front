import { lazy,   } from 'react';
import {
  Route,
  BrowserRouter,
  Routes,
  useNavigate,
  Navigate,
} from 'react-router-dom';

const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
import MainLayout from './layouts/MainLayout';
const AdminRoute = lazy(() => import('./components/AdminRoute'));

const AuthProvider = lazy(() => import('./context/AuthContext'));

import Campanhas from './views/Campanhas';
import ChannelModal from './views/Painel/modals/ChannelModal';

const CreateCampanha = lazy(() => import('./views/CreateCampanha'));
const DetailsCampanha = lazy(() => import('./views/DetailsCampanha'));
const EditCampanha = lazy(() => import('./views/EditCampanha'));
const Login = lazy(() => import('./views/Login'));
const Register = lazy(() => import('./views/Register'));
const Painel = lazy(() => import('./views/Painel'));
const UserModal = lazy(() => import('./views/Painel/modals/UserModal'));

// TODO - type routes
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="campanhas" element={<Campanhas />} />
            <Route
              path="campanhas/criar"
              element={<AdminRoute e={<CreateCampanha />} />}
            />
            <Route path="campanhas/:id" element={<DetailsCampanha />} />
            <Route
              path="campanhas/:id/editar"
              element={<AdminRoute e={<EditCampanha />} />}
            />
            <Route path="painel" element={<AdminRoute e={<Painel />} />}>
              <Route
                path="create-user"
                element={<AdminRoute e={<UserModal />} />}
              />
              <Route
                path="edit-user"
                element={<AdminRoute e={<UserModal />} />}
              />
              {/* <Route
                path="create-channel"
                element={<AdminRoute e={<ChannelModal />} />}
              />
              <Route
                path="edit-channel"
                element={<AdminRoute e={<ChannelModal />} />}
              /> */}
              <Route
                path="details-channel/:id"
                element={<AdminRoute e={<ChannelModal />} />}
              />
            </Route>
            <Route path="/*" element={<Navigate to="/campanhas" replace />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
