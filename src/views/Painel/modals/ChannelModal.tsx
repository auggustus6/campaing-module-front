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
  instanceName: stringValidator,
  wppApiInstanceId: stringValidator,
  createdAt: z.string().optional(),
  state: z.string().optional(),
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
          maxWidth: '60rem',
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
                label={'API ID da instância'}
                errorMessage={errors.wppApiInstanceId?.message}
                {...register('wppApiInstanceId')}
                sm={12}
                copy
                disabled={isDisabled}
              />

              <DefaultInput
                errorMessage={errors.instanceName?.message}
                label={'Apelido para o canal'}
                {...register('instanceName')}
                sm={12}
                copy
                disabled={isDisabled}
              />

              <DefaultInput
                errorMessage={errors.createdAt?.message}
                label={'Canal criado em'}
                {...register('createdAt')}
                sm={12}
                // copy
                disabled={isDisabled}
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
