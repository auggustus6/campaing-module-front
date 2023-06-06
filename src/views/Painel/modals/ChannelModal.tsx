import {
  Box,
  Button,
  Grid,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';

const phoneRegex = new RegExp(/(55 [1-9]{2} 9 [1-9]{4}-[1-9]{4})/g);

export type ChannelSchemaSchemaType = z.infer<typeof channelSchema>;
const channelSchema = z.object({
  id: z.string().optional(),
  channelNick: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome pode ter no máximo 50 caracteres'),
  phoneNumber: z
    .string({ required_error: 'Campo obrigatório!' })
    .trim()
    .regex(phoneRegex, 'Número inválido!'),
  phoneNumberId: z.string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  }),
  whatsAppBusinessId: z.string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  }),
  whatsAppAccountBusinessId: z.string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  }),
  tokenAccess: z.string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  }),
});

export default function ChannelModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChannelSchemaSchemaType>({
    resolver: zodResolver(channelSchema),
  });
  const toast = useToast();

  console.log(errors);

  useEffect(() => {
    const channelFromLocation = location.state;

    if (!channelFromLocation && location.pathname.includes('edit')) {
      navigate('..');
    }
    if (channelFromLocation) {
      reset({
        id: channelFromLocation.id,
        channelNick: channelFromLocation.channelNick,
        phoneNumber: channelFromLocation.phoneNumber,
        phoneNumberId: channelFromLocation.phoneNumberId,
        whatsAppAccountBusinessId:
          channelFromLocation.whatsAppAccountBusinessId,
        whatsAppBusinessId: channelFromLocation.whatsAppBusinessId,
      });
    }
  }, []);

  const handleSubmitChannel = async (values: ChannelSchemaSchemaType) => {
    try {
      const payload = {
        channelNick: values.channelNick,
        phoneNumber: values.phoneNumber,
        phoneNumberId: values.phoneNumberId,
        whatsAppAccountBusinessId: values.whatsAppAccountBusinessId,
        whatsAppBusinessId: values.whatsAppBusinessId,
        tokenAccess: values.tokenAccess,
      };
      if (values.id) {
        // await api.patch('/auth/update-channel', { ...payload, id: values.id });
        toast.success('Canal editado com sucesso!');
      } else {
        console.log('payload: ', payload);

        await api.post('/channels', payload);
        toast.success('Canal criado com sucesso!');
      }
      navigate('..');
    } catch (error) {
      if (values.id) {
        toast.error('Erro ao editar canal!');
        return;
      }
      toast.error('Erro ao criar canal!');
    }
  };

  function handleOnClose() {
    navigate('..');
  }

  return (
    <Modal open={true} onClose={handleOnClose}>
      <Box
        component={'form'}
        onSubmit={handleSubmit(handleSubmitChannel)}
        p={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '50rem',
          borderRadius: 1,
          width: '100%',
          padding: 4,
          bgcolor: 'white',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant="h5">
            {location.state ? 'Editando' : 'Criando novo'} canal
          </Typography>
          <Close onClick={handleOnClose} sx={{ cursor: 'pointer' }} />
        </Box>
        <Grid container spacing={2} pt={4}>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.channelNick}>
              Apelido do canal
            </InputLabel>
            <TextField
              {...register('channelNick')}
              error={!!errors.channelNick}
              helperText={errors.channelNick?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.phoneNumber}>
              Número de telefone WhatsApp
            </InputLabel>
            <TextField
              {...register('phoneNumber')}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              fullWidth
            />
          </Grid>

          {/* TODO - ADD MASK */}
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.phoneNumberId}>
              phoneNumberId
            </InputLabel>
            <TextField
              {...register('phoneNumberId')}
              error={!!errors.phoneNumberId}
              helperText={errors.phoneNumberId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.whatsAppBusinessId}>
              whatsAppBusinessId
            </InputLabel>
            <TextField
              {...register('whatsAppBusinessId')}
              error={!!errors.whatsAppBusinessId}
              helperText={errors.whatsAppBusinessId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.whatsAppAccountBusinessId}>
              whatsAppAccountBusinessId
            </InputLabel>
            <TextField
              {...register('whatsAppAccountBusinessId')}
              error={!!errors.whatsAppAccountBusinessId}
              helperText={errors.whatsAppAccountBusinessId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel error={!!errors.tokenAccess}>tokenAccess</InputLabel>
            <TextField
              {...register('tokenAccess')}
              error={!!errors.tokenAccess}
              helperText={errors.tokenAccess?.message}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} mt={4}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: '3.5rem' }}
              type="submit"
            >
              Salvar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
