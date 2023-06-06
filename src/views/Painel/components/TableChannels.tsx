import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowWhenAdmin from '../../../components/ShowWhenAdmin';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { HowToReg, PersonOffOutlined, WhatsApp } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';


// TODO - move model type to a dto file in a folder
export type Channel = {
  id: string;
  channelNick: string;
  phoneNumber: string;
  phoneNumberId: string;
  whatsAppBusinessId: string;
  whatsAppAccountBusinessId: string;
  tokenAccess: string;
};

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
            <TableCell>Apelido</TableCell>
            <TableCell>Número</TableCell>
            <ShowWhenAdmin>
              <TableCell>ID Número</TableCell>
              <TableCell>ID Conta Whatsapp</TableCell>
              <TableCell>ID Conta Negócio Whatsapp</TableCell>
              <TableCell>Ações</TableCell>
            </ShowWhenAdmin>
          </TableRow>
        </TableHead>
        <TableBody>
          {channelsToShow.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.channelNick}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <ShowWhenAdmin>
                <TableCell>{row.phoneNumberId}</TableCell>
                <TableCell>{row.whatsAppAccountBusinessId}</TableCell>
                <TableCell>{row.whatsAppBusinessId}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error">
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </ShowWhenAdmin>
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
