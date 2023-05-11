import { CircularProgress } from '@mui/joy';
import { Box, Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import CountdownWpp from '../components/Countdown';

interface QrCodeModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  qrCode: string;
}

export default function QrCodeModal({
  isModalOpen,
  onCloseModal,
  qrCode,
}: QrCodeModalProps) {
  return (
    <Modal open={isModalOpen} onClose={onCloseModal}>
      <Box
        p={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          width: '100%',
          padding: 2,
        }}
      >
        <Stack
          alignItems="center"
          p={4}
          gap={2}
          bgcolor={'white'}
          borderRadius={2}
        >
          {!qrCode ? (
            <Box
              sx={{
                maxWidth: 500,
                width: '100%',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <CircularProgress size="lg" variant="solid" />
              {/* <QrCode2Icon
              sx={{
                position: 'absolute',
                inset: 0,
                maxWidth: 500,
                width: '100%',
                aspectRatio: '1/1',
                opacity: 0.2,
                fontSize: '40rem',
              }}
            /> */}
            </Box>
          ) : (
            <img style={{ maxWidth: 500, width: '100%' }} src={qrCode} />
          )}

          {!!qrCode && <CountdownWpp onComplete={onCloseModal} />}
        </Stack>
      </Box>
    </Modal>
  );
}
