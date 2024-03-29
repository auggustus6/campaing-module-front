import {
  Grid,
  InputLabel,
  Stack,
  Typography,
  TextField as Input,
  FormControl,
  MenuItem,
  Select,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import Button from '@mui/joy/Button';
import axios from 'axios';
import TableContactsFromApi from '../../components/TableContacts/TableContactsFromApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';
import api from '../../services/api';
import moment from 'moment';

import SaveIcon from '@mui/icons-material/Save';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { CANAL } from '../../utils/constants';

const editCampaignSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(6, 'Muito curto!')
    .max(70, 'Muito extenso!')
    .nonempty('Campo obrigatório.'),
  message: z.string().min(6, 'Muito curto!').max(200, 'Muito extenso!'),
  scheduleDate: z
    .string()
    .transform((date) => (date ? new Date(date) : ''))
    .refine(
      (date) => {
        if (!date) return false;
        return new Date(date) > new Date();
      },
      { message: 'Escolha uma data no futuro!' }
    )
    .optional(),
  status: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  sendDelay: z
    .string()
    .transform((delay) => Number(delay))
    .refine(
      (delay) => {
        if (delay < 10) return false;
        return true;
      },
      { message: 'O tempo mínimo é de 10 segundos.' }
    ),
  session: z.string().nonempty('Selecione uma opção!'),
});

type EditCampaignSchemaType = z.infer<typeof editCampaignSchema>;

export default function EditCampanha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    setValue,
  } = useForm<EditCampaignSchemaType>({
    resolver: zodResolver(editCampaignSchema),
  });
  const status = watch('status');
  const session = watch('session');

  const [statusState, setStatusState] = useState('');
  useEffect(() => {
    setStatusState(status);
  }, [status]);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (date?: string) => moment(date).format('YYYY-MM-DDTHH:mm');

  async function handleSave(values: EditCampaignSchemaType) {
    setIsLoading(true);
    try {
      await api.patch(`/campaign/${id}`, {
        title: values.title,
        message: values.message,
        scheduleDate: values.scheduleDate || undefined,
        status: values.status,
        sendDelay: values.sendDelay,
        session: values.session.split(' ').pop(),
      });
      Swal.fire('Sucesso', 'Alterações feitas com sucesso!', 'success');
      navigate('./..');
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Erro',
        'Erro ao editar campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }

  function handleCancelButton() {
    navigate('./..');
  }

  function handleCanalSelect(e: SelectChangeEvent<string>) {
    setValue('session', e.target.value);
  }

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/campaign/${id}`);



        if (data) {
          reset({
            id: data.id,
            title: data.title,
            message: data.message,
            scheduleDate: formatDate(data.scheduleDate) as any,
            status: data.status,
            startDate: formatDate(data.startDate) as any,
            endDate: formatDate(data.endDate) as any,
            sendDelay: String(data.sendDelay) as any,
            session: data.session,
          });
        }
      } catch (error) {
        navigate('/campanhas');
      }
    }
    getData();
  }, []);

  return (
    <Stack justifyContent="center">
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={handleSubmit(handleSave)}
      >
        <Grid item xs={12}>
          <Stack
            direction={'row'}
            flexWrap="wrap"
            justifyContent="space-between"
            gap={4}
          >
            <Typography variant="h4">Editando campanha</Typography>
            <Stack direction={'row'} gap={2}>
              <Box>
                <Button
                  color="success"
                  type="submit"
                  sx={{ textTransform: 'uppercase' }}
                >
                  <SaveIcon fontSize="small" />
                  Salvar
                </Button>
              </Box>
              <Box>
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={handleCancelButton}
                  sx={{ textTransform: 'uppercase', borderWidth: '2px' }}
                >
                  <DoDisturbIcon fontSize="small" />
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Titulo da Campanha</InputLabel>
          <Input
            disabled={isLoading}
            {...register('title')}
            defaultValue={''}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.session}>Canal</InputLabel>
          <FormControl fullWidth>
            <Select
              {...register('session')}
              error={!!errors.session}
              disabled={isLoading}
              value={session || ''}
              onChange={handleCanalSelect}
            >
              {CANAL.map((option) => (
                <MenuItem value={option[1]} key={option[1]}>
                  {option[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Status</InputLabel>
          <FormControl fullWidth>
            <Select
              {...register('status')}
              disabled={isLoading}
              fullWidth
              value={statusState}
            >
              <MenuItem value={'CANCELADO'}>CANCELADO</MenuItem>
              <MenuItem value={'PAUSADO'}>PAUSADO</MenuItem>
              <MenuItem value={'EM_PROGRESSO'}>EM_PROGRESSO</MenuItem>
              <MenuItem value={'CONCLUIDO'}>CONCLUIDO</MenuItem>
              <MenuItem value={'INICIAR'}>INICIAR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data para disparo:</InputLabel>
          <Input
            disabled={isLoading}
            type="datetime-local"
            error={!!errors.scheduleDate}
            helperText={errors.scheduleDate?.message}
            fullWidth
            {...register('scheduleDate')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Data de inicio:</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            {...register('startDate')}
            disabled
            type="datetime-local"
          />
        </Grid>
        <Grid item xs={6}>
          <InputLabel>Delay</InputLabel>
          <Input
            variant="outlined"
            fullWidth
            {...register('sendDelay')}
            type="number"
            error={!!errors.sendDelay}
            helperText={errors.sendDelay?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel>Mensagem:</InputLabel>
          <TextArea
            {...register('message')}
            disabled={isLoading}
            error={errors.message}
          />
        </Grid>
      </Grid>
      <TableContactsFromApi id={id} message={getValues('id')} />
    </Stack>
  );
}
