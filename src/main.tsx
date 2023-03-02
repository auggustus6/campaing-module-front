import { GlobalStyles } from '@mui/styled-engine-sc';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { globalStyles } from './styles/global';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <GlobalStyles styles={globalStyles} />
  </React.StrictMode>
);
