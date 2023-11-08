import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import Button from '@mui/joy/Button';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import ShowWhenAdmin from '../../components/ShowWhenAdmin';
import PreviewWppMessage from '../../components/PreviewWppMessage';
import { ReplyAllSharp } from '@mui/icons-material';
import {
  formatDate,
  formatDateTime,
  getTimeFromMinutes,
} from '../../utils/dateAndTimeUtils';
import TableContacts from '../../components/TableContacts';
import { Switch } from '@mui/material';
import { API_URLS, TABLE_CONTACTS_SIZE } from '../../utils/constants';
import useGetCampaign from '../../hooks/querys/useGetCampaign';
import { useManageCampaign } from './hooks/useManageCampaign';
import { useToast } from '../../context/ToastContext';
import { queryClient } from '../../main';
import Show from '../../components/MetaComponents/Show';

export default function DetailsCampanha() {
  const { id } = useParams();
  const {
    data: campaign,
    refetch,
    isError,
    isLoading: isGettingCampaign,
  } = useGetCampaign({ id: id! });

  const [contactsWithError, setContactsWithError] = useState<unknown[]>([]);

  const navigate = useNavigate();
  const toast = useToast();

  const { mutate, isLoading: isChangingCampaign } = useManageCampaign();

  const isLoading = isGettingCampaign || isChangingCampaign;

  let midiaSrc = campaign?.midia;
  if (campaign?.midiaUrl) midiaSrc = campaign?.midiaUrl;

  const midiaType = (campaign?.midiaType?.toLowerCase() as string)?.replace(
    '_url',
    ''
  );

  const [page, setPage] = useState(0);
  const [showFinished, setShowFinished] = useState(false);

  const contactsObject = (campaign?.contacts || []).filter((item: any) => {
    if (showFinished) {
      return item.status === 'ENVIADO';
    } else {
      return item.status !== 'ENVIADO';
    }
  });

  const contactsToShow = contactsObject.slice(
    page * TABLE_CONTACTS_SIZE,
    page * TABLE_CONTACTS_SIZE + TABLE_CONTACTS_SIZE
  );

  const contactTableHeaders = Object.keys(
    JSON.parse(contactsObject?.[0]?.variables || '{}')
  ).concat(['status']);
  const contactsFormatted =
    contactsToShow?.map((item: any) => {
      return {
        ...JSON.parse(item.variables || '{}'),
        status: item.status,
      };
    }) || [];

  useEffect(() => {
    if (campaign?.status === 'CONCLUIDO') {
      const contacts = campaign?.contacts.filter(
        (c: any) => c.status === 'ERRO'
      );

      setContactsWithError(contacts || []);
    }
  }, [campaign]);

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao carregar campanha, ou campanha não existe.');
      navigate('./..');
    }
  }, [isError]);

  async function invalidateCampaignQuery() {
    queryClient.invalidateQueries([API_URLS.CAMPAIGNS.BASE]);
  }

  async function handleRemoveCampaign() {
    const option = await Swal.fire({
      title: 'Tem certeza que deseja remover essa campanha?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      icon: 'question',
    });

    if (!option.isConfirmed) {
      return;
    }

    mutate(
      { data: [id], action: 'DELETE' },
      {
        onSuccess: () => {
          toast.success('Campanha removida com sucesso!');
          navigate('./..');
        },
        onError: () => {
          toast.error('Erro ao apagar campanha, por favor tente novamente.');
        },
      }
    );

    invalidateCampaignQuery();
  }

  function handleStartButton() {
    mutate(
      { data: [id], action: 'START' },
      {
        onSuccess: () => {
          toast.success('Campanha iniciada com sucesso!');
          refetch();
        },
        onError: () => {
          toast.error('Erro ao iniciar campanha, por favor tente novamente.');
        },
      }
    );
    invalidateCampaignQuery();
  }

  function handleFinishButton() {
    mutate(
      { data: [id], action: 'FINISH' },
      {
        onSuccess: () => {
          toast.success('Campanha encerrada com sucesso!');
          refetch();
        },
        onError: () => {
          toast.error('Erro ao encerrar campanha, por favor tente novamente.');
        },
      }
    );
    invalidateCampaignQuery();
  }

  function handlePauseButton() {
    mutate(
      { data: [id], action: 'PAUSE' },
      {
        onSuccess: () => {
          toast.success('Campanha pausada com sucesso!');
          refetch();
        },
        onError: () => {
          toast.error('Erro ao pausar campanha, por favor tente novamente.');
        },
      }
    );
    invalidateCampaignQuery();
  }

  function handleNavigateResend() {
    navigate(`reenviar`, {
      state: contactsWithError,
    });
  }

  return (
    <Stack justifyContent="center">
      <Outlet />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction={'row'}
            justifyContent="space-between"
            gap={4}
            flexWrap="wrap"
          >
            <Typography variant="h4">Detalhes da campanha</Typography>
            <Stack direction={'row'} gap={2}>
              <Show when={!campaign?.isDeleted}>
                <ShowWhenAdmin>
                  {contactsWithError.length > 0 && !campaign?.isDeleted && (
                    <Button
                      sx={{ textTransform: 'uppercase' }}
                      color="neutral"
                      onClick={handleNavigateResend}
                    >
                      <ReplyAllSharp fontSize="small" />
                      Reenviar para contatos com erro
                    </Button>
                  )}
                  <Link to={'editar'}>
                    <Button sx={{ textTransform: 'uppercase' }}>
                      <EditIcon fontSize="small" />
                      Editar
                    </Button>
                  </Link>
                  <Box>
                    <Button
                      color="danger"
                      loading={isLoading}
                      onClick={handleRemoveCampaign}
                      sx={{ textTransform: 'uppercase' }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                      Remover
                    </Button>
                  </Box>
                </ShowWhenAdmin>
              </Show>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Titulo da Campanha</InputLabel>
          <Input
            variant="outlined"
            value={campaign?.title}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Canal</InputLabel>
          <Input
            variant="outlined"
            value={campaign?.channel.instanceName}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Status</InputLabel>
          <Input
            variant="outlined"
            value={campaign?.status}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data para disparo:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(campaign?.scheduleDate)}
            disabled
            type="date"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de término:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDateTime(campaign?.endDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <InputLabel>Delay</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={campaign?.sendDelay}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <InputLabel>Contatos enviados</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={campaign?.sentContactsCount}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <InputLabel>De</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={getTimeFromMinutes(campaign?.startTime || 0)}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <InputLabel>Até</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={getTimeFromMinutes(campaign?.endTime || 0)}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Mensagem:</InputLabel>
          <TextArea value={campaign?.message} disabled />
        </Grid>
        <Grid item xs={12} pb={8}>
          <InputLabel>Preview da mensagem</InputLabel>
          <PreviewWppMessage
            messagePreview={campaign?.message}
            imgSrc={midiaType == 'image' ? midiaSrc : undefined}
          />
        </Grid>
        {!['CANCELADO', 'CONCLUIDO'].includes(campaign?.status || '') &&
          !campaign?.isDeleted && (
            <ShowWhenAdmin>
              <Stack
                direction={'row'}
                gap={4}
                justifyContent={'flex-end'}
                width={'100%'}
                py={2}
              >
                <Show
                  when={
                    campaign?.status !== 'INICIAR' &&
                    campaign?.status !== 'EM_PROGRESSO'
                  }
                >
                  <Button
                    title="Iniciar Campanha"
                    color="success"
                    sx={{
                      height: '40px',
                      paddingInline: '2rem',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                    onClick={handleStartButton}
                  >
                    <PlayCircleOutlineIcon fontSize="small" />
                    Iniciar
                  </Button>
                </Show>
                <Show
                  when={
                    campaign?.status !== 'PAUSADO' &&
                    campaign?.status !== 'PAUSE_AUTOMATIC'
                  }
                >
                  <Button
                    title="Pausar Campanha"
                    sx={{
                      height: '40px',
                      paddingInline: '2rem',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: '#9c27b0',
                      '&:hover': {
                        background: '#882999',
                      },
                    }}
                    onClick={handlePauseButton}
                  >
                    <PauseCircleOutlineIcon fontSize="small" />
                    Pausar
                  </Button>
                </Show>
                <Button
                  title="Encerrar Campanha"
                  color="neutral"
                  sx={{
                    height: '40px',
                    paddingInline: '2rem',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    background: '#232323',
                  }}
                  onClick={handleFinishButton}
                >
                  <CheckCircleOutlineIcon />
                  Encerrar
                </Button>
              </Stack>
            </ShowWhenAdmin>
          )}
      </Grid>
      <TableContacts
        title={
          <>
            <InputLabel
              sx={{
                fontSize: '1.5rem',
              }}
            >
              Valores da Planilha
            </InputLabel>
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <Typography>Mostrar contatos já enviados</Typography>
              <Switch
                value={showFinished}
                onChange={() => setShowFinished(!showFinished)}
              />
            </Box>
          </>
        }
        contacts={contactsFormatted}
        headers={contactTableHeaders}
        total={contactsObject?.length || 0}
        onChangePage={setPage}
      />
    </Stack>
  );
}
