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
import { Close } from '@mui/icons-material';
import ShowWhenAdmin from '../../components/ShowWhenAdmin';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Outlet, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../../context/ToastContext';

import TableChannels from './components/TableChannels';
import DefaultInput from '../../components/Inputs/DefaultInput';
import { Channel } from '../../models/channel';
import { useUpdateCompanyMutation } from './hooks/useUpdateCompanyMutation';
import useCompany from '../../hooks/querys/useCompany';
import useChannels from '../../hooks/querys/useChannels';
import useCompanyUsers from '../../hooks/querys/useCompanyUsers';
import { getTwoFirstLetters } from '../../utils/stringUtils';

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
  owner: User;
  users: User[];
  _count: {
    users: number;
    campaign: number;
  };
}
const phoneRegex = new RegExp(/(55 [1-9]{2} 9 [1-9]{4}-[1-9]{4})/g);

const companySchema = z.object({
  name: z
    .string({
      required_error: 'Campo obrigatório!',
      invalid_type_error: 'Campo obrigatório!',
    })
    .trim()
    .min(3, 'Muito curto!')
    .max(30, 'Muito extenso!'),
});

type CompanySchemaSchemaType = z.infer<typeof companySchema>;


function Painel() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanySchemaSchemaType>({
    resolver: zodResolver(companySchema),
  });
  const toast = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const [twoLetters, setTwoLetters] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: company, isLoading: isFetchingCompany } = useCompany();
  const { data: channels, isLoading: isFetchingChannels } = useChannels();
  const { data: users, isLoading: isFetchingUsers } = useCompanyUsers();

  const { mutate: handleUpdateCompany, isLoading: isUpdatingCompany } =
    useUpdateCompanyMutation({
      onError() {
        toast.error('Erro ao editar empresa!');
      },
      onSuccess(data, values) {
        setTwoLetters(getTwoFirstLetters(values.name));
        setIsEditing(false);
        toast.success('Empresa editada com sucesso!');
      },
    });

  const isLoading =
    isUpdatingCompany || isFetchingCompany || isFetchingChannels;

  function handleCancel() {
    reset({
      name: company?.name,
    });
    setIsEditing(false);
  }

  useEffect(() => {
    if(!company) return;
    reset({
      name: company.name,
    });
    setTwoLetters(getTwoFirstLetters(company.name));
  }, [company]);

  return (
    <>
      <Container
        sx={{ paddingInline: '0px' }}
        component={'form'}
        onSubmit={handleSubmit((values) => handleUpdateCompany(values))}
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
            <TextField fullWidth disabled value={company?.owner.name} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InputLabel>Campanhas criadas</InputLabel>
            <TextField
              fullWidth
              value={(company?.createdCampaigns || 0) + ' Campanhas criadas'}
              disabled
            />
          </Grid>
        </Grid>
        <Box marginTop={8} />

        <TableChannels
          channels={channels || []}
          channelsLength={channels?.length}
          refetch={() => {}}
          isLoading={isLoading}
        />
        <Box marginTop={8} />
        <TableUsers
          users={users}
          usersLength={users?.length}
          refetch={() => {}}
          isLoading={isLoading}
        />
      </Container>
      <Outlet />
    </>
  );
}

export default Painel;
