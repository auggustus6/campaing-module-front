import { CircularProgress, Container } from '@mui/joy';

export default function LoadingScreen() {
  return (
    <Container
      sx={{
        position: 'fixed',
        inset: 0,
        minWidth: '100%',
        height: '100vh',
        display: 'grid',
        placeContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <CircularProgress size="lg" variant='solid'/>
    </Container>
  );
}
