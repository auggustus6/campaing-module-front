import { Box, Modal } from "@mui/material"

export default function ShowContactsErrorsModal() {

  const handleOnClose = () => {
  }

  return (
    <Modal open={true} onClose={handleOnClose}>

    <Box
      p={4}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '50rem',
        borderRadius: 1,
        width: '96%',
        padding: 4,
        bgcolor: 'white',
      }}
    >
      
    </Box>
    </Modal>

  )
}
