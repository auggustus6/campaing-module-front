import { GlobalStyles } from '@mui/styled-engine-sc';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { globalStyles } from './styles/global';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastProvider } from './context/ToastContext';

import LoadingScreen from './components/LoadingScreen';
import App from './App';


export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Suspense fallback={<LoadingScreen />}>
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <GlobalStyles styles={globalStyles} />
        <ReactQueryDevtools />
        <App />
      </QueryClientProvider>
    </ToastProvider>
  </Suspense>
);
