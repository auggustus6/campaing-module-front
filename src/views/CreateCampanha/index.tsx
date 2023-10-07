import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MaterialButton from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@mui/joy/Button';
import Container from '@mui/system/Container';
import { Add, Science, UploadFile } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';

import { theme } from '../../styles/theme';
import { TextArea } from '../../components/TextArea';
import useBase64 from '../../hooks/useBase64';
import PreviewWppMessage from '../../components/PreviewWppMessage';

import ContactModal from '../../components/modals/ContactModal';
import { Box } from '@mui/material';
import CustomTooltip from '../../components/CustomTooltip';
import TableContacts from '../../components/TableContacts';
import { TABLE_CONTACTS_SIZE } from '../../utils/constants';
import DefaultInput from '../../components/Inputs/DefaultInput';
import { CampaignSchemaType, campaignSchema } from './schemas/campaignSchema';
import useSelectOption from './hooks/useSelectOption';
import useIsImage from '../../hooks/useIsImage';
import useCreateCampaign from './hooks/useCreateCampaign';
import useTestMessage from './hooks/useTestMessage';
import useUploadFile from './hooks/useUploadFile';
import { getFormattedMessage } from '../../utils/variablesUtils';
import useCaretPosition from './hooks/useCaretPosition';
import useCompany from '../../hooks/querys/useCompany';
import useChannels from '../../hooks/querys/useChannels';
import { usePagination } from '../../hooks/usePagination';

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

  const [contactKey, setContactKey] = useState('');

  const { base64: midiaBase64, getBase64 } = useBase64();

  const { caretPosition } = useCaretPosition({ id: 'messageTextArea' });

  const { handleSelectOption } = useSelectOption({
    caretPosition,
    message,
    setMessage: (message) => setValue('message', message),
  });

  const { isImage } = useIsImage({ midiaBase64 });

  const { user } = useAuth();
  const shouldDisable = !user?.company?.isActive ?? true;

  const [contactsObject, setContactsObject] = useState<any[]>([]);

  const {
    dataToShow: contactsToShow,
    page: contactsTablePage,
    setPage: setContactsTablePage,
    selectedIndex,
  } = usePagination({
    data: contactsObject,
    selectedFromPageIndex: selectedContact,
  });

  const { handleUploadFile } = useUploadFile({
    setContactKey,
    setContactsObject,
    setValue,
    trigger,
  });

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    getBase64(e.target.files?.[0]);
    setValue('midiaName', e.target.files?.[0].name);
    e.target.value = '';
  }

  function handleCanalSelect(e: SelectChangeEvent<string>) {
    setValue('session', e.target.value);
  }

  const { data: channels, isLoading: isChannelsLoading } = useChannels();
  const { mutate: handleCreateCampaign, isLoading: isCreatingCampaign } =
    useCreateCampaign({ midiaBase64 });

  const { mutate: handleTestMessage, isLoading: isTestingMessage } =
    useTestMessage({
      messagePreview,
      midiaBase64,
    });

  const isLoading = isCreatingCampaign || isTestingMessage || isChannelsLoading;

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
      {/* AddContact */}
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
          newValues[selectedIndex] = contact;
          setValue('contacts', newValues);
        }}
        updateContactTable={(contact) => {
          const newValues = [...contactsObject];
          newValues[selectedIndex] = contact;
          setContactsObject(newValues);
        }}
        isOpen={!Number.isNaN(selectedContact)}
        onClose={() => setSelectedContact(NaN)}
        fields={variables}
        contactKey={contactKey}
        selectedContact={contactsObject[selectedIndex]}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Criação de campanha</Typography>
        </Grid>
        <DefaultInput
          label={'Criação de campanha'}
          {...register('title')}
          errorMessage={errors.title?.message}
          disabled={isLoading || shouldDisable}
        />

        <Grid item xs={12} sm={6}>
          <InputLabel error={!!errors.session}>Canal</InputLabel>
          <FormControl fullWidth>
            <Select
              {...register('session')}
              error={!!errors.session}
              disabled={isLoading || shouldDisable || !channels?.length}
              value={session || 'select'}
              onChange={handleCanalSelect}
            >
              <MenuItem value={'select'}>Selecione um canal</MenuItem>
              {channels?.map((option) => (
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

        <DefaultInput
          label={'Data para disparo:'}
          {...register('scheduleDate')}
          errorMessage={errors.scheduleDate?.message}
          disabled={isLoading || shouldDisable}
          type="date"
        />

        <DefaultInput
          label={'Delay entre cada mensagem (em segundos):'}
          {...register('sendDelay')}
          errorMessage={errors.sendDelay?.message}
          disabled={isLoading || shouldDisable}
          type="number"
          defaultValue={120}
        />

        <DefaultInput
          label={'Url da imagem:'}
          disabled={isLoading || shouldDisable || !!watch('midiaName')}
          {...register('midiaUrl')}
          errorMessage={errors.midiaUrl?.message}
          fullWidth
        />

        <DefaultInput
          label={
            <>
              De
              <CustomTooltip title="O horário de inicio deve ser menor que o de término" />
            </>
          }
          disabled={isLoading || shouldDisable}
          {...register('startTime')}
          errorMessage={errors.startTime?.message}
          type="time"
          fullWidth
          xs={6}
          sm={3}
        />

        <DefaultInput
          label={'Até'}
          disabled={isLoading || shouldDisable}
          {...register('endTime')}
          errorMessage={errors.endTime?.message}
          type="time"
          fullWidth
          xs={6}
          sm={3}
        />

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
              disabled={isLoading || shouldDisable || !variables.length}
            >
              <MenuItem value={'0'}>
                {!variables.length
                  ? 'Envie um arquivo para selecionar as variáveis'
                  : 'Selecione uma variável'}
              </MenuItem>
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
            onClick={handleSubmit(handleCreateCampaign as any)}
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
            onClick={handleSubmit(handleTestMessage as any)}
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
