import { Box, Grid, Modal, Typography } from '@mui/material';
import DefaultInput from '../../../components/Inputs/DefaultInput';
import MaterialButton from '@mui/material/Button';
import { Close } from '@mui/icons-material';
import { useToast } from '../../../context/ToastContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contacts: {
    contato?: string;
    variables: any;
  }[];
  addContact: (contact: any) => void;
  updateContactTable: (contact: any) => void;
  fields: string[];
}

export default function AddMoreContactModal({
  isOpen,
  onClose,
  contacts,
  addContact,
  fields,
  updateContactTable,
}: Props) {
  const toast = useToast();

  const handleSubmitUser: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const entries = Array.from(formData.entries());

      entries.map((entry) => {
        const [key, value] = entry;

        if (!value) {
          throw new Error(`O campo ${key} não pode estar vazio`);
        }
      });

      const rawObject = Object.fromEntries(formData.entries());

      updateContactTable(JSON.parse(JSON.stringify(rawObject)));

      const contactKey =
        Object.keys(rawObject || {}).find(
          (key) => key.toLocaleLowerCase() === 'contato'
        ) || '';

      let newContact: any = {
        contact: rawObject[contactKey],
      };

      delete rawObject[contactKey];

      newContact.variables = JSON.stringify(rawObject || {});

      addContact(newContact);

      toast.success('Contato adicionado com sucesso');

      onClose();
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }

    // console.log(newContact);

    // setContacts([...contacts, newContact]);
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
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant="h5">
            {/* {location.state ? 'Editar' : 'Criar novo'} canal */}
            Canal
          </Typography>
          <Close onClick={onClose} sx={{ cursor: 'pointer' }} />
        </Box>
        <Grid container spacing={2} pt={4}>
          {fields.map((field) => (
            <DefaultInput label={field} id={field} name={field} key={field} />
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
              Adicionar
            </MaterialButton>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
