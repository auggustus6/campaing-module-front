import { Box, Link } from '@mui/joy';
import { Typography } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { theme } from '../../styles/theme';

export default function NotActivatedAlert() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '2rem',
        right: '1rem',
        maxWidth: '28rem',
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        zIndex: 9999,
        borderRadius: 4,
        backgroundColor: '#faf2f2',
        padding: '0.5rem 1.5rem',
        border: '1px solid ' + theme.palette.error.main,
      }}
    >
      <NotificationImportantIcon
        sx={{ fontSize: 50, color: theme.palette.error.dark }}
      />
      <Typography variant="body1" color={'GrayText'}>
        Conta não ativada, entre em contato com{' '}
        <Link href="mailto:atendimento@iniciodesign.com.br">
          atendimento@iniciodesign.com.br
        </Link>{' '}
        e solicite ativação.
      </Typography>
    </Box>
  );
}
