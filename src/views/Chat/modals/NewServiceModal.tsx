import { Modal, ModalClose } from '@mui/joy';
import { Box, Button, Divider, Typography } from '@mui/material';
import DefaultInput from '../../../components/Inputs/DefaultInput';
import { Call } from '@mui/icons-material';
import InputMask from 'react-input-mask';
import DefaultButton from '../../../components/DefaultButton';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewServiceModal() {
  return (
    <Modal
      open
      onClose={() => {}}
      sx={{
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Box
        sx={{
          width: '24rem',
          bgcolor: 'white',
          p: 2,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <ModalClose />
        <Typography
          variant={'h6'}
          display={'flex'}
          alignItems={'center'}
          gap={1}
        >
          <Call /> Iniciar novo atendimento
        </Typography>
        <InputMask mask={'55 99 9 9999-9999'}>
          <DefaultInput
            placeholder="55 99 9 9999-9999"
            variant="standard"
            InputProps={{
              sx: {
                py: 1,
                px: 1,
              },
            }}
          />
        </InputMask>
        {/* <DefaultInput  /> */}
        <Button fullWidth variant="outlined">
          Iniciar
        </Button>
      </Box>
    </Modal>
  );
}
