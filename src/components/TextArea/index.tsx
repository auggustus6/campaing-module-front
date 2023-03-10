import React, { RefObject } from 'react';
import { FieldError } from 'react-hook-form';
import * as Styles from './styles';

interface TextArea {
  error?: FieldError;
  disabled?: boolean;
  [key: string]: any;
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextArea>(
  ({ error, disabled, ...rest }: TextArea, ref) => {
    return (
      <>
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
