import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TableUsers from './components/TableUsers';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { AddBox, Close } from '@mui/icons-material';
import ShowWhenAdmin from '../../components/ShowWhenAdmin';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Countdown from 'react-countdown';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
}

interface Company {
  id: string;
  name: string;
  channelNick: string;
  channelNumber: string;
  // ownerId: string;
  owner: User;
  users: User[];
  _count: {
    users: number;
    Campaign: number;
  };
}

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const companySchema = z.object({
  name: z
    .string({ required_error: 'Campo obrigatório!' })
    .trim()
    .min(3, 'Muito curto!')
    .max(30, 'Muito extenso!'),
  channelNick: z
    .string({ required_error: 'Campo obrigatório!' })
    .trim()
    .min(3, 'Muito curto!')
    .max(30, 'Muito extenso!')
    .nonempty('Campo obrigatório.'),
  channelNumber: z
    .string({ required_error: 'Campo obrigatório!' })
    .trim()
    .regex(phoneRegex, 'Número inválido!'),
});

type CompanySchemaSchemaType = z.infer<typeof companySchema>;

function getTwoFirstLetters(name: string) {
  const [first, second] = name.split(' ');
  let text = '';
  if (!!first) text += first[0].toUpperCase();
  if (!!second) text += second[0].toUpperCase();
  return text;
}

function Painel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    getValues,
  } = useForm<CompanySchemaSchemaType>({
    resolver: zodResolver(companySchema),
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twoLetters, setTwoLetters] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<Company>();

  const toast = useToast();

  async function fetchData() {
    setIsLoading(true);
    const response = await api.get<Company>('/companies');
    setData(response.data);
    setTwoLetters(getTwoFirstLetters(response.data.name));
    reset({
      name: response.data.name,
      channelNick: response.data.channelNick,
      channelNumber: response.data.channelNumber,
    });

    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, location]);

  function handleCreateNewUser() {
    navigate('create-user');
  }

  async function handleSaveEdition(values: CompanySchemaSchemaType) {
    try {
      setIsLoading(true);
      setIsEditing(false);
      await api.patch('/companies', values);
      setTwoLetters(getTwoFirstLetters(values.name));
      setIsLoading(false);

      toast.success('Empresa editada com sucesso!');
    } catch (error) {
      toast.error('Erro ao editar empresa!');
    }

    if (getValues('channelNumber') !== data?.channelNumber) {
      setIsModalOpen(true);
    }
  }

  function handleCancel() {
    reset({
      name: data?.name,
      channelNick: data?.channelNick,
      channelNumber: data?.channelNumber,
    });
    setIsEditing(false);
  }

  return (
    <>
      <Container
        sx={{ paddingInline: '0px' }}
        component={'form'}
        onSubmit={handleSubmit(handleSaveEdition)}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          flexWrap={'wrap'}
        >
          <Typography variant="h4">Painel Administrativo</Typography>
          <ShowWhenAdmin>
            <Stack>
              {isEditing ? (
                <Box display={'flex'} gap={2} flexWrap={'wrap'}>
                  <Button
                    color="success"
                    variant="contained"
                    disabled={isLoading}
                    type="submit"
                  >
                    <SaveIcon />
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <Close />
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                >
                  <EditIcon sx={{ marginRight: 1 }} />
                  Editar
                </Button>
              )}
            </Stack>
          </ShowWhenAdmin>
        </Stack>
        <Box marginY={8}>
          <Stack
            alignItems="center"
            justifyContent={'center'}
            direction="row"
            gap={4}
          >
            <Avatar sx={{ width: '10rem', height: '10rem', fontSize: 80 }}>
              {twoLetters}
            </Avatar>
            {/* <Stack gap={2} height={'100%'} justifyContent={'space-around'}> */}
            {/* <Typography variant="h5">Nome da Empresa</Typography>
            <Typography variant="body1">
              {isEditing
                ? 'Clique ao lado para selecionar uma imagem do seu dispositivo.'
                : ''}
            </Typography> */}
            {/* </Stack> */}
          </Stack>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel error={!!errors.name}>Nome da empresa</InputLabel>
            <TextField
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel>Dono</InputLabel>
            <TextField fullWidth disabled value={data?.owner.name} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel>Campanhas criadas</InputLabel>
            <TextField
              fullWidth
              value={(data?._count.Campaign || 0) + ' Campanhas criadas'}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel error={!!errors.channelNick}>
              Apelido do canal
            </InputLabel>
            <TextField
              {...register('channelNick')}
              error={!!errors.channelNick}
              helperText={errors.channelNick?.message}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel error={!!errors.channelNumber}>Número</InputLabel>
            {/* TODO - ADD MASK */}
            <TextField
              {...register('channelNumber')}
              error={!!errors.channelNumber}
              helperText={errors.channelNumber?.message}
              fullWidth
              disabled={!isEditing}
            />
          </Grid>
          {/* <Grid item xs={12} sm={5} md={3}>
          <Box display={'flex'} alignItems={'flex-end'} height={'100%'}>
            <Button
              variant="contained"
              sx={{ height: '3.5rem' }}
              fullWidth
              onClick={() => setIsModalOpen(true)}
            >
              <AddIcon sx={{ marginRight: 1 }} />
              Adicionar número
            </Button>
          </Box>
        </Grid> */}
        </Grid>
        <Box marginTop={8} />
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          flexWrap={'wrap'}
        >
          <Typography variant="h5">Usuários</Typography>
          <ShowWhenAdmin>
            <Button
              variant="contained"
              onClick={handleCreateNewUser}
              disabled={isLoading}
            >
              <AddIcon sx={{ marginRight: 1 }} />
              Adicionar usuário
            </Button>
          </ShowWhenAdmin>
        </Box>
        <TableUsers
          users={data?.users}
          usersLength={data?._count.users}
          refetch={fetchData}
        />
      </Container>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          p={4}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 600,
            width: '100%',
            padding: 2,
          }}
        >
          <Stack
            alignItems="center"
            p={4}
            gap={2}
            bgcolor={'white'}
            borderRadius={2}
          >
            <img
              style={{ maxWidth: 500, width: '100%' }}
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Link_pra_pagina_principal_da_Wikipedia-PT_em_codigo_QR_b.svg"
            />
            <Countdown
              date={Date.now() + 60000}
              renderer={(props) => (
                <Box>
                  <Typography variant="h6" align="center">
                    Escaneie o código no Whatsapp para continuar
                  </Typography>
                  <Typography variant="body1" align="center">
                    Em {props.seconds || '60'} segundos o código irá expirar
                  </Typography>
                </Box>
              )}
              onComplete={() => setIsModalOpen(false)}
            />
          </Stack>
        </Box>
      </Modal>
      <Outlet />
    </>
  );
}

export default Painel;
