import { GlobalStyles } from '@mui/styled-engine-sc';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import { globalStyles } from './styles/global';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastProvider } from './context/ToastContext';

import LoadingScreen from './components/LoadingScreen';
import NotActivatedAlert from './components/NotActivatedAlert';

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <GlobalStyles styles={globalStyles} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ToastProvider>
    </Suspense>
  </React.StrictMode>
);
