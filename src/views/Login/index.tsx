import { TextField, Typography } from '@mui/material';
import * as Styles from './styles';
import { Link } from 'react-router-dom';
import { Checkbox } from '../../components/checkbox';
import { ButtonLoading } from '../../components/buttonLoading';
import { useAuth } from '../../context/AuthContext';
import { FormEvent } from 'react';

export default function Login() {
  // const { signIn, authLoading } = useContext(AuthContext);
  const { login, isLogging } = useAuth();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email: 'chriscoy@email.com', password: '123123' });
    // signIn({
    //   email: values.email,
    //   password: values.password,
    // });
  };

  return (
    <Styles.Wrapper>
      <Styles.Content>
        <Styles.LeftSide>
          <Styles.Image
            src="background-pc.jpg"
            style={{ objectFit: 'cover' }}
          />
        </Styles.LeftSide>
        <Styles.RightSide>
          <Styles.LoginContent>
            <Styles.FormsTitle>
              <Typography component={'h4'}>Entrar na conta</Typography>
              <Typography variant="subtitle1">
                Faça o login para continuar
              </Typography>
            </Styles.FormsTitle>

            <form onSubmit={handleSubmit}>
              <Styles.Forms>
                <TextField
                  name="email"
                  label="Email"
                  margin="normal"
                  type="email"
                  // onChange={handleChange}
                  // helperText={errors.email}
                  required
                />

                <TextField
                  name="password"
                  label="Senha"
                  margin="normal"
                  type="password"
                  // onChange={handleChange}
                  // helperText={errors.password}
                  required
                />

                <Styles.SubField>
                  <Checkbox
                    name="rememberMe"
                    label="Manter-se conectado"
                    // onChange={handleChange}
                  />
                  <Link
                    // label=""
                    to={'/forgot-password'}
                  >
                    Esqueceu a senha?
                  </Link>
                </Styles.SubField>

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

            {/* <Styles.NewAccountOrAlreadyHaveAnAccount>
              <Typography variant="subtitle2" textAlign="center">
                Não possui conta ?{' '}
                <Link href={AppRouters.register}>
                Criar conta
                </Link>
              </Typography>
            </Styles.NewAccountOrAlreadyHaveAnAccount> */}
          </Styles.LoginContent>
        </Styles.RightSide>
      </Styles.Content>
    </Styles.Wrapper>
  );
}
