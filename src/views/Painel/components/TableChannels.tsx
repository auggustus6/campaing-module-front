import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Stack, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext';
import { Ballot, Circle, Preview, WhatsApp } from '@mui/icons-material';

import { tableFormatDateTime } from '../../../utils/dateAndTimeUtils';
import { Channel } from '../../../models/channel';

interface TableChannelsProps {
  channels: Channel[] | undefined;
  channelsLength: number | undefined;
  isLoading: boolean;
  refetch: () => void;
}

function StatusLabel({ status }: { status?: string }) {
  const isConnected = status === 'connected';
  return (
    <Typography
      color={isConnected ? 'green' : 'red'}
      fontWeight={700}
      display="flex"
      alignItems="center"
    >
      <Circle />
      {isConnected ? 'Conectado' : 'Desconectado'}
    </Typography>
  );
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

  function handleSeeDetails(channel: Channel) {
    navigate(`details-channel/${channel.id}`, {
      state: channel,
    });
  }


  return (
    <TableContainer component={Paper}>
      <Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
        <Typography variant="h5" display={'flex'} alignItems={'center'} gap={1}>
          <WhatsApp /> Canais
        </Typography>
      </Box>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id externo do Canal</TableCell>
            <TableCell>Apelido</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {channelsToShow.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.wppApiInstanceId}</TableCell>
              <TableCell>{row.instanceName}</TableCell>
              <TableCell>{tableFormatDateTime(row.createdAt)}</TableCell>
              <TableCell>
                <StatusLabel status={row.state} />
              </TableCell>
              <TableCell align="right">
                <Stack direction={'row'} justifyContent={'end'}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleSeeDetails(row)}
                  >
                    <Preview /> Detalhes
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
