import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import MaterialButton from '@mui/material/Button';

import Button from '@mui/joy/Button';
import Container from '@mui/system/Container';
import { useXLSX } from '../../hooks/useXLSX';
import Swal from 'sweetalert2';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { TextArea } from '../../components/TextArea';
import api from '../../services/api';
import { getFormattedMessage } from '../../utils/variablesUtils';
import { theme } from '../../styles/theme';
import TableContactsFromFile from '../../components/TableContacts/TableContactsFromFile';
import { useNavigate } from 'react-router-dom';

const campaignSchema = z.object({
  title: z
    .string()
    .min(6, 'Muito curto!')
    .max(70, 'Muito extenso!')
    .nonempty('Campo obrigatório.'),
  message: z.string().min(6, 'Muito curto!').max(200, 'Muito extenso!'),
  scheduleDate: z
    .string()
    .transform((date) => (date ? new Date(date) : ''))
    .refine(
      (date) => {
        if (!date) return false;
        return new Date(date) > new Date();
      },
      { message: 'Escolha uma data no futuro!' }
    )
    .optional(),
  variables: z.string().array().min(1, 'Ao menos uma variável é necessária.'),
  contacts: z.any().array().min(1, 'Arquivo vazio.'),
  fileName: z.string().optional(),
  sendDelay: z
    .string()
    .transform((delay) => Number(delay))
    .refine(
      (delay) => {
        if (delay < 10) return false;
        return true;
      },
      { message: 'O tempo mínimo é de 10 segundos.' }
    ),
});

type CampaignSchemaType = z.infer<typeof campaignSchema>;

export default function CreateCampanha() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<CampaignSchemaType>({
    resolver: zodResolver(campaignSchema),
  });
  const variables = watch('variables', []);
  const message = watch('message', '');
  const messagePreview = getFormattedMessage({
    message,
    variables: getValues('contacts')?.[0]?.variables,
  });

  const [contactsObject, setContactsObject] = useState<[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { excelToJson } = useXLSX();
  const navigate = useNavigate();

  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { data } = await excelToJson(e.target.files?.[0]);
    const lowerVariables = Object.keys(data[0]).map((item) =>
      item.toLowerCase()
    );
    if (!lowerVariables.includes('contato')) {
      Swal.fire(
        'Erro',
        'A planilha deve ter ao menos uma coluna com o titulo "Contato"',
        'warning'
      );
      return;
    }

    const key = Object.keys(data[0]).find(
      (item) => item.toLowerCase() === 'contato'
    );

    console.log({ key });

    const formattedContacts = data.map((item: any) => ({
      contact: item?.[key!],
      variables: JSON.stringify(item),
    }));

    setContactsObject(data);
    setValue('contacts', formattedContacts as CampaignSchemaType['contacts']);
    setValue('variables', Object.keys(data[0]));
    setValue('fileName', e.target.files?.[0].name);
    trigger('variables');
    e.target.value = '';
  }

  function handleSelectOption(e: SelectChangeEvent<'null'>) {
    setValue('message', getValues('message') + `{{${e.target.value}}}`);
  }

  async function handleCreateCampaign(values: CampaignSchemaType) {
    setIsLoading(true);

    try {
      await api.post('/campaign', {
        title: values.title,
        message: values.message,
        scheduleDate: (values.scheduleDate as Date) || undefined,
        contacts: values.contacts,
        sendDelay: values.sendDelay,
      });

      // reset({
      //   contacts: [],
      //   message: '',
      //   scheduleDate: '',
      //   title: '',
      //   variables: [],
      //   fileName: '',
      // });
      // setContactsObject([]);

      navigate('/campanhas');
      Swal.fire('Sucesso', 'Campanha criada com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Erro',
        'Erro ao criar campanha, por favor tente novamente.',
        'error'
      );
    }
    setIsLoading(false);
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Criação de campanha</Typography>
        </Grid>
        <Grid item xs={12}>
          <InputLabel error={!!errors.title}>Titulo da Campanha</InputLabel>
          <Input
            disabled={isLoading}
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.scheduleDate}>
            Data para disparo(deixe vazio caso nao queira uma data):
          </InputLabel>
          <Input
            disabled={isLoading}
            type="datetime-local"
            {...register('scheduleDate')}
            error={!!errors.scheduleDate}
            helperText={errors.scheduleDate?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.scheduleDate}>
            Delay entre cada mensagem:
          </InputLabel>
          <Input
            disabled={isLoading}
            type="number"
            {...register('sendDelay')}
            defaultValue={10}
            error={!!errors.sendDelay}
            helperText={errors.sendDelay?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <InputLabel error={!!errors.message}>Mensagem:</InputLabel>
          <TextArea
            {...register('message')}
            disabled={isLoading}
            error={errors.message}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <InputLabel
            error={!!errors.message}
            sx={{ color: theme.palette.primary.main }}
          >
            Preview da mensagemMensagem:
          </InputLabel>
          <Paper
            sx={{
              p: 4,
              outline: `1px solid ${theme.palette.primary.main}`,
              whiteSpace: 'pre-wrap',
            }}
            variant={'outlined'}
          >
            <p>{messagePreview}</p>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Variáveis</InputLabel>
            <Select
              label="Variáveis"
              onChange={handleSelectOption}
              value="null"
              disabled={isLoading}
            >
              <MenuItem value={'null'}>Selecione uma variável</MenuItem>
              {variables.map((option) => (
                <MenuItem value={option} key={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <MaterialButton
            sx={{ height: '3.5rem' }}
            disabled={isLoading}
            color={errors.variables ? 'error' : 'secondary'}
            fullWidth
            variant={errors.variables ? 'outlined' : 'contained'}
            component="label"
          >
            {getValues('fileName')
              ? getValues('fileName')
              : 'Enviar Arquivo do Excel'}
            <input
              id="fileSelect"
              type="file"
              hidden
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleUploadFile}
            />
          </MaterialButton>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            sx={{ height: '3.5rem' }}
            fullWidth
            disabled={isLoading}
            loading={isLoading}
            onClick={handleSubmit(handleCreateCampaign)}
          >
            Criar Campanha
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <a href={'/modelo_planilha.xlsx'} target="_blank">
            <Button
              variant="outlined"
              sx={{ height: '3.5rem' }}
              fullWidth
              disabled={isLoading}
            >
              Baixar template do excel
            </Button>
          </a>
        </Grid>
      </Grid>

      <InputLabel sx={{ marginTop: 4 }}>Valores da Planilha</InputLabel>
      <TableContactsFromFile header={variables} contacts={contactsObject} />
    </Container>
  );
}
