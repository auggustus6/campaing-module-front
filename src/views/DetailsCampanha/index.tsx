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

import moment from 'moment';

export default function DetailsCampanha() {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date?: string) => moment(date).format('YYYY-MM-DDTHH:mm');

  async function getData() {
    const result = await api.get(`/campaign/${id}`);
    setData(result);
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
      console.log(error);

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
      console.log(error);

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
              <Link to={'editar'}>
                <Button>Editar</Button>
              </Link>
              <Box>
                <Button
                  color="danger"
                  loading={isLoading}
                  onClick={handleRemoveCampaign}
                >
                  Remover
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Titulo da Campanha</InputLabel>
          <Input
            variant="outlined"
            value={data?.data.title}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Status</InputLabel>
          <Input
            variant="outlined"
            value={data?.data.status}
            disabled
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>
            Data para disparo(vazio caso nao tenha data definida):
          </InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.data?.scheduleDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de inicio:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.data?.startDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de término:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={formatDate(data?.data?.endDate)}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Delay</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            value={data?.data?.sendDelay}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Mensagem:</InputLabel>
          <TextArea value={data?.data.message} disabled />
        </Grid>
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
            }}
            onClick={handleStartButton}
          >
            Iniciar
          </Button>
          <Button
            title="Pausar Campanha"
            color="neutral"
            sx={{
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
            onClick={handlePauseButton}
          >
            Pausar
          </Button>
          <Button
            title="Encerrar Campanha"
            color="danger"
            sx={{
              height: '40px',
              paddingInline: '2rem',
              fontSize: 12,
              fontWeight: 700,
            }}
            onClick={handleFinishButton}
          >
            Encerrar
          </Button>
        </Stack>
      </Grid>
      <TableContactsFromApi id={id} message={data?.data.message} />
    </Stack>
  );
}
