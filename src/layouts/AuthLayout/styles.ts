import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')({});

export const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',

  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

export const LeftSide = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '0.5',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const Image = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const RightSide = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'auto',
  padding: `${theme.spacing(8)} 0`,
  height: '100vh',
  flex: '0.5',
  backgroundColor:
    theme.palette.mode === 'light' ? 'white' : theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    width: '100vw',
  },
}));

export const LoginContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  minWidth: '348px',
  maxWidth: '600px',
  margin: 'auto',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: `0 ${theme.spacing(4)}`,
  },
}));