import {
  Grid,
  InputLabel,
  Stack,
  Typography,
  TextField as Input,
  Box,
} from '@mui/material';
import Button from '@mui/joy/Button';
import axios from 'axios';
import TableContacts from '../../components/TableContacts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';
import api from '../../services/api';

export default function DetailsCampanha() {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date?: string) => date?.slice(0, 16);

  useEffect(() => {
    async function getData() {
      const result = await api.get(`campaign/${id}`);
      setData(result);
    }
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
      await api.delete(`campaign/${id}`);
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
        <Grid item xs={12}>
          <InputLabel>Mensagem:</InputLabel>

          <TextArea value={data?.data.message} disabled />
        </Grid>
      </Grid>
      <TableContacts id={id} message={data?.data.message} />
    </Stack>
  );
}
