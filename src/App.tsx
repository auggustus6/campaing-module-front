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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="campanhas" element={<Campanhas />} />
          <Route path="campanhas/criar" element={<CreateCampanha />} />
          <Route path="campanhas/:id" element={<DetailsCampanha />} />
          <Route path="campanhas/:id/editar" element={<EditCampanha />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
