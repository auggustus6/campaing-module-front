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
import { TABLE_CONTACTS_SIZE } from '../../utils/constants';
import { tableFormatDateTime } from '../../utils/dateAndTimeUtils';

interface TableContactsProps {
  title?: ReactNode;
  headers: string[];
  contacts: Array<any>;
  total: number;
  onChangePage?: (page: number) => void;
  allowEdit?: boolean;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  isEditing?: boolean;

  showFinished?: boolean;
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
  isEditing = false,
  showFinished = false,
}: TableContactsProps) {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    onChangePage && onChangePage(newPage);
  };

  const mapHeaders = (header?: string) => {
    if (header == 'status') return 'Status';
    if (header == 'sentDate') return 'Data de envio';
    return header;
  };

  const statusNotAllowed = ['ENVIADO', 'ERRO'];

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
            {headers.map((row) => {
              if (row === 'sentDate' && !showFinished) return null;
              return <TableCell key={row}>{mapHeaders(row)}</TableCell>;
            })}

            {allowEdit && <TableCell align="right">Ações</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts?.map((row: any, i) => (
            <TableRow
              key={i}
              style={{
                backgroundColor:
                  !statusNotAllowed.includes(row['status']) || !isEditing
                    ? 'white'
                    : '#eeeeee',
                cursor:
                  !statusNotAllowed.includes(row['status']) || !isEditing
                    ? 'default'
                    : 'not-allowed',
              }}
            >
              {headers.map((item, k) => {
                if (item == 'sentDate' && !showFinished) return null;

                if (item == 'sentDate')
                  return (
                    <TableCell key={k}>
                      {tableFormatDateTime(row[item])}
                    </TableCell>
                  );

                return <TableCell key={k}>{row[item]}</TableCell>;
              })}
              {allowEdit && (
                <TableCell align="right">
                  <Box>
                    <Button
                      variant="contained"
                      title="Editar"
                      sx={{ mr: 2 }}
                      onClick={() => onEdit && onEdit(i)}
                      disabled={
                        statusNotAllowed.includes(row['status']) && isEditing
                      }
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant={'contained'}
                      color={'error'}
                      title={'Remover'}
                      onClick={() => onDelete && onDelete(i)}
                      disabled={
                        statusNotAllowed.includes(row['status']) && isEditing
                      }
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
        rowsPerPage={TABLE_CONTACTS_SIZE}
        page={page}
        onPageChange={handleChangePage}
        showFirstButton
        showLastButton
      />
    </TableContainer>
  );
}
