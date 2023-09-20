import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Logo from '../Logo';

export default function Footer() {
  return (
    <>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: 'none',
        }}
        component="footer"
      >
        <img
          src="/layered-waves.svg"
          alt="footer"
          style={{
            position: 'absolute',
            bottom: -1,
            left: -1,
            width: '100%',
            overflow: 'hidden',
            zIndex: -1,
            userSelect: 'none',
          }}
        />
        <Container maxWidth="lg">
          <Box
            sx={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <div style={{ color: 'white' }}>
              <Logo />
            </div>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              display: 'flex',
              mb: 2,
            }}
          >
            <Typography variant="caption" color="white">
              Copyright ©2022. MSI Digital
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
