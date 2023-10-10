import { UploadFile } from '@mui/icons-material';
import { Button, Grid } from '@mui/material';
import Show from '../../MetaComponents/Show';
import ErrorLabel from '../../Labels/ErrorLabel';
import React, { useState } from 'react';

type Props = {
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  text?: string;
  accept?: string;
  // [key: string]: any;
};

export const UploadButton = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      disabled,
      onChange,
      errorMessage,
      accept = 'image/png, image/gif, image/jpeg, audio/*',
      text = 'Selecione um arquivo',
      ...rest
    }: Props,
    ref
  ) => {
    const [fileName, setFileName] = useState('');

    function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('');
      }
      onChange?.(e);
    }

    return (
      <Grid item xs={12}>
        <Button
          sx={{
            height: '3.5rem',
            maxWidth: '500px',
            overflow: 'hidden',
            textAlign: 'start',
          }}
          disabled={disabled}
          variant={!!errorMessage ? 'outlined' : 'outlined'}
          component="label"
        >
          <UploadFile />
          {fileName || text}
          <input
            type="file"
            hidden
            accept={accept}
            onChange={onUpload}
            {...rest}
            ref={ref}
          />
        </Button>
        <ErrorLabel>{errorMessage}</ErrorLabel>
      </Grid>
    );
  }
);
