import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import Button from '@mui/joy/Button';
import TableContactsFromApi from '../../components/TableContacts/TableContactsFromApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';
import api from '../../services/api';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import moment from 'moment';
import ShowWhenAdmin from '../../components/ShowWhenAdmin';
import PreviewWppMessage from '../../components/PreviewWppMessage';

export default function DetailsCampanha() {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const midiaSrc = data?.midia;
  const midiaType = data?.midiaType?.toLowerCase();

  const formatDate = (date?: string) => moment(date).format('YYYY-MM-DDTHH:mm');

  async function getData() {
    try {
      const result = await api.get(`/campaign/${id}`);

      setData(result.data);
    } catch (error) {
      navigate('/campanhas');
    }
  }

  useEffect(() => {
    getData();
  }, []);

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

    setIsLoading(true);
    try {
      await api.post(`/campaign/delete`, [id]);
      Swal.fire('Sucesso', 'Campanha removida com sucesso!', 'success');
      navigate('./..');
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao apagar campanha, por favor tente novamente.',
        'error'
      );
    }

    setIsLoading(false);
  }

  async function handleStartButton() {
    try {
      await api.post(`/campaign/start`, [id]);
      await getData();
      Swal.fire('Sucesso', 'Campanha iniciada com sucesso!', 'success');
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao iniciar campanha, por favor tente novamente.',
        'error'
      );
    }
  }

  async function handleFinishButton() {
    try {
      await api.post(`/campaign/finish`, [id]);
      await getData();
      Swal.fire('Sucesso', 'Campanha encerrada com sucesso!', 'success');
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao encerrar campanha, por favor tente novamente.',
        'error'
      );
    }
  }

  async function handlePauseButton() {
    try {
      await api.post(`/campaign/pause`, [id]);
      await getData();
      Swal.fire('Sucesso', 'Campanha pausada com sucesso!', 'success');
    } catch (error) {
      Swal.fire(
        'Erro',
        'Erro ao pausar campanha, por favor tente novamente.',
        'error'
      );
    }
  }

  return (
    <Stack justifyContent="center">
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
              <ShowWhenAdmin>
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
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Titulo da Campanha</InputLabel>
          <Input variant="outlined" value={data?.title} disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Canal</InputLabel>
          <Input
            variant="outlined"
            value={data?.channel.instanceName}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Status</InputLabel>
          <Input variant="outlined" value={data?.status} disabled fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data para disparo:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.scheduleDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de inicio:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.startDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de término:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.endDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Delay</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={data?.sendDelay}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Contatos enviados</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={data?.sentContactsCount}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Mensagem:</InputLabel>
          <TextArea value={data?.message} disabled />
        </Grid>
        <Grid item xs={12} pb={8}>
          <InputLabel>Preview da mensagem</InputLabel>
          <PreviewWppMessage
            messagePreview={data?.message}
            imgSrc={midiaType == 'image' ? midiaSrc : undefined}
          />
        </Grid>
        {!['CANCELADO', 'CONCLUIDO'].includes(data?.status) && (
          <ShowWhenAdmin>
            <Stack
              direction={'row'}
              gap={4}
              justifyContent={'flex-end'}
              width={'100%'}
              py={2}
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
      <TableContactsFromApi id={id} message={data?.message} />
    </Stack>
  );
}
