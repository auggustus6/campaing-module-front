import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/TextField';
import moment from 'moment';

import MaterialButton from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import Button from '@mui/joy/Button';
import Container from '@mui/system/Container';
import { useXLSX } from '../../hooks/useXLSX';
import Swal from 'sweetalert2';

import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { TextArea } from '../../components/TextArea';
import api from '../../services/api';
import { getFormattedMessage } from '../../utils/variablesUtils';
import { theme } from '../../styles/theme';
import TableContactsFromFile from '../../components/TableContacts/TableContactsFromFile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Add,
  HelpOutline,
  QuestionAnswer,
  QuestionMark,
  Science,
  UploadFile,
} from '@mui/icons-material';
import useBase64 from '../../hooks/useBase64';
import PreviewWppMessage from '../../components/PreviewWppMessage';
import {
  getMinutesFromTime,
  getNowOnlyDate,
} from '../../utils/dateAndTimeUtils';
import ContactModal from '../../components/modals/ContactModal';
import { Box, Checkbox, FormControlLabel, FormGroup, Stack, Tooltip } from '@mui/material';
import { addBrazilianCountryCode } from '../../utils/phoneNumbers';
import CustomTooltip from '../../components/CustomTooltip';
import TableContacts from '../../components/TableContacts';
import { TABLE_CONTACTS_SIZE } from '../../utils/constants';

interface Company {
  id: string;
  name: string;
  channel: {
    id: string;
    instanceName: string;
  }[];
}

export const phoneRegex = new RegExp(/\b\d{8,14}\b/);

const campaignSchema = z
  .object({
    title: z
      .string()
      .min(6, 'Muito curto!')
      .max(70, 'Muito extenso!')
      .nonempty('Campo obrigatório.'),
    message: z
      .string({
        required_error: 'Campo obrigatório.',
      })
      .min(6, 'Muito curto!'),
    scheduleDate: z
      .string()
      .transform((date) => (date ? new Date(date) : ''))
      .refine(
        (date) => {
          if (!date) return false;
          return date >= getNowOnlyDate();
        },
        { message: 'Escolha uma data no futuro!' }
      ),
    startTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
    endTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
    variables: z.string().array().min(1, 'Ao menos uma variável é necessária.'),
    contacts: z.any().array().min(1, 'Arquivo vazio.'),
    fileName: z.string().optional(),
    midiaName: z.string().optional(),
    midiaUrl: z.string().refine(
      (url) => {
        if (!url) return true;
        if (z.string().url().safeParse(url).success) return true;
        return false;
      },
      {
        message: 'URL inválida.',
      }
    ),
    sendDelay: z
      .string()
      .default('120')
      .transform((delay) => Number(delay))
      .refine(
        (delay) => {
          if (delay < 10) return false;
          return true;
        },
        { message: 'O tempo mínimo é de 10 segundos.' }
      ),
    session: z.string().min(10, 'Selecio  ne uma opção!'),
    runOnSaturday: z.boolean().default(false),
    runOnSunday: z.boolean().default(false),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: 'O horário de início deve ser menor que o horário de término.',
    path: ['startTime'],
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
  const session = watch('session', '');
  const messagePreview = getFormattedMessage({
    message,
    variables: getValues('contacts')?.[0]?.variables,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(NaN);

  const [caretPosition, setCaretPosition] = useState(0);

  const [contactKey, setContactKey] = useState('');

  const [company, setCompany] = useState<Company>();
  const { base64: midiaBase64, getBase64 } = useBase64();

  // TODO - make a hook for this
  const isImage =
    midiaBase64?.substring(0, 16)?.split('/')[0]?.split(':')[1] === 'image';

  useEffect(() => {
    setIsLoading(true);
    async function getCompany() {
      const { data } = await api.get<Company>('/companies');
      setCompany(data);
      setIsLoading(false);
    }
    getCompany();
  }, []);

  const { user } = useAuth();
  const shouldDisable = !user?.company?.isActive ?? true;

  const [contactsObject, setContactsObject] = useState<any[]>([]);
  const [contactsTablePage, setContactsTablePage] = useState(0);
  const contactsToShow = contactsObject.slice(
    contactsTablePage * TABLE_CONTACTS_SIZE,
    contactsTablePage * TABLE_CONTACTS_SIZE + TABLE_CONTACTS_SIZE
  );

  let selectedIndexFromPage = NaN;

  if (!Number.isNaN(selectedContact)) {
    selectedIndexFromPage =
      selectedContact + contactsTablePage * TABLE_CONTACTS_SIZE;
  }

  const [isLoading, setIsLoading] = useState(false);
  const { excelToJson } = useXLSX();
  const navigate = useNavigate();

  useEffect(() => {
    const messageInput = document.getElementById('messageTextArea');

    function getCaretPosition(e: any) {
      setCaretPosition(() => e.target?.selectionStart || 0);
    }

    messageInput?.addEventListener('click', getCaretPosition);
    messageInput?.addEventListener('blur', getCaretPosition);
    messageInput?.addEventListener('keyup', getCaretPosition);

    return () => {
      messageInput?.removeEventListener('click', getCaretPosition);
      messageInput?.removeEventListener('blur', getCaretPosition);
      messageInput?.removeEventListener('keyup', getCaretPosition);
    };
  }, []);

  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { data } = await excelToJson(e.target.files?.[0]);
    const key = Object.keys(data[0]).find((item) => {
      return phoneRegex.test(data[0][item].replace(/[^0-9]/gi, ''));
    });

    if (!key) {
      Swal.fire(
        'Erro',
        'A planilha deve ter ao menos uma coluna que contenha números de telefone	válidos',
        'warning'
      );
      return;
    }

    const formattedDate = data.map((item: any) => ({
      ...item,
      [key!]: addBrazilianCountryCode(item?.[key!]),
    }));

    const formattedContacts = formattedDate.map((item: any) => ({
      contact: item?.[key!],
      variables: JSON.stringify(item),
    }));

    setContactsObject(formattedDate);
    setContactKey(key);
    setValue('contacts', formattedContacts as CampaignSchemaType['contacts']);
    setValue('variables', Object.keys(data[0]));
    setValue('fileName', e.target.files?.[0].name);
    trigger('variables');
    e.target.value = '';
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    getBase64(e.target.files?.[0]);
    setValue('midiaName', e.target.files?.[0].name);
    e.target.value = '';
  }

  function handleSelectOption(e: SelectChangeEvent<string>) {
    const message = getValues('message') || '';
    let messageFirstPart = message.substring(0, caretPosition);
    let messageLastPart = message.substring(caretPosition);
    if (messageFirstPart[messageFirstPart.length - 1] !== ' ') {
      messageFirstPart = messageFirstPart + ' ';
    }
    if (messageLastPart[0] !== ' ') {
      messageLastPart = ' ' + messageLastPart;
    }
    setValue(
      'message',
      messageFirstPart + `{{${e.target.value}}}` + messageLastPart
    );
    const messageInput = document.getElementById(
      'messageTextArea'
    ) as HTMLTextAreaElement;

    setTimeout(() => {
      messageInput?.focus();
      let pos = caretPosition + e.target.value.length + 6;

      messageInput?.setSelectionRange(pos, pos);
    }, 100);
  }

  function handleCanalSelect(e: SelectChangeEvent<string>) {
    setValue('session', e.target.value);
  }

  async function handleCreateCampaign(values: CampaignSchemaType) {
    setIsLoading(true);

    let midiaType;

    if (values.midiaUrl) {
      midiaType = 'IMAGE_URL';
    } else {
      midiaType = midiaBase64?.substring(0, 16)?.split('/')[0]?.split(':')[1];
    }

    midiaType = midiaType?.toUpperCase();

    try {
      await api.post('/campaign', {
        title: values.title,
        message: values.message,
        scheduleDate: (values.scheduleDate as Date) || undefined,
        startTime: values.startTime,
        endTime: values.endTime,
        contacts: values.contacts,
        sendDelay: values.sendDelay,
        channel_id: values.session,
        midia: midiaBase64,
        midiaUrl: values.midiaUrl,
        midiaType: midiaType || 'TEXT',
        runOnSaturday: values.runOnSaturday,
        runOnSunday: values.runOnSunday,
      });

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

  async function handleTestMessage(values: CampaignSchemaType) {
    setIsLoading(true);

    // TODO - change to react portals and react components
    try {
      const value = await Swal.fire({
        text: 'Digite o número para o qual deseja enviar a mensagem',
        input: 'text',
        inputPlaceholder: '55 11 9 9999-9999',
        inputAttributes: {
          inputmode: 'numeric',
        },
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: async (number) => {
          try {
            const formattedNumber = number.replace(/\D/g, '');
            const result = await api.post(
              '/campaign/send-message-test-campaign',
              {
                text: messagePreview,
                to: formattedNumber,
                midia: midiaBase64 || undefined,
                instanceId: values.session,
              }
            );

            Swal.fire('Sucesso', 'Mensagem enviada com sucesso!', 'success');
          } catch (error) {
            console.error(error);
            Swal.fire(
              'Erro',
              'Erro ao enviar mensagem, por favor tente novamente.',
              'error'
            );
          }
        },
      });
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

  async function handleRemoveContact(index: number) {
    const option = await Swal.fire({
      title: 'Tem certeza que deseja remover esse contato?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      icon: 'question',
    });

    if (!option.isConfirmed) {
      return;
    }

    const indexToSlice = index + contactsTablePage * TABLE_CONTACTS_SIZE;

    const newContactsObject = [...contactsObject];
    const newContacts = getValues('contacts');

    newContactsObject.splice(indexToSlice, 1);
    newContacts.splice(indexToSlice, 1);

    setContactsObject(newContactsObject);
    setValue('contacts', newContacts);

    if (newContactsObject.length === 0) {
      setValue('fileName', '');
      setValue('variables', []);
    }
  }

  return (
    <Container sx={{ p: 0 }}>
      <ContactModal
        addContact={(contact) => {
          setValue('contacts', [contact, ...getValues('contacts')]);
        }}
        updateContactTable={(contact) => {
          setContactsObject([contact, ...contactsObject] as any);
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={variables}
        contactKey={contactKey}
      />

      {/* EditContactModal */}
      <ContactModal
        addContact={(contact) => {
          const newValues = getValues('contacts');
          newValues[selectedIndexFromPage] = contact;
          setValue('contacts', newValues);
        }}
        updateContactTable={(contact) => {
          const newValues = [...contactsObject];
          newValues[selectedIndexFromPage] = contact;
          setContactsObject(newValues);
        }}
        isOpen={!Number.isNaN(selectedContact)}
        onClose={() => setSelectedContact(NaN)}
        fields={variables}
        contactKey={contactKey}
        selectedContact={contactsObject[selectedIndexFromPage]}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Criação de campanha</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.title}>Titulo da Campanha</InputLabel>
          <Input
            disabled={isLoading || shouldDisable}
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.session}>Canal</InputLabel>
          <FormControl fullWidth>
            <Select
              {...register('session')}
              error={!!errors.session}
              disabled={isLoading || shouldDisable}
              value={session || 'select'}
              onChange={handleCanalSelect}
            >
              <MenuItem value={'select'}>Selecione um canal</MenuItem>
              {company?.channel.map((option) => (
                <MenuItem value={option.id} key={option.id}>
                  {option.instanceName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            sx={{
              color: '#d32f2f',
              marginLeft: '0.875rem',
              fontSize: '0.75rem',
              marginTop: '3px',
              // lineHeight: '1.66',
            }}
          >
            {errors.session?.message}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.scheduleDate}>
            Data para disparo:
          </InputLabel>
          <Input
            disabled={isLoading || shouldDisable}
            type="date"
            {...register('scheduleDate')}
            error={!!errors.scheduleDate}
            helperText={errors.scheduleDate?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.sendDelay}>
            Delay entre cada mensagem (em segundos):
            <CustomTooltip title="O tempo mínimo é de 10 segundos" />
          </InputLabel>
          <Input
            disabled={isLoading || shouldDisable}
            type="number"
            {...register('sendDelay')}
            defaultValue={120}
            error={!!errors.sendDelay}
            helperText={errors.sendDelay?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.midiaUrl}>Url da imagem:</InputLabel>
          <Input
            disabled={isLoading || shouldDisable || !!watch('midiaName')}
            {...register('midiaUrl')}
            error={!!errors.midiaUrl}
            helperText={errors.midiaUrl?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <InputLabel error={!!errors.startTime}>
            De
            <CustomTooltip title="O horário de inicio deve ser menor que o de término" />
          </InputLabel>
          <Input
            disabled={isLoading || shouldDisable}
            type="time"
            {...register('startTime')}
            error={!!errors.startTime}
            helperText={errors.startTime?.message}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <InputLabel error={!!errors.endTime}>Até</InputLabel>
          <Input
            disabled={isLoading || shouldDisable}
            type="time"
            {...register('endTime')}
            error={!!errors.endTime}
            helperText={errors.endTime?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label="Rodar aos sábados"
              disabled={isLoading || shouldDisable}
              {...register('runOnSaturday')}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Rodar aos domingos"
              disabled={isLoading || shouldDisable}
              {...register('runOnSunday')}
            />

          </FormGroup>
        </Grid>

        <Grid item xs={12}>
          <MaterialButton
            sx={{
              height: '3.5rem',
              maxWidth: '500px',
              overflow: 'hidden',
              textAlign: 'start',
            }}
            disabled={isLoading || shouldDisable || !!watch('midiaUrl')}
            variant={errors.variables ? 'outlined' : 'outlined'}
            component="label"
          >
            <UploadFile />
            {getValues('midiaName')
              ? getValues('midiaName')
              : 'Selecione audio ou foto'}
            <input
              id="fileSelect"
              type="file"
              hidden
              accept="image/png, image/gif, image/jpeg, audio/*"
              onChange={handleUploadImage}
            />
          </MaterialButton>
        </Grid>
        <Grid item xs={12}>
          <InputLabel error={!!errors.message}>Mensagem:</InputLabel>
          <TextArea
            {...register('message')}
            disabled={isLoading || shouldDisable}
            error={errors.message?.message}
            id="messageTextArea"
          />
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <InputLabel sx={{ color: theme.palette.primary.main }}>
            Preview da mensagem:
          </InputLabel>
          <PreviewWppMessage
            imgSrc={isImage ? midiaBase64 : undefined || watch('midiaUrl')}
            messagePreview={messagePreview}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Variáveis</InputLabel>
            <Select
              label="Variáveis"
              onChange={handleSelectOption}
              value="0"
              disabled={isLoading || shouldDisable}
            >
              <MenuItem value={'0'}>Selecione uma variável</MenuItem>
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
            sx={{
              height: '3.5rem',
              textTransform: 'uppercase',
              background: '#232323',
              '&:hover': {
                background: '#595959',
              },
            }}
            disabled={isLoading || shouldDisable}
            color={errors.variables ? 'error' : 'secondary'}
            fullWidth
            variant={errors.variables ? 'outlined' : 'contained'}
            component="label"
          >
            <AttachFileIcon />
            {getValues('fileName')
              ? getValues('fileName')
              : 'Enviar Arquivo CSV'}
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
            sx={{ height: '3.5rem', textTransform: 'uppercase' }}
            fullWidth
            disabled={isLoading || shouldDisable}
            loading={isLoading}
            onClick={handleSubmit(handleCreateCampaign)}
          >
            <AddCircleOutlineIcon />
            Criar Campanha
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <a href={'/modelo_planilha.xlsx'} target="_blank">
            <Button
              variant="outlined"
              sx={{ height: '3.5rem', textTransform: 'uppercase' }}
              fullWidth
              disabled={isLoading || shouldDisable}
            >
              <DownloadIcon />
              Baixar template do excel
            </Button>
          </a>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            sx={{ height: '3.5rem', textTransform: 'uppercase' }}
            fullWidth
            disabled={isLoading || shouldDisable}
            loading={isLoading}
            onClick={handleSubmit(handleTestMessage)}
          >
            <Science />
            Testar mensagem
          </Button>
        </Grid>
      </Grid>

      <Box mt={8} />
      {!!contactsObject.length && (
        <TableContacts
          allowEdit
          headers={variables}
          onEdit={(index) => setSelectedContact(index)}
          onDelete={handleRemoveContact}
          contacts={contactsToShow}
          total={contactsObject.length}
          onChangePage={setContactsTablePage}
          title={
            <>
              <InputLabel
                sx={{
                  fontSize: '1.5rem',
                }}
              >
                Valores da Planilha
              </InputLabel>
              <MaterialButton
                disabled={isLoading || shouldDisable}
                sx={{ height: '3.5rem', textTransform: 'uppercase' }}
                variant={'outlined'}
                onClick={() => setIsModalOpen(true)}
              >
                <Add />
                Adicionar mais contato
              </MaterialButton>
            </>
          }
        />
      )}
    </Container>
  );
}
