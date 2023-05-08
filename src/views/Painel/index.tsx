import {
  Avatar,
  Box,
  Button,
  Chip,
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
import { Controller, set, useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';
import CircleIcon from '@mui/icons-material/Circle';

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

  const [qrCode, setQrCode] = useState('');
  const [isNumberActive, setIsNumberActive] = useState(false);

  const toast = useToast();

  async function getQRCode() {
    // const response = await api.post(
    //   'http://68.183.169.240/connect',
    //   {
    //     number: '5534984182244',
    //   },
    //   {
    //     headers: {
    //       'Acess-Control-Allow-Origin': '*',
    //     },
    //   }
    // );
    // console.log(response.data);

    setQrCode(
      'data:image/png;base64,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'
    );

    // return response.data;
  }

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

  async function getNumberStatus() {
    const response = await api.get(
      `http://68.183.169.240/connection-status?session=${data?.channelNumber}`
    );

    if (response.data.connectionStatus === 'CONNECTED') {
      setIsNumberActive(true);
    }
  }

  useEffect(() => {
    getNumberStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (isModalOpen && !isNumberActive) {
      timer = setInterval(() => {
        getNumberStatus();
      }, 5000);
    } else {
      clearInterval(timer);
    }

    console.log({ timer });
  }, [isModalOpen, isNumberActive]);

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
      getQRCode();
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
            <Box sx={{ position: 'relative' }}>
              <TextField
                {...register('channelNumber')}
                error={!!errors.channelNumber}
                helperText={errors.channelNumber?.message}
                fullWidth
                disabled={!isEditing}
              />
              <Chip
                label={isNumberActive ? 'Ativo' : 'Inativo'}
                color={isNumberActive ? 'success' : 'error'}
                variant="outlined"
                icon={<CircleIcon sx={{ fontSize: '1.4rem' }} />}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '1rem',
                  transform: 'translateY(-50%)',
                }}
              />
            </Box>
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
            <img style={{ maxWidth: 500, width: '100%' }} src={qrCode} />
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
