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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, set, useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';
import CircleIcon from '@mui/icons-material/Circle';
import { CircularProgress } from '@mui/joy';
import QrCode2Icon from '@mui/icons-material/QrCode2';

import InputMask from 'react-input-mask';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CountdownWpp from './components/Countdown';
import QrCodeModal from './modals/QrCodeModal';
import TableChannels, { Channel } from './components/TableChannels';
import { ChannelSchemaSchemaType } from './modals/ChannelModal';

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
// regex valid 55 11 9 9999-9999
const phoneRegex = new RegExp(/(55 [1-9]{2} 9 [1-9]{4}-[1-9]{4})/g);

// const phoneRegex = new RegExp(
//   /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
// );

const companySchema = z.object({
  name: z
    .string({
      required_error: 'Campo obrigatório!',
      invalid_type_error: 'Campo obrigatório!',
    })
    .trim()
    .min(3, 'Muito curto!')
    .max(30, 'Muito extenso!'),
  channelNick: z
    .string({
      required_error: 'Campo obrigatório!',
      invalid_type_error: 'Campo obrigatório!',
    })
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
  const { user, isLogging } = useAuth();
  const location = useLocation();
  const [twoLetters, setTwoLetters] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<Company>();
  const [channels, setChannels] = useState<Channel[]>();

  const [qrCode, setQrCode] = useState('');

  const toast = useToast();

  async function fetchData() {
    setIsLoading(true);
    const response = await api.get<Company>('/companies');
    const responseChannels = await api.get<Channel[]>('/channels');
    console.log(responseChannels.data);

    setData(response.data);
    setChannels(responseChannels.data);
    setTwoLetters(getTwoFirstLetters(response.data.name));
    reset({
      name: response.data.name,
      channelNick: response.data.channelNick,
      channelNumber: response.data.channelNumber,
    });

    setIsLoading(false);
  }

  // async function getQRCode() {
  //   try {
  //     const response = await api.post('/companies/get_qr_code');
  //     setQrCode(response.data);
  //   } catch (error) {
  //     toast.error(
  //       'Erro ao gerar QR Code, por favor tente novamente mais tarde.'
  //     );
  //     onCloseModal();
  //   }
  // }

  // async function getNumberStatus() {
  //   if (!user?.company?.isActive) {
  //     return;
  //   }
  //   const response = await api.get('/companies/status_number');

  //   if (response.data === 'CONNECTED') {
  //     setIsNumberActive(true);
  //     setIsModalOpen(false);
  //   }
  // }

  // useEffect(() => {
  //   if (!user) return;
  //   fetchData();
  //   getNumberStatus();
  // }, [user, location]);

  // useEffect(() => {
  //   let timer: any;

  //   if (isModalOpen && !isNumberActive && !timer && !!qrCode) {
  //     timer = setInterval(() => {
  //       getNumberStatus();
  //     }, 2000);
  //   } else {
  //     if (timer) {
  //       clearInterval(timer);
  //     }
  //   }

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [isModalOpen, isNumberActive, qrCode]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, location]);

  // function onCloseModal() {
  //   setIsModalOpen(false);
  //   setQrCode('');
  // }

  // function handleOpenModal() {
  //   setIsModalOpen(true);
  //   getQRCode();
  // }

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
      return;
    }

    // if (getValues('channelNumber') !== data?.channelNumber) {
    //   setIsModalOpen(() => true);
    //   // getQRCode();
    // }
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
                    variant="outlined"
                    disabled={isLoading}
                    type="submit"
                  >
                    <SaveIcon sx={{ marginRight: 1 }} />
                    Salvar
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <Close sx={{ marginRight: 1 }} />
                    Cancelar
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  // sx={{borderRadius: '10px'}}
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
          {/* <Grid item xs={12} sm={6} md={4}>
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
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <InputLabel error={!!errors.channelNumber}>Número</InputLabel>
            <Box sx={{ position: 'relative' }}>
              <InputMask
                mask={'55 99 9 9999-9999'}
                onChange={register('channelNumber').onChange}
                onBlur={register('channelNumber').onBlur}
                disabled={!isEditing}
              >
                <TextField
                  {...register('channelNumber')}
                  placeholder="55 99 9 9999-9999"
                  error={!!errors.channelNumber}
                  helperText={errors.channelNumber?.message}
                  fullWidth
                />
              </InputMask>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  position: 'absolute',
                  top: '0.8rem',
                  right: '1rem',
                }}
              >
                {user && (
                  <Chip
                    label={isNumberActive ? 'Ativo' : 'Inativo'}
                    color={isNumberActive ? 'success' : 'error'}
                    variant="outlined"
                    icon={<CircleIcon sx={{ fontSize: '1.4rem' }} />}
                  />
                )}
                <ShowWhenAdmin>
                  {!isNumberActive && data?.channelNumber && (
                    <Button
                      variant="outlined"
                      onClick={handleOpenModal}
                      sx={{
                        borderRadius: 15,
                        padding: 0.5,
                        margin: 0,
                        minWidth: 'unset',
                      }}
                    >
                      <RestartAltIcon />
                    </Button>
                  )}
                </ShowWhenAdmin>
              </Box>
            </Box>
          </Grid> */}
        </Grid>
        <Box marginTop={8} />

        <TableChannels
          channels={channels || []}
          channelsLength={data?._count.users}
          refetch={() => {}}
          isLoading={isLoading}
        />
        <Box marginTop={8} />
        <TableUsers
          users={data?.users}
          usersLength={data?._count.users}
          refetch={fetchData}
          isLoading={isLoading}
        />
      </Container>
      {/* <QrCodeModal
        isModalOpen={isModalOpen}
        onCloseModal={onCloseModal}
        qrCode={qrCode}
      /> */}
      <Outlet />
    </>
  );
}

export default Painel;
