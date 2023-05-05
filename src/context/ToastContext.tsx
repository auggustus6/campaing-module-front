//create a toast context

import { Alert, Box, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

interface ToastContextProps {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps>({} as ToastContextProps);

type ToastType = {
  type: 'success' | 'error' | 'info';
  message: string;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  function error(message: string) {
    setToasts((old) => [...old, { type: 'error', message }]);
    setTimeout(() => setToasts((old) => old.slice(1)), 3000);
  }

  function success(message: string) {
    setToasts((old) => [...old, { type: 'success', message }]);
    setTimeout(() => setToasts((old) => old.slice(1)), 3000);
  }
  function info(message: string) {
    setToasts((old) => [...old, { type: 'info', message }]);
    setTimeout(() => setToasts((old) => old.slice(1)), 3000);
  }

  return (
    <ToastContext.Provider value={{ error, success, info }}>
      <Box
        position={'fixed'}
        top={'1rem'}
        right={'1rem'}
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        zIndex={9999}
      >
        {toasts.map((toast) => (
          <Alert key={toast.message} color={toast.type} severity={toast.type}>
            {toast.message}
          </Alert>
        ))}
      </Box>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
