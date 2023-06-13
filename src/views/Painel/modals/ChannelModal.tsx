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
import { Close } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';

import DefaultInput from '../../../components/Inputs/DefaultInput';

const stringValidator = z
  .string({
    required_error: 'Campo obrigatório!',
    invalid_type_error: 'Campo obrigatório!',
  })
  .min(3, 'Deve ter no mínimo 3 caracteres')
  .max(100, 'Pode ter no máximo 50 caracteres');

export type ChannelSchemaSchemaType = z.infer<typeof channelSchema>;
const channelSchema = z.object({
  id: z.string().optional(),
  instanceName: stringValidator,
  url: stringValidator.url('URL inválida!'),
  webhook: stringValidator.url('URL inválida!'),
  key: stringValidator,
  token: stringValidator.uuid('Token inválido!'),
  login: stringValidator,
  controlId: stringValidator,
});

export default function ChannelModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChannelSchemaSchemaType>({
    resolver: zodResolver(channelSchema),
  });
  const toast = useToast();

  useEffect(() => {
    const channelFromLocation: ChannelSchemaSchemaType = location.state;

    if (!channelFromLocation && location.pathname.includes('edit')) {
      return navigate('..');
    }
    if (channelFromLocation) {
      return reset(channelFromLocation);
    }
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
            padding: 2,
            bgcolor: 'white',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flexWrap: 'nowrap',
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Link_pra_pagina_principal_da_Wikipedia-PT_em_codigo_QR_b.svg/800px-Link_pra_pagina_principal_da_Wikipedia-PT_em_codigo_QR_b.svg.png"
              style={{
                width: '100%',
                maxHeight: '30rem',
                objectFit: 'contain',
                aspectRatio: 1,
              }}
              height={'auto'}
            />
            <Typography textAlign={'center'} variant="h5">
              Escaneie o Codigo
            </Typography>
          </Box>
          <Box sx={{ width: '100%', flex: 1.5 }}>
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
            <Grid
              container
              spacing={2}
              pt={4}
              component={'form'}
              onSubmit={handleSubmit(handleSubmitChannel)}
            >
              <DefaultInput
                label={'URL API da instância'}
                errorMessage={errors.url?.message}
                {...register('url')}
                sm={12}
                copy
              />
              <DefaultInput
                label={'Webhook url da instância'}
                errorMessage={errors.webhook?.message}
                {...register('webhook')}
                copy
              />
              <DefaultInput
                errorMessage={errors.instanceName?.message}
                label={'Apelido para o canal'}
                {...register('instanceName')}
                copy
              />
              <DefaultInput
                errorMessage={errors.key?.message}
                label={'KEY da instância'}
                {...register('key')}
                copy
              />
              <DefaultInput
                label={'Token da instância'}
                errorMessage={errors.token?.message}
                {...register('token')}
                copy
              />
              <DefaultInput
                label={'Login da instância'}
                errorMessage={errors.login?.message}
                {...register('login')}
                copy
              />
              <DefaultInput
                label={'ID de controle da instância'}
                errorMessage={errors.controlId?.message}
                {...register('controlId')}
                copy
              />

              <Grid item sm={12} sx={{ width: '100%' }}>
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
        </Box>
        {/* <Box sx={{width: "100%", flex: 1}}> */}
      </Box>
    </Modal>
  );
}
