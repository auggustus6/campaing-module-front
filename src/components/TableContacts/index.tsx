import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Button,
} from '@mui/material';
import React, { ReactNode } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import { DeleteOutline } from '@mui/icons-material';

interface TableContactsProps {
  title?: ReactNode;
  headers: string[];
  contacts: Array<any>;
  total: number;
  onChangePage?: (page: number) => void;
  allowEdit?: boolean;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}

export default function TableContacts({
  title,
  headers,
  contacts,
  total,
  onChangePage,
  allowEdit = false,
  onEdit,
  onDelete,
}: TableContactsProps) {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onChangePage && onChangePage(newPage);
  };

  return (
    <TableContainer component={Paper}>
      {title && (
        <Box
          p={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
        </Box>
      )}
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((row) => (
              <TableCell key={row}>{row}</TableCell>
            ))}
            {allowEdit && <TableCell align="right">Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts?.map((row: any, i) => (
            <TableRow key={i}>
              {headers.map((item, k) => (
                <TableCell key={k}>{row[item]}</TableCell>
              ))}
              {allowEdit && (
                <TableCell align="right">
                  <Box>
                    <Button
                      variant="contained"
                      title="Editar"
                      sx={{ mr: 2 }}
                      onClick={() => onEdit && onEdit(i)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant={'contained'}
                      color={'error'}
                      title={'Remover'}
                      onClick={() => onDelete && onDelete(i)}
                    >
                      <DeleteOutline />
                    </Button>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={total}
        rowsPerPage={5}
        page={page}
        onPageChange={handleChangePage}
        showFirstButton
        showLastButton
      />
    </TableContainer>
  );
}
