import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Logo from '../Logo';

export default function Footer() {
  return (
    <>
    <div style={{paddingTop: "10rem"}}></div>
      <Paper
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        component="footer"
        square
        variant="outlined"
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              // flexGrow: 1,
              justifyContent: 'center',
              display: 'flex',
              // my: 1,
            }}
          >
            <div>
              <Logo />
              {/* <Image priority src="/Logo.svg" width={75} height={30} alt="Logo" /> */}
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
            <Typography variant="caption" color="initial">
              Copyright ©2022. ID Design Limited
            </Typography>
          </Box>
        </Container>
      </Paper>
    </>
  );
}
