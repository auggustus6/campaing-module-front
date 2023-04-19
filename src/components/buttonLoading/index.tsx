import { CSSProperties, ReactNode } from 'react';
import { LoadingButton } from '@mui/lab';
import { CircularProgress } from '@mui/material';

type ButtonLoadingProps = {
  loading?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  type?: 'button' | 'submit' | 'reset';
  size?: 'large' | 'small' | 'medium';
  children: ReactNode | string;
  fullWidth?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  loadingPosition?: 'start' | 'end' | 'center' | undefined;
  redButton?: boolean;
};

export const ButtonLoading = ({
  children,
  loading,
  type,
  variant = 'contained',
  size,
  fullWidth = false,
  style,
  onClick,
  loadingPosition,
  redButton = false,
}: ButtonLoadingProps) => {
  return (
    <LoadingButton
      style={style}
      loading={loading}
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      loadingPosition={redButton ? loadingPosition : undefined}
      loadingIndicator={
        redButton ? <CircularProgress color="inherit" size={20} /> : undefined
      }
    >
      {redButton ? (
        <strong>{loading ? 'Enviando...' : children}</strong>
      ) : (
        children
      )}
    </LoadingButton>
  );
};
