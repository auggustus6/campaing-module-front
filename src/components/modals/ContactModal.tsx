import { Box, Grid, Modal, Typography } from '@mui/material';
import MaterialButton from '@mui/material/Button';
import { Close } from '@mui/icons-material';
import InputMask from 'react-input-mask';
import { useToast } from '../../context/ToastContext';
import { phoneRegex } from '../../views/CreateCampanha';
import DefaultInput from '../Inputs/DefaultInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  addContact: (contact: any) => void;
  updateContactTable: (contact: any) => void;
  fields: string[];
  contactKey: string;
  selectedContact?: any;
}

export default function ContactModal({
  isOpen,
  onClose,
  addContact,
  fields,
  updateContactTable,
  contactKey,
  selectedContact,
}: Props) {
  const toast = useToast();

  const fieldsWithoutContact = fields.filter((key) => key !== contactKey);

  const handleSubmitUser: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const entries = Array.from(formData.entries());

      entries.map((entry) => {
        const [key, value] = entry;

        if (!value) {
          document.getElementById(key)?.focus();
          throw new Error(`O campo ${key} não pode estar vazio`);
        }
      });

      const rawObject = Object.fromEntries(formData.entries());
      rawObject[contactKey] = rawObject[contactKey]
        .toString()
        .replace(/\D/g, '');

      if (
        !phoneRegex.test(
          rawObject[contactKey].toString().replace(/\D/g, '') || ''
        )
      ) {
        document.getElementById(contactKey)?.focus();
        throw new Error('Telefone inválido');
      }

      updateContactTable(JSON.parse(JSON.stringify(rawObject)));

      let newContact: any = {
        contact: rawObject[contactKey],
      };

      newContact.variables = JSON.stringify(rawObject || {});

      addContact(newContact);

      toast.success(
        `Contato ${!!selectedContact ? 'editado' : 'adicionado'} com sucesso`
      );

      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        component={'form'}
        onSubmit={handleSubmitUser}
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
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box>
            <Typography variant="h5">
              {!!selectedContact ? 'Editar contato' : 'Adicionar mais contatos'}
            </Typography>
            <Typography variant="body1" color={'GrayText'}>
              {!!selectedContact
                ? 'Edite os dados do contato de forma manual'
                : 'Adicione mais contatos e variaveis à sua campanha de forma manual.'}
            </Typography>
          </Box>
          <Close onClick={onClose} sx={{ cursor: 'pointer' }} />
        </Box>
        <Grid container spacing={2} pt={4}>
          <InputMask mask={'55 99 9 9999-9999'}>
            <DefaultInput
              placeholder="55 99 9 9999-9999"
              label={contactKey}
              id={contactKey}
              name={contactKey}
              defaultValue={selectedContact?.[contactKey || ''] || ''}
            />
          </InputMask>
          {fieldsWithoutContact.map((field) => (
            <DefaultInput
              label={field}
              id={field}
              name={field}
              key={field}
              defaultValue={selectedContact?.[field] || ''}
            />
          ))}

          <Grid item xs={12}>
            <MaterialButton
              sx={{
                height: '3.5rem',
                textTransform: 'uppercase',
              }}
              color={'primary'}
              fullWidth
              variant={'contained'}
              type="submit"
            >
              Confirmar
            </MaterialButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
