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
import { Close, Info } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';

type UserSchemaSchemaType = z.infer<typeof userSchema>;
const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome pode ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string(),
  confirm: z.string(),
  isAdmin: z.boolean().default(false),
});

export default function UserModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
    setValue,
  } = useForm<UserSchemaSchemaType>({
    resolver: zodResolver(userSchema),
  });
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const userFromLocation = location.state;

    if (!userFromLocation && location.pathname.includes('edit')) {
      navigate('..');
    }
    if (userFromLocation) {
      reset({
        id: userFromLocation.id,
        name: userFromLocation.name,
        email: userFromLocation.email,
      });
      setValue('isAdmin', userFromLocation.isAdmin);
    }
  }, []);

  const handleSubmitUser = async (values: UserSchemaSchemaType) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        isAdmin: values.isAdmin,
        companyId: user?.companyId,
      };
      if (values.id) {
        if (values.password.length > 0 && values.password.length < 6) {
          setError('password', {
            message: 'Senha deve ter no mínimo 6 caracteres!',
          });
          setError('confirm', {
            message: 'Senha deve ter no mínimo 6 caracteres!',
          });
          return;
        } else if (values.password !== values.confirm) {
          setError('confirm', {
            message: 'Senhas não conferem!',
          });
          return;
        }
        await api.patch('/auth/update-user', { ...payload, id: values.id });

        toast.success('Usuário editado com sucesso!');
      } else {
        if (values.password !== values.confirm) {
          setError('confirm', {
            message: 'Senhas não conferem!',
          });
          return;
        }

        await api.post('/auth/create-user', payload);
        toast.success('Usuário criado com sucesso!');
      }
      navigate('..');
    } catch (error) {
      if (values.id) {
        toast.error('Erro ao editar usuário!');
        return;
      }
      toast.error('Erro ao criar usuário!');
    }
  };

  function handleOnClose() {
    navigate('..');
  }

  return (
    <Modal open={true} onClose={handleOnClose}>
      <Box
        component={'form'}
        onSubmit={handleSubmit(handleSubmitUser)}
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
            {location.state ? 'Editando' : 'Criando novo'} usuário
          </Typography>
          <Close onClick={handleOnClose} sx={{ cursor: 'pointer' }} />
        </Box>
        <Grid container spacing={2} pt={4}>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.name}>Nome</InputLabel>
            <TextField
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.email}>Email</InputLabel>
            <TextField
              {...register('email')}
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.password}>Senha</InputLabel>
            <TextField
              {...register('password')}
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel error={!!errors.confirm}>Repita a Senha</InputLabel>
            <TextField
              {...register('confirm')}
              type="password"
              error={!!errors.confirm}
              helperText={errors.confirm?.message}
              fullWidth
            />
          </Grid>
          {location.state && (
            <Grid item xs={12}>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <Info />
                <Typography variant="body2">
                  Caso não queira mudar a senha, é só deixar em branco.
                </Typography>
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <InputLabel
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              error={!!errors.isAdmin}
            >
              Administrador:{' '}
              <input
                style={{ width: '1rem', height: '1rem' }}
                type="checkbox"
                {...register('isAdmin')}
              />
            </InputLabel>
          </Grid>

          <Grid item xs={12} mt={4}>
            <Button
              variant="contained"
              fullWidth
              // color="success"
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
