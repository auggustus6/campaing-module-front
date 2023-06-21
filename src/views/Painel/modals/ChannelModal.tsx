import {
  Box,
  Button,
  Grid,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import api from '../../../services/api';
import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';

import DefaultInput from '../../../components/Inputs/DefaultInput';
import QrCodeView from '../components/QrCodeView';

const stringValidator = z
  .string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  })
  .min(3, 'Deve ter no mínimo 3 caracteres')
  .max(100, 'Pode ter no máximo 50 caracteres');

export type ChannelSchemaSchemaType = z.infer<typeof channelSchema>;
const channelSchema = z.object({
  id: stringValidator,
  phoneNumber: stringValidator,
  instanceName: stringValidator,
  instanceId: stringValidator,
  url: stringValidator.url('URL inválida!'),
  webhook: stringValidator.url('URL inválida!'),
  key: stringValidator,
  token: stringValidator.uuid('Token inválido!'),
  login: stringValidator,
});

export default function ChannelModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
  } = useForm<ChannelSchemaSchemaType>({
    resolver: zodResolver(channelSchema),
  });

  const { id } = useParams();

  const isDisabled = true;

  useEffect(() => {
    const channelFromLocation: ChannelSchemaSchemaType = location.state;

    if (!channelFromLocation || !id) {
      navigate('..');
    }

    reset(channelFromLocation);
  }, []);

  function handleOnClose() {
    navigate('..');
  }

  return (
    <Modal open={true} onClose={handleOnClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '80rem',
          borderRadius: 1,
          width: '96%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            padding: 4,
            bgcolor: 'white',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <QrCodeView channelId={id!} />
          <Box sx={{ width: '100%', flex: 1.5, maxWidth: '46rem' }}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography variant="h5">
                {/* {location.state ? 'Editar' : 'Criar novo'} canal */}
                Canal
              </Typography>
              <Close onClick={handleOnClose} sx={{ cursor: 'pointer' }} />
            </Box>
            <Grid container spacing={2} pt={4}>
              <DefaultInput
                label={'URL API da instância'}
                errorMessage={errors.url?.message}
                {...register('url')}
                sm={12}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                label={'Webhook url da instância'}
                errorMessage={errors.webhook?.message}
                {...register('webhook')}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                errorMessage={errors.instanceName?.message}
                label={'Apelido para o canal'}
                {...register('instanceName')}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                errorMessage={errors.key?.message}
                label={'KEY da instância'}
                {...register('key')}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                label={'Token da instância'}
                errorMessage={errors.token?.message}
                {...register('token')}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                label={'Login da instância'}
                errorMessage={errors.login?.message}
                {...register('login')}
                copy
                disabled={isDisabled}
              />
              <DefaultInput
                label={'Número do canal'}
                errorMessage={errors.phoneNumber?.message}
                {...register('phoneNumber')}
                copy
                disabled={isDisabled}
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
