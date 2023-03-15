import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import { useState } from 'react';


export default function TableContactsFromFile({
  id,
  header,
  contacts,
}: {
  id?: string;
  header: string[];
  contacts: Array<any>;
}) {
  const [page, setPage] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((row) => (
              <TableCell key={row}>{row}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts?.slice(page * 5, page * 5 + 5).map((row: any, i) => (
            <TableRow key={i}>
              {Object.keys(row)?.map((item, k) => (
                <TableCell key={k}>{row[item]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={contacts.length}
        rowsPerPage={5}
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  );
}
