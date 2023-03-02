import { Toolbar, alpha, Typography, Button, Modal, Box } from '@mui/material';
import { useState } from 'react';
import ContactsTable from './ContactsTable';
import CloseIcon from '@mui/icons-material/Close';

interface EnhancedTableToolbarProps {
  numSelected: number;
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        py: { xs: 2, sm: 0 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} Selecionados
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Campanhas
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          {numSelected < 2 && (
            <Button
              title="Ver Campanha"
              variant="contained"
              sx={{
                mr: '1rem',
                height: '40px',
                paddingInline: '2rem',
                fontSize: 12,
                fontWeight: 700,
              }}
              onClick={handleOpen}
            >
              Ver
            </Button>
          )}
          <Button
            title="Iniciar Campanha"
            variant="contained"
            color="success"
            sx={{
              mr: '1rem',
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Iniciar
          </Button>
          <Button
            title="Iniciar Campanha"
            variant="contained"
            color="error"
            sx={{
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Encerrar
          </Button>
        </>
      ) : null}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '98vw',
            // height: '100%',
            overflow: 'auto',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            py: 8,
          }}
        >
          <CloseIcon
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              fontSize: 32,
              cursor: 'pointer',
            }}
            onClick={handleClose}
          />
          <ContactsTable />
        </Box>
      </Modal>
    </Toolbar>
  );
}
