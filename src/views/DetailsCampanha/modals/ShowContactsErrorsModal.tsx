import {
  Box,
  Button,
  Checkbox,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

interface Contacts {
  id: string;
  contact: string;
  status: string;
}

export default function ShowContactsErrorsModal() {
  const [selected, setSelected] = useState<string[]>([]);
  const [contacts, setContacts] = useState<Contacts[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { id: campaignId } = useParams();

  const toast = useToast();

  useEffect(() => {
    const contactsFromLocation: any = location.state;

    if (!contactsFromLocation) {
      navigate('..');
    }

    setContacts(contactsFromLocation);
  }, []);

  function handleOnClose() {
    navigate('..');
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selected.length === 0) {
      const newSelected = contacts.map((n) => n.id);
      setSelected(newSelected);
      return;
    }

    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  async function handleSendContacts() {
    try {
      console.log(location);
      await api.post(`/campaign/resend`, {
        campaignId,
        contacts: selected,
      });
      toast.success('Contatos enviados com sucesso');
      navigate('..');
    } catch (error) {
      toast.error('Erro ao enviar contatos');
    }
  }

  return (
    <Modal open={true} onClose={handleOnClose}>
      <Box
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
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={
                          contacts.length > 0 &&
                          selected.length === contacts.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>

                    <TableCell align={'left'}>
                      <b>ID</b>
                    </TableCell>
                    <TableCell align={'left'}>
                      <b>CONTATO</b>
                    </TableCell>
                    <TableCell align={'left'}>
                      <b>STATUS</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">
                          {row.id?.slice(0, 8) + '...'}
                        </TableCell>
                        <TableCell align="left">{row.contact}</TableCell>
                        <TableCell align="left" style={{ color: '#f00' }}>
                          {row.status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            sx={{ width: '100%' }}
            disabled={selected.length === 0}
            onClick={handleSendContacts}
          >
            Enviar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
