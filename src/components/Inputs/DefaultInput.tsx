import { ContentCopy } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  InputLabel,
  TextField,
} from '@mui/material';
import React, { useImperativeHandle } from 'react';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { useToast } from '../../context/ToastContext';

type DefaultInputProps = React.ComponentProps<typeof TextField> & {
  label?: string;
  xs?: number;
  sm?: number;
  errorMessage?: string;
  copy?: boolean;
};

const DefaultInput = React.forwardRef<HTMLInputElement, DefaultInputProps>(
  ({ label, xs = 12, sm = 6, errorMessage, copy, ...rest }, ref) => {
    const error = !!errorMessage;
    const otherRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    useImperativeHandle(
      ref,
      () => {
        return otherRef.current!;
      },
      []
    );

    function handleCopy() {
      copyToClipboard(otherRef.current?.value!);
      toast.success('Copiado para a área de transferência!');
    }

    if (copy)
      return (
        <Grid item xs={xs} sm={sm}>
          {label && <InputLabel error={error}>{label}</InputLabel>}
          <TextField
            error={error}
            helperText={errorMessage}
            fullWidth
            inputRef={otherRef}
            InputProps={{
              endAdornment: (
                <>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton onClick={handleCopy}>
                    <ContentCopy />
                  </IconButton>
                </>
              ),
            }}
            {...rest}
          />
        </Grid>
      );

    return (
      <Grid item xs={xs} sm={sm}>
        {label && <InputLabel error={error}>{label}</InputLabel>}
        <TextField
          error={error}
          inputRef={otherRef}
          helperText={errorMessage}
          fullWidth
          {...rest}
        />
      </Grid>
    );
  }
);

export default DefaultInput;
