import { Toolbar, alpha, Typography, Button, Switch, Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { queryClient } from '../../../../../main';
import api from '../../../../../services/api';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../../../../../context/AuthContext';
import { Campaign } from '../../../../../models/campaign';
import { API_URLS } from '../../../../../utils/constants';
import Show from '../../../../../components/MetaComponents/Show';
interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedItem: string[];
  setSelectedItem: (value: []) => void;
  clearSelected: () => void;
  showDeleted: boolean;
  setShowDeleted: (option: boolean) => void;
  campaign?: Campaign[];
}

export function EnhancedTableToolbar({
  numSelected,
  selectedItem,
  setSelectedItem,
  clearSelected,
  showDeleted,
  setShowDeleted,
  campaign,
}: EnhancedTableToolbarProps) {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const canEditCampaigns = !campaign?.some(
    (campaign) => campaign.status === 'CONCLUIDO'
  );

  function handleSeeDetailsButton() {
    navigate(`${selectedItem}`);
  }

  console.log(campaign);

  async function handleStartButton() {
    setIsLoading(true);
    try {
      // TODO - move to useMutation
      await api.post(`/campaign/start`, selectedItem);
      await queryClient.invalidateQueries(API_URLS.CAMPAIGNS.BASE);
      Swal.fire('Sucesso', 'Campanha iniciada com sucesso!', 'success');
      clearSelected();
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
      // TODO - move to useMutation
      await api.post(`/campaign/finish`, selectedItem);
      await queryClient.invalidateQueries(API_URLS.CAMPAIGNS.BASE);
      Swal.fire('Sucesso', 'Campanha encerrada com sucesso!', 'success');
      clearSelected();
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao encerrar campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }

  async function handlePauseButton() {
    setIsLoading(true);
    try {
      // TODO - move to useMutation
      await api.post(`/campaign/pause`, selectedItem);
      await queryClient.invalidateQueries(API_URLS.CAMPAIGNS.BASE);
      Swal.fire('Sucesso', 'Campanha pausada com sucesso!', 'success');
      clearSelected();
    } catch (error) {
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
      // TODO - move to useMutation
      await api.post(`/campaign/delete`, selectedItem);
      await queryClient.invalidateQueries(API_URLS.CAMPAIGNS.BASE);
      Swal.fire('Sucesso', 'Campanha removida com sucesso!', 'success');
      setSelectedItem([]);
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao remover campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        justifyContent: 'space-between',
        py: { xs: 2, sm: 0 },
        gap: '1rem',
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
          variant="h6"
          id="tableTitle"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <CampaignIcon fontSize="large" />
          Campanhas
        </Typography>
      )}
      <Show
        when={numSelected > 0}
        fallback={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Typography>Mostrar campanhas removidas</Typography>
            <Switch
              value={showDeleted}
              // defaultValue={showDeleted}
              defaultChecked={showDeleted}
              onChange={() => setShowDeleted(!showDeleted)}
            />
          </Box>
        }
      >
        <>
          <Show when={numSelected < 2}>
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
              <PreviewIcon />
              Ver
            </Button>
          </Show>
          <Show when={user?.isAdmin && !campaign?.[0]?.isDeleted}>
            <Show
              when={
                campaign?.some(
                  (c) => c.status !== 'INICIAR' && c.status !== 'EM_PROGRESSO'
                ) && canEditCampaigns
              }
            >
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
                <PlayCircleOutlineIcon />
                Iniciar
              </Button>
            </Show>

            <Show
              when={
                campaign?.some(
                  (c) =>
                    c.status !== 'PAUSADO' && c.status !== 'PAUSE_AUTOMATIC'
                ) && canEditCampaigns
              }
            >
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
                <PauseCircleOutlineIcon />
                Pausar
              </Button>
            </Show>

            <Show
              when={campaign?.[0]?.status !== 'CONCLUIDO' && canEditCampaigns}
            >
              <Button
                title="Encerrar Campanha"
                variant="contained"
                sx={{
                  mr: '1rem',
                  height: '40px',
                  paddingInline: '2rem',
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#232323',
                  '&:hover': {
                    background: '#595959',
                  },
                }}
                disabled={isLoading}
                onClick={handleFinishButton}
              >
                <CheckCircleOutlineIcon />
                Encerrar
              </Button>
            </Show>

            <Show when={!campaign?.[0]?.isDeleted}>
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
                <DeleteOutlineIcon />
                Remover
              </Button>
            </Show>
          </Show>
        </>
      </Show>
    </Toolbar>
  );
}
