//create a toast context

import { Alert, Box, Snackbar } from '@mui/material';
import { createContext, useContext, useState } from 'react';

interface ToastContextProps {
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
}

function randomId() {
  return Math.random().toString(36).substr(2, 9);
}

const ToastContext = createContext<ToastContextProps>({} as ToastContextProps);

type ToastType = {
  type: 'success' | 'error' | 'info';
  message: string;
  id: number;
};

let id = 0;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  function error(message: string) {
    setToasts((old) => [...old, { type: 'error', message, id: ++id }]);
    setTimeout(() => setToasts((old) => old.slice(1)), 3000);
  }

  function success(message: string) {
    setToasts((old) => [...old, { type: 'success', message, id: ++id }]);
    setTimeout(() => setToasts((old) => old.slice(1)), 3000);
  }
  function info(message: string) {
    setToasts((old) => [...old, { type: 'info', message, id: ++id }]);
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
          <Alert key={toast.id} color={toast.type} severity={toast.type}>
            {toast.message}
          </Alert>
        ))}
      </Box>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
