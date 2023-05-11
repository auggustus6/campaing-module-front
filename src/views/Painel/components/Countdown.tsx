import { Box, Typography } from '@mui/material';
import Countdown from 'react-countdown';

interface CountdownWppProps {
  onComplete: () => void;
}

export default function CountdownWpp({onComplete}:CountdownWppProps) {
  return (
    <Countdown
      date={Date.now() + 60000}
      renderer={(props) => (
        <Box>
          <Typography variant="h6" align="center">
            Escaneie o código no Whatsapp para continuar
          </Typography>
          <Typography variant="body1" align="center">
            Em {props.seconds || '60'} segundos o código irá expirar
          </Typography>
        </Box>
      )}
      onComplete={onComplete}
    />
  );
}
