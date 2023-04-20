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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="campanhas" element={<Campanhas />} />
            <Route path="campanhas/criar" element={<CreateCampanha />} />
            <Route path="campanhas/:id" element={<DetailsCampanha />} />
            <Route path="campanhas/:id/editar" element={<EditCampanha />} />
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
