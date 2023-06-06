import { lazy, Suspense } from 'react';
import {
  Route,
  BrowserRouter,
  Routes,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import NotActivatedAlert from './components/NotActivatedAlert';

// import AuthLayout from './layouts/AuthLayout';
// import MainLayout from './layouts/MainLayout';
// import AdminRoute from './components/AdminRoute';

const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

// import { AuthProvider } from './context/AuthContext';

const AuthProvider = lazy(() => import('./context/AuthContext'));

import Campanhas from './views/Campanhas';
import ChannelModal from './views/Painel/modals/ChannelModal';
// import CreateCampanha from './views/CreateCampanha';
// import DetailsCampanha from './views/DetailsCampanha';
// import EditCampanha from './views/EditCampanha';
// import Login from './views/Login';
// import Register from './views/Register';
// import Painel from './views/Painel';
// import UserModal from './views/Painel/modals/UserModal';

// const Campanhas = lazy(() => import('./views/Campanhas'));
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
              <Route
                path="create-channel"
                element={<AdminRoute e={<ChannelModal />} />}
              />
              <Route
                path="edit-channel"
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
