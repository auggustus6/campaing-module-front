import { TextField, Typography } from '@mui/material';
import * as Styles from './styles';
import { Link } from 'react-router-dom';
import { Checkbox } from '../../components/checkbox';
import { ButtonLoading } from '../../components/buttonLoading';
import { useAuth } from '../../context/AuthContext';
import { FormEvent } from 'react';
import { theme } from '../../styles/theme';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { All_PATHS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginSchemaSchemaType = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLogging } = useAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmitLogin = async (values: LoginSchemaSchemaType) => {
    // event.preventDefault();
    try {
      await login({ email: values.email, password: values.password });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status.toString().startsWith('4')) {
          toast.error('Email ou senha incorretos');
          return;
        }
      } else {
        toast.error('Erro ao fazer login, tente novamente mais tarde');
      }
    }
  };

  return (
    <>
      <Styles.FormsTitle>
        <Typography variant={'h4'}>Entrar na conta</Typography>
        <Typography variant="subtitle1">Faça o login para continuar</Typography>
      </Styles.FormsTitle>
      <form onSubmit={handleSubmit(handleSubmitLogin)}>
        <Styles.Forms>
          <TextField
            label="Email"
            margin="normal"
            type="email"
            {...register('email')}
            error={!!errors.email}
            // onChange={handleChange}
            helperText={errors.email?.message}
            // required
          />

          <TextField
            label="Senha"
            margin="normal"
            type="password"
            {...register('password')}
            error={!!errors.password}
            // onChange={handleChange}
            helperText={errors.password?.message}
          />

          {/* <Styles.SubField>
            <Link to={'/forgot-password'}>Esqueceu a senha?</Link>
          </Styles.SubField> */}

          <ButtonLoading
            loading={isLogging}
            variant="contained"
            size="large"
            type="submit"
          >
            ENTRAR
          </ButtonLoading>
        </Styles.Forms>
      </form>
      <Styles.NewAccountOrAlreadyHaveAnAccount>
        <Typography variant="subtitle2" textAlign="center">
          Não possui conta ?{' '}
          <Link
            to={All_PATHS.REGISTER}
            style={{ color: theme.palette.primary.main }}
          >
            Criar conta
          </Link>
        </Typography>
      </Styles.NewAccountOrAlreadyHaveAnAccount>
    </>
  );
}
