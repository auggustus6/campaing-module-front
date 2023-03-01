import { GlobalStyles } from '@mui/material';
// import { Route } from 'react-router';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PublicRoutes from './routes/PublicRoutes';
import { globalStyles } from './styles/global';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <PublicRoutes /> */}
        <Route path="/">
          <Route path="/teste" element={<h1>Teste teste</h1>} />
        </Route>
        {/* <GlobalStyles styles={globalStyles} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
