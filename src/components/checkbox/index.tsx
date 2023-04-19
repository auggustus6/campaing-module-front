import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';

type CheckboxProps = {
  label: any;
  name: string;
  onChange?: any;
  white?: boolean;
};

export const Checkbox = ({ label, name, onChange, white }: CheckboxProps) => (
  <FormControlLabel
    name={name}
    label={label}
    onChange={onChange}
    control={
      <MuiCheckbox
        sx={
          white
            ? {
                color: '#FFFFFF',
                '&.Mui-checked': {
                  color: '#fafafa',
                },
              }
            : null
        }
      />
    }
  />
);
