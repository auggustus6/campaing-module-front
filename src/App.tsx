import { Route, BrowserRouter, Routes, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Campanhas from './views/Campanhas';
import CreateCampanha from './views/CreateCampanha';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* <Route index element={<h2>Otro Teste</h2>} /> */}
          <Route path="campanhas" element={<Campanhas />} />
          <Route path="criar-campanha" element={<CreateCampanha />} />
          <Route path="*" element={<h2>Error 404</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
