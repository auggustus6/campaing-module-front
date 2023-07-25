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
  Divider,
} from '@mui/material';
import Button from '@mui/joy/Button';
import axios from 'axios';
import TableContactsFromApi from '../../components/TableContacts/TableContactsFromApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm } from 'react-hook-form';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';
import api from '../../services/api';
import moment from 'moment';

import SaveIcon from '@mui/icons-material/Save';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { CANAL } from '../../utils/constants';
import { theme } from '../../styles/theme';
import PreviewWppMessage from '../../components/PreviewWppMessage';
import { useToast } from '../../context/ToastContext';
import {
  formatDate,
  formatDateTime,
  getMinutesFromTime,
  getNowOnlyDate,
} from '../../utils/dateAndTimeUtils';

interface Campaign {
  id: string;
  companyId: string;
  endDate: string;
  isDeleted: boolean;
  message: string;
  scheduleDate: string;
  sentContactsCount: number;
  session: string;
  startDate: string;
  title: string;
  image: {
    data: any;
  };
}

interface Company {
  id: string;
  name: string;
  channel: {
    id: string;
    instanceName: string;
  }[];
}

const editCampaignSchema = z
  .object({
    id: z.string(),
    title: z
      .string()
      .min(6, 'Muito curto!')
      .max(70, 'Muito extenso!')
      .nonempty('Campo obrigatório.'),
    message: z.string().min(6, 'Muito curto!'),
    scheduleDate: z
      .string()
      .transform((date) => (date ? new Date(date) : ''))
      .refine(
        (date) => {
          if (!date) return false;

          return date >= getNowOnlyDate();
        },
        { message: 'Escolha uma data no futuro!' }
      )
      .optional(),
    startTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
    endTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
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
    channel_id: z.string().nonempty('Selecione uma opção!'),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: 'O horário de início deve ser menor que o horário de término.',
    path: ['startTime'],
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
  const channel_id = watch('channel_id');
  const message = watch('message');

  const toast = useToast();

  const [data, setData] = useState<any>();

  const [statusState, setStatusState] = useState('');
  useEffect(() => {
    setStatusState(status);
  }, [status]);

  const [company, setCompany] = useState<Company>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  let midiaSrc = data?.midia;
  if (data?.midiaUrl) midiaSrc = data?.midiaUrl;

  const midiaType = (data?.midiaType?.toLowerCase() as string)?.replace(
    '_url',
    ''
  );

  async function handleSave(values: EditCampaignSchemaType) {
    setIsLoading(true);

    try {
      await api.patch(`/campaign/${id}`, {
        title: values.title,
        message: values.message,
        scheduleDate: values.scheduleDate || undefined,
        startTime: values.startTime,
        endTime: values.endTime,
        status: values.status,
        sendDelay: values.sendDelay,
        channel_id: values.channel_id,
      });
      Swal.fire('Sucesso', 'Alterações feitas com sucesso!', 'success');
      navigate('campanhas');
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
    setValue('channel_id', e.target.value);
  }

  function formatTime(time: number) {
    return String(Math.floor(time / 60) + ':' + ('0' + (time % 60)).slice(-2));
  }

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await api.get(`/campaign/${id}`);

        if (!data) {
          navigate('/campanhas');
        }

        reset({
          id: data.id,
          title: data.title,
          message: data.message,
          scheduleDate: formatDate(data.scheduleDate) as any,
          startTime: formatTime(data.startTime) as any,
          endTime: formatTime(data.endTime) as any,
          status: data.status,
          startDate: formatDateTime(data.startDate) as any,
          endDate: formatDateTime(data.endDate) as any,
          sendDelay: String(data.sendDelay) as any,
          channel_id: data.channel_id,
        });

        const { data: companyData } = await api.get(`/companies`);

        if (companyData.channel?.length === 0) {
          toast.error(
            'Nenhum canal ativo no momento. Ative ao menos um canal para editar a campanha.'
          );
          navigate('./..');
        }

        setCompany(companyData);
        setData(data);
      } catch (error) {
        navigate('/campanhas');
      }
    }
    getData();
  }, []);

  function onSaveContact(contact: any) {}

  return (
    <Stack justifyContent="center">
      {/* <AddMoreContactModal
        addContact={(contact) => {
          setValue('contacts', [...getValues('contacts'), contact]);
        }}
        updateContactTable={(contact) => {
          setContactsObject([...contactsObject, contact] as any);
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={variables}
        contactKey={contactKey}
      /> */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
          <InputLabel error={!!errors.channel_id}>Canal</InputLabel>
          <FormControl fullWidth>
            <Select
              {...register('channel_id')}
              error={!!errors.channel_id}
              disabled={isLoading}
              value={channel_id || ''}
              onChange={handleCanalSelect}
            >
              {company?.channel.map((option) => (
                <MenuItem value={option.id} key={option.id}>
                  {option.instanceName}
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
            type="date"
            error={!!errors.scheduleDate}
            helperText={errors.scheduleDate?.message}
            fullWidth
            {...register('scheduleDate')}
          />
        </Grid>

        <Grid item xs={6} sm={6}>
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
        <Grid item xs={6} sm={3}>
          <InputLabel error={!!errors.startTime}>De</InputLabel>
          <Input
            disabled={isLoading}
            type="time"
            {...register('startTime')}
            error={!!errors.startTime}
            helperText={errors.startTime?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <InputLabel error={!!errors.endTime}>Até</InputLabel>
          <Input
            disabled={isLoading}
            type="time"
            {...register('endTime')}
            error={!!errors.endTime}
            helperText={errors.endTime?.message}
            fullWidth
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
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: theme.palette.primary.main }}>
            Preview da mensagem:
          </InputLabel>
          <PreviewWppMessage
            imgSrc={midiaType === 'image' ? midiaSrc : undefined}
            messagePreview={message}
          />
        </Grid>
      </Grid>
      {/* <TableContactsFromApi id={id} message={getValues('id')} /> */}
      {/* <TableContacts
          allowEdit
          headers={variables}
          onEdit={(index) => setSelectedContact(index)}
          onDelete={handleRemoveContact}
          contacts={contactsToShow}
          total={contactsObject.length}
          onChangePage={setContactsTablePage}
          title={
            <>
              <InputLabel
                sx={{
                  fontSize: '1.5rem',
                }}
              >
                Valores da Planilha
              </InputLabel>
              <MaterialButton
                disabled={isLoading || shouldDisable}
                sx={{ height: '3.5rem', textTransform: 'uppercase' }}
                variant={'outlined'}
                onClick={() => setIsModalOpen(true)}
              >
                <Add />
                Adicionar mais contato
              </MaterialButton>
            </>
          }
        /> */}
    </Stack>
  );
}
