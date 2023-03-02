import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Box, Container } from '@mui/system';
import TextareaAutosize from '@mui/base/TextareaAutosize';

export default function CreateCampanha() {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Criação de campanha</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            style={{
              width: '100%',
              height: '200px',
              padding: '1rem',
              resize: 'none',
              fontSize: '1.2rem',
              fontFamily: 'Roboto, sans-serif, Helvetica',
              fontWeight: 300,
              overflow: 'scroll',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Variáveis</InputLabel>
            <Select label="Variáveis" onChange={() => {}} defaultValue={'null'}>
              <MenuItem value={'null'}>Selecione uma variável</MenuItem>
              <MenuItem value={'Nome'}>Nome</MenuItem>
              <MenuItem value={'Email'}>Email</MenuItem>
              <MenuItem value={'Telefone'}>Telefone</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            sx={{ height: '3.5rem' }}
            fullWidth
            color="secondary"
          >
            Enviar Arquivo do Excel
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" sx={{ height: '3.5rem' }} fullWidth>
            Criar Campanha
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" sx={{ height: '3.5rem' }} fullWidth>
            Baixar template do excel
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
