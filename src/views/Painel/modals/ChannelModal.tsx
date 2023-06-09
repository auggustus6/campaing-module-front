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
import { useEffect } from 'react';
import { Close, ContentCopy, CopyAll, Refresh } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';
import ReactInputMask from 'react-input-mask';
import { copyToClipboard } from '../../../utils/copyToClipboard';

const phoneRegex = new RegExp(/(55 [1-9]{2} 9 [1-9]{4}-[1-9]{4})/g);

export type ChannelSchemaSchemaType = z.infer<typeof channelSchema>;
const channelSchema = z.object({
  id: z.string().optional(),
  channelNick: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome pode ter no máximo 50 caracteres'),
  phoneNumber: z.string({ required_error: 'Campo obrigatório!' }).trim(),
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
  tokenAccess: z
    .string({
      required_error: 'Campo obrigatório!',
      invalid_type_error: 'Campo obrigatório!',
    })
    .min(3, 'Campo deve ter no mínimo 3 caracteres')
    .max(1000, 'Campo pode ter no máximo 1000 caracteres'),
  webHookToken: z
    .string({
      required_error: 'Campo obrigatório!',
      invalid_type_error: 'Campo obrigatório!',
    })
    .uuid(),
});

export default function ChannelModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ChannelSchemaSchemaType>({
    resolver: zodResolver(channelSchema),
  });
  const toast = useToast();

  function handleRefreshWebHookToken() {
    setValue('webHookToken', crypto.randomUUID());
  }

  useEffect(() => {
    const channelFromLocation: ChannelSchemaSchemaType = location.state;

    if (!channelFromLocation && location.pathname.includes('edit')) {
      return navigate('..');
    }
    if (channelFromLocation) {
      return reset(channelFromLocation);
    }

    handleRefreshWebHookToken();
  }, []);

  const handleSubmitChannel = async (values: ChannelSchemaSchemaType) => {
    const { id, ...payload } = values;
    try {
      if (values.id) {
        await api.patch(`/channels/${id}`, payload);
        toast.success('Canal editado com sucesso!');
      } else {
        await api.post('/channels', payload);
        toast.success('Canal criado com sucesso!');
      }
      navigate('..');
    } catch (error) {
      if (id) {
        toast.error('Erro ao editar canal!');
        return;
      }
      toast.error('Erro ao criar canal!');
    }
  };

  function handleCopyToClipboard() {
    copyToClipboard(getValues('webHookToken'));
    toast.success('Token copiado com sucesso!');
  }

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
          width: '96%',
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
            {location.state ? 'Editar' : 'Criar novo'} canal
          </Typography>
          <Close onClick={handleOnClose} sx={{ cursor: 'pointer' }} />
        </Box>
        <Grid container spacing={2} pt={4}>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.channelNick}>
              Apelido do canal
            </InputLabel>
            <TextField
              placeholder="Ex: Nome do seu canal personalizado"
              {...register('channelNick')}
              error={!!errors.channelNick}
              helperText={errors.channelNick?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.channelNick}>
              Número de telefone WhatsApp
            </InputLabel>
            <ReactInputMask
              mask={'55 99 9 9999-9999'}
              onChange={register('phoneNumber').onChange}
              onBlur={register('phoneNumber').onBlur}
            >
              <TextField
                {...register('phoneNumber')}
                placeholder="55 99 9 9999-9999"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                fullWidth
              />
            </ReactInputMask>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.phoneNumberId}>
              Id do Número de telefone (phoneNumberId)
            </InputLabel>
            <TextField
              {...register('phoneNumberId')}
              placeholder="Ex: Código identificador do número do whatsapp na Meta"
              error={!!errors.phoneNumberId}
              helperText={errors.phoneNumberId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.whatsAppBusinessId}>
              Id Conta do Aplicativo (whatsAppBusinessId)
            </InputLabel>
            <TextField
              {...register('whatsAppBusinessId')}
              placeholder="Ex: Código identificador na api do número na Meta"
              error={!!errors.whatsAppBusinessId}
              helperText={errors.whatsAppBusinessId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.whatsAppAccountBusinessId}>
              Id Conta do WhatsApp (whatsAppAccountBusinessId)
            </InputLabel>
            <TextField
              {...register('whatsAppAccountBusinessId')}
              placeholder="Ex: Código identificador do aplicativo da Meta"
              error={!!errors.whatsAppAccountBusinessId}
              helperText={errors.whatsAppAccountBusinessId?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel error={!!errors.tokenAccess}>
              Token de Acesso
            </InputLabel>
            <TextField
              placeholder="Ex: Token de acesso eterno para envio e recebimento de mensagens"
              {...register('tokenAccess')}
              error={!!errors.tokenAccess}
              helperText={errors.tokenAccess?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} position={'relative'}>
            <InputLabel error={!!errors.webHookToken}>
              Token do WebHook
            </InputLabel>
            <TextField
              placeholder="Ex: Token para confirmar identidade do webhook na api da Meta"
              {...register('webHookToken')}
              sx={{ fontFamily: 'monospace' }}
              error={!!errors.webHookToken}
              helperText={errors.webHookToken?.message}
              disabled
              contentEditable={false}
              fullWidth
            />
            <Box
              sx={{
                display: 'flex',
                position: 'absolute',
                top: '3rem',
                right: '1rem',
                whiteSpace: 'nowrap',
                gap: '0.5rem',
              }}
            >
              <Button variant="outlined" onClick={handleCopyToClipboard}>
                <ContentCopy />
              </Button>
              <Button variant="outlined" onClick={handleRefreshWebHookToken}>
                <Refresh />
              </Button>
            </Box>
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
