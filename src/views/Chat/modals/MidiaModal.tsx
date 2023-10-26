import { Modal, ModalClose, Typography } from '@mui/joy';
import { Box } from '@mui/material';

type Props = {
  onClose: () => void;
  content?: React.ReactNode;
  text?: string;
};

export default function MidiaModal({ onClose, content, text }: Props) {
  return (
    <Modal
      tabIndex={-1}
      open
      onClose={onClose}
      sx={{
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'rgba(0,0,0,0.5)',
        paddingInline: '1rem',
        border: 'none',
        outline: 'none',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <ModalClose />
        {content}
        <Typography sx={{color: "white"}}>{text}</Typography>
      </Box>
    </Modal>
  );
}
