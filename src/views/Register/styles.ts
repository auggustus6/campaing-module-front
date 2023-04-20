import { styled } from '@mui/material/styles';



export const Forms = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

export const FormsTitle = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const SubField = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',

  margin: `0 0 ${theme.spacing(3)}`,
}));

export const NewAccountOrAlreadyHaveAnAccount = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
}));
