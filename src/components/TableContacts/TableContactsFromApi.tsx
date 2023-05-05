import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Switch, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getFormattedMessage } from '../../utils/variablesUtils';
import api from '../../services/api';

export default function TableContactsFromApi({
  id,
  message,
}: {
  id?: string;
  message: string;
}) {
  const [page, setPage] = useState(0);
  // const [showDeleted, setShowDeleted] = useState(false);
  const [showFinished, setShowFinished] = useState(false);

  const { data } = useQuery(
    ['contacts-by-id', id, page, showFinished],
    async () => {
      return await api.get(
        `/contacts/${id}?page=${page}&list_finished=${showFinished}`
      );
    },
    { staleTime: 1000 * 60 } //60 seconds
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper}>
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            py: 2,
          }}
        >
          <Typography>Mostrar contatos já enviados</Typography>
          <Switch
            value={showFinished}
            onChange={() => setShowFinished(!showFinished)}
          />
        </Box>
      </Box>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Contato</TableCell>
            <TableCell>Mensagem</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data.results?.map((row: any) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.contact}</TableCell>
              <TableCell>
                {getFormattedMessage({ message, variables: row.variables })}
              </TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={data?.data.total || 0}
        rowsPerPage={5}
        showFirstButton
        showLastButton
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
}
