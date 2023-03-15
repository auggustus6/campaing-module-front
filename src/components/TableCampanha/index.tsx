import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { EnhancedTableHead } from './components/TableHead';
import { EnhancedTableToolbar } from './components/Toolbar';
import { useQuery } from 'react-query';
import api from '../../services/api';
import moment from 'moment';

export type Order = 'asc' | 'desc';

export interface Data {
  id: string;
  title: string;
  startDate: string;
  finishDate: string;
  scheduleDate: string;
  status: string;
  sendDelay: string;
}

export interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

export default function TableCampaign() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);

  const formatDate = (date?: string) =>
    moment(date).format('DD/MM/YYYY - HH:mm');

  const { data } = useQuery(
    ['campaign', page],
    async () => {
      return await api.get(`/campaign?page=${page}`);
    },
    { staleTime: 1000 * 4 } //60 seconds
  );

  const rows: Data[] = data?.data?.result || [];

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selected.length === 0) {
      const newSelected = rows.map((n) => n.id);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedItem={selected}
          setSelectedItem={setSelected}
          page={page}
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data?.data.total}
            />
            <TableBody>
              {rows.map((row, index) => {
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
                    sx={{ cursor: 'pointer' }}
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
                    <TableCell align="left">{row.id.slice(0, 10)}</TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">
                      {formatDate(row.scheduleDate)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDate(row.startDate)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDate(row.finishDate)}
                    </TableCell>
                    <TableCell>{row.sendDelay}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={data?.data.total || 6}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
