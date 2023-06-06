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
import { HowToReg, Person, PersonOffOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
};

interface TableUsersProps {
  users: User[] | undefined;
  usersLength: number | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export default function TableUsers({
  users = [],
  usersLength = 0,
  refetch,
  isLoading,
}: TableUsersProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const ROWS_PER_PAGE = 5;

  const toast = useToast();

  const usersToShow = users.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  function handleCreateNewUser() {
    navigate('create-user');
  }

  // TODO - this function doest not work because the endpoint is only to remove
  async function handleDisable(id: string, isActive: boolean) {
    const option = await Swal.fire({
      title: `Tem certeza que deseja ${
        isActive ? 'desativar' : 'ativar'
      } esse usuário?`,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      icon: 'question',
    });

    if (!option.isConfirmed) {
      return;
    }

    try {
      await api.delete(`/auth/delete-user/${id}`);

      toast.success('Usuário removido com sucesso');
    } catch (error) {
      toast.error('Erro ao remover usuário');
    } finally {
      refetch();
    }
  }

  function handleEdit(user: User) {
    navigate('edit-user', {
      state: user,
    });
  }

  return (
    <TableContainer component={Paper}>
      <Box display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'}>
        <Typography variant="h5" display={'flex'} alignItems={'center'} gap={1}>
          <Person /> Usuários
        </Typography>
        <ShowWhenAdmin>
          <Button
            variant="outlined"
            onClick={handleCreateNewUser}
            disabled={isLoading}
          >
            <AddIcon sx={{ marginRight: 1 }} />
            Adicionar usuário
          </Button>
        </ShowWhenAdmin>
      </Box>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell>ID</TableCell> */}
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            {/* <TableCell>Ativo</TableCell> */}
            <TableCell>Admin</TableCell>
            <ShowWhenAdmin>
              <TableCell align="right">Ações</TableCell>
            </ShowWhenAdmin>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersToShow.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              {/* <TableCell>{row.isActive ? 'Sim' : 'Não'}</TableCell> */}
              <TableCell>{row.isAdmin ? 'Sim' : 'Não'}</TableCell>
              <ShowWhenAdmin>
                <TableCell align="right">
                  <Box>
                    {row.isActive && (
                      <Button
                        onClick={() => handleEdit(row)}
                        variant="contained"
                        sx={{ marginRight: 2 }}
                        title="Editar"
                      >
                        <EditIcon />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDisable(row.id, row.isActive)}
                      variant={row.isActive ? 'contained' : 'outlined'}
                      color={row.isActive ? 'error' : 'secondary'}
                      title={row.isActive ? 'Desativar' : 'Ativar'}
                    >
                      {row.isActive ? <PersonOffOutlined /> : <HowToReg />}
                    </Button>
                  </Box>
                </TableCell>
              </ShowWhenAdmin>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={usersLength}
        rowsPerPage={5}
        showFirstButton
        showLastButton
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
}
