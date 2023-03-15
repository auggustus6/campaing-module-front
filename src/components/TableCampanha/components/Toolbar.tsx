import { Toolbar, alpha, Typography, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { queryClient } from '../../../main';
import api from '../../../services/api';

interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedItem: string[];
  setSelectedItem: (value: []) => void;
  page: number;
}

export function EnhancedTableToolbar({
  numSelected,
  selectedItem,
  page,
  setSelectedItem,
}: EnhancedTableToolbarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  function handleSeeDetailsButton() {
    navigate(`${selectedItem}`);
  }

  async function handleStartButton() {
    setIsLoading(true);
    try {
      await api.post(`/campaign/start`, selectedItem);
      await queryClient.invalidateQueries('campaign');
      Swal.fire('Sucesso', 'Campanha iniciada com sucesso!', 'success');
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao iniciar campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }

  async function handleFinishButton() {
    setIsLoading(true);
    try {
      await api.post(`/campaign/finish`, selectedItem);
      await queryClient.invalidateQueries('campaign');
      Swal.fire('Sucesso', 'Campanha encerrada com sucesso!', 'success');
    } catch (error) {
      console.log(error);

      Swal.fire(
        'Erro',
        'Erro ao encerrar campanha, por favor tente novamente.',
        'error'
      );
      setIsLoading(false);
    }
  }

  async function handlePauseButton() {
    setIsLoading(true);
    try {
      await api.post(`/campaign/pause`, selectedItem);
      await queryClient.invalidateQueries('campaign');
      Swal.fire('Sucesso', 'Campanha pausada com sucesso!', 'success');
    } catch (error) {
      console.log(error);

      Swal.fire(
        'Erro',
        'Erro ao pausar campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }
  async function handleRemoveButton() {
    setIsLoading(true);
    try {
      await api.post(`/campaign/delete`, selectedItem);
      await queryClient.invalidateQueries('campaign');
      setSelectedItem([]);
      Swal.fire('Sucesso', 'Campanha removida com sucesso!', 'success');
    } catch (error) {
      console.log(error);

      Swal.fire(
        'Erro',
        'Erro ao remover campanha, por favor tente novamente.',
        'error'
      );
      setIsLoading(false);
    }
  }

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
              disabled={isLoading}
              onClick={handleSeeDetailsButton}
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
            disabled={isLoading}
            onClick={handleStartButton}
          >
            Iniciar
          </Button>
          <Button
            title="Pausar Campanha"
            variant="contained"
            color="secondary"
            sx={{
              mr: '1rem',
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
            disabled={isLoading}
            onClick={handlePauseButton}
          >
            Pausar
          </Button>
          <Button
            title="Encerrar Campanha"
            variant="contained"
            color="error"
            sx={{
              mr: '1rem',
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
            disabled={isLoading}
            onClick={handleFinishButton}
          >
            Encerrar
          </Button>
          <Button
            title="Remover Campanha"
            variant="contained"
            color="error"
            sx={{
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
            disabled={isLoading}
            onClick={handleRemoveButton}
          >
            Remover
          </Button>
        </>
      ) : null}

      {/* MODAL */}
      {/* <Modal
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
      </Modal> */}
    </Toolbar>
  );
}
