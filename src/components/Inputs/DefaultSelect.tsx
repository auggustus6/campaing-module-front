import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import React from 'react';
import ErrorLabel from '../Labels/ErrorLabel';

type Props = {
  errorMessage?: string;
  disabled?: boolean;
  value?: string;
  label: string;
  options?: any[];
  xs?: 12 | 6 | 3;
  sm?: 12 | 6 | 3;

  // [key: string]: any;
};

export const DefaultSelect = React.forwardRef<any, Props>(
  (
    {
      disabled,
      errorMessage,
      options,
      value,
      label,
      sm = 6,
      xs = 12,
      ...rest
    }: Props,
    ref
  ) => {
    return (
      <Grid item xs={xs} sm={sm}>
        <InputLabel error={!!errorMessage}>{label}</InputLabel>
        <FormControl fullWidth>
          <Select
            error={!!errorMessage}
            disabled={disabled}
            value={value}
            defaultValue={'select'}
            {...rest}
            inputRef={ref}
          >
            <MenuItem value={'select'}>Selecione um canal</MenuItem>
            {options?.map((option) => (
              <MenuItem value={option.id} key={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ErrorLabel>{errorMessage}</ErrorLabel>
      </Grid>
    );
  }
);
