import { GlobalStyles } from '@mui/styled-engine-sc';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import { globalStyles } from './styles/global';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <GlobalStyles styles={globalStyles} />
    </QueryClientProvider>
  </React.StrictMode>
);
