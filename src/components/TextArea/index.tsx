import React from 'react';
import { FieldError } from 'react-hook-form';
import * as Styles from './styles';
import Show from '../MetaComponents/Show';
import { InputLabel } from '@mui/material';
import ErrorLabel from '../Labels/ErrorLabel';

interface TextArea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMessage?: string;
  disabled?: boolean;
  label?: string;
  style?: React.CSSProperties;
  // [key: string]: any;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextArea>(
  ({ errorMessage, disabled, label, ...rest }: TextArea, ref) => {
    return (
      <div>
        <Show when={!!label}>
          <InputLabel error={!!errorMessage}>{label}</InputLabel>
        </Show>
        <Styles.TextAreaStyle
          ref={ref}
          error={!!errorMessage}
          disabled={disabled}
          {...rest}
        />
        <ErrorLabel>{errorMessage}</ErrorLabel>
        {/* {error && <Styles.ErrorLabel>{error.message}</Styles.ErrorLabel>} */}
      </div>
    );
  }
);

export { TextArea };
