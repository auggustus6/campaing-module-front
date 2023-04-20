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

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(50, 'Nome pode ter no máximo 50 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirm: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    acceptTerms: z
      .boolean()
      .default(false)
      .refine((v) => v, { message: 'Aceite os termos' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Senhas não conferem',
    path: ['confirm'],
  });

type RegisterSchemaSchemaType = z.infer<typeof registerSchema>;

export default function Register() {
  const { login, isLogging, register: signup } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterSchemaSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  console.error(errors, 'errors');

  const checkbox = watch('acceptTerms');

  console.log({ checkbox });

  const handleSubmitRegister = async (values: RegisterSchemaSchemaType) => {
    signup({
      email: values.email,
      name: values.name,
      password: values.password,
    });
    // TODO - add toats to show error
    // login({ email: values.email, password: values.password });
  };

  return (
    <>
      <Styles.FormsTitle>
        <Typography variant="h4">Criar conta</Typography>
      </Styles.FormsTitle>
      <form onSubmit={handleSubmit(handleSubmitRegister)}>
        <Styles.Forms>
          <TextField
            label="Nome"
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            margin="normal"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
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

          <TextField
            label="Confirme a senha"
            margin="normal"
            type="password"
            {...register('confirm')}
            error={!!errors.confirm}
            // onChange={handleChange}
            helperText={errors.confirm?.message}
          />

          <Styles.SubField>
            <Checkbox
              label={'Aceito os termos e condições de uso'}
              // name="termos"
              {...register('acceptTerms')}
              onChange={() => {
                setValue('acceptTerms', !checkbox);
              }}
              error={!!errors.acceptTerms}
              value={checkbox}
            />
          </Styles.SubField>

          <ButtonLoading
            loading={isLogging}
            variant="contained"
            size="large"
            type="submit"
          >
            CRIAR
          </ButtonLoading>
        </Styles.Forms>
      </form>
      <Styles.NewAccountOrAlreadyHaveAnAccount>
        <Typography variant="subtitle2" textAlign="center">
          Já possui conta?{' '}
          <Link
            to={All_PATHS.LOGIN}
            style={{ color: theme.palette.primary.main }}
          >
            Entrar na conta
          </Link>
        </Typography>
      </Styles.NewAccountOrAlreadyHaveAnAccount>
    </>
  );
}
