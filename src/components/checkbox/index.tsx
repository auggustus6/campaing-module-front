import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { theme } from '../../styles/theme';

type CheckboxProps = {
  label: any;
  name: string;
  onChange?: any;
  white?: boolean;
  error: boolean;
  value: any;
};

export const Checkbox = ({
  label,
  name,
  onChange,
  white,
  error = false,
  value,
}: CheckboxProps) => (
  <>
    <FormControlLabel
      name={name}
      label={label}
      color={'danger'}
      sx={{
        color: error ? theme.palette.error.main : undefined,
      }}
      // onChange={onChange}
      // value={value}
      control={
        <MuiCheckbox
          onChange={onChange}
          value={value}
          sx={
            white
              ? {
                  color: '#FFFFFF',
                  '&.Mui-checked': {
                    color: '#fafafa',
                  },
                }
              : error
              ? {
                  color: theme.palette.error.main,
                  '&.Mui-checked': {
                    color: theme.palette.error.main,
                  },
                }
              : undefined
          }
        />
      }
    />
  </>
);
