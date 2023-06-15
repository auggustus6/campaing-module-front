import { ContentCopy, CopyAll } from '@mui/icons-material';
import {
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material';
import React from 'react';
import { copyToClipboard } from '../../utils/copyToClipboard';

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

    function onCopy() {

      // TODO - fix copyToClipboard
      // copyToClipboard(ref?);
    }

    if (copy)
      return (
        <Grid item xs={xs} sm={sm}>
          {label && <InputLabel error={error}>{label}</InputLabel>}
          <TextField
            error={error}
            helperText={errorMessage}
            fullWidth
            inputRef={ref}
            InputProps={{
              endAdornment: (
                <>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton onClick={onCopy}>
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
          helperText={errorMessage}
          fullWidth
          {...rest}
        />
      </Grid>
    );
  }
);

export default DefaultInput;

// function DefaultInput({
//   label,
//   xs = 12,
//   sm = 6,
//   errorMessage,
//   copy,
//   ...rest
// }: DefaultInputProps) {
//   const error = !!errorMessage;

//   function onCopy() {
//     copyToClipboard(ref.current?.value || '');
//   }

//   if (copy)
//     return (
//       <Grid item xs={xs} sm={sm}>
//         {label && <InputLabel error={error}>{label}</InputLabel>}
//         <TextField
//           error={error}
//           helperText={errorMessage}
//           fullWidth
//           inputRef={ref}
//           InputProps={{
//             endAdornment: (
//               <>
//                 <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
//                 <IconButton onClick={onCopy}>
//                   <ContentCopy />
//                 </IconButton>
//               </>
//             ),
//           }}
//           {...rest}
//         />
//       </Grid>
//     );

//   return (
//     <Grid item xs={xs} sm={sm}>
//       {label && <InputLabel error={error}>{label}</InputLabel>}
//       <TextField
//         error={error}
//         helperText={errorMessage}
//         fullWidth
//         prefix="asas"
//         {...rest}
//       />
//     </Grid>
//   );
// }
