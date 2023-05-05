import {
  Route,
  BrowserRouter,
  Routes,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Campanhas from './views/Campanhas';
import CreateCampanha from './views/CreateCampanha';
import DetailsCampanha from './views/DetailsCampanha';
import EditCampanha from './views/EditCampanha';
import Login from './views/Login';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import Register from './views/Register';
import Painel from './views/Painel';
import UserModal from './views/Painel/modals/UserModal';
import AdminRoute from './components/AdminRoute';

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
