import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Stack, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowWhenAdmin from '../../../components/ShowWhenAdmin';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { WhatsApp } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { ChannelSchemaSchemaType } from '../modals/ChannelModal';

// TODO - move model type to a dto file in a folder
export interface Channel extends ChannelSchemaSchemaType {}

interface TableChannelsProps {
  channels: Channel[] | undefined;
  channelsLength: number | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export default function TableChannels({
  channels = [],
  channelsLength = 0,
  refetch,
  isLoading,
}: TableChannelsProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const ROWS_PER_PAGE = 5;

  const toast = useToast();

  const channelsToShow = channels.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  function handleCreateNewChannel() {
    navigate('create-channel');
  }

  function handleEdit(channel: Channel) {
    navigate('edit-channel', {
      state: channel,
    });
  }

  async function handleRemove(id: string) {
    const { isConfirmed } = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    });

    if (!isConfirmed) return;

    await api.delete(`/channels/${id}`);
    refetch();
  }

  return (
    <TableContainer component={Paper}>
      <Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
        <Typography variant="h5" display={'flex'} alignItems={'center'} gap={1}>
          <WhatsApp /> Canais
        </Typography>
        <ShowWhenAdmin>
          <Button
            variant="outlined"
            onClick={handleCreateNewChannel}
            disabled={isLoading}
          >
            <AddIcon sx={{ marginRight: 1 }} />
            Adicionar canal
          </Button>
        </ShowWhenAdmin>
      </Box>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Apelido</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Webhook</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channelsToShow.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.key}</TableCell>
              <TableCell>{row.instanceName}</TableCell>
              <TableCell>{row.login}</TableCell>
              <TableCell>{row.url}</TableCell>
              <TableCell>{row.webhook}</TableCell>
              <TableCell>
                <Stack direction={'row'}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleEdit(row)}
                    sx={{ marginRight: 1 }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemove(row.id!)}
                  >
                    <DeleteIcon />
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={channelsLength}
        rowsPerPage={5}
        showFirstButton
        showLastButton
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
}
