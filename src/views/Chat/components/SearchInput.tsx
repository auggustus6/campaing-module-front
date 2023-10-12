import { Search } from '@mui/icons-material';
import DefaultInput from '../../../components/Inputs/DefaultInput';

export  function SearchInput() {
  return (
    <DefaultInput
      sx={{ p: 0, margin: 0 }}
      variant="standard"
      placeholder="Pesquisar ou começar uma nova conversa"
      InputProps={{
        endAdornment: <Search />,
        sx: {
          py: 1,
          px: 2,
        },
      }}
    />
  );
}
