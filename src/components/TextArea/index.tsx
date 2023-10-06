import React from 'react';
import { FieldError } from 'react-hook-form';
import * as Styles from './styles';
import Show from '../MetaComponents/Show';
import { InputLabel } from '@mui/material';

interface TextArea {
  error?: FieldError;
  disabled?: boolean;
  label?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextArea>(
  ({ error, disabled, label, ...rest }: TextArea, ref) => {
    return (
      <>
        <Show when={!!label}>
          <InputLabel error={!!error}>{label}</InputLabel>
        </Show>
        <Styles.TextAreaStyle
          ref={ref}
          error={!!error}
          disabled={disabled}
          {...rest}
        ></Styles.TextAreaStyle>
        {error && <Styles.ErrorLabel>{error.message}</Styles.ErrorLabel>}
      </>
    );
  }
);

export { TextArea };
