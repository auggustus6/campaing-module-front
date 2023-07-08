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
import api from '../../../../services/api';
import moment from 'moment';
import { useState } from 'react';
import StatusLabel from '../StatusLabel';

export type Order = 'asc' | 'desc';

export interface Data {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  scheduleDate: string;
  status: string;
  sendDelay: string;
  sentContactsCount: number;
  isDeleted: boolean;
  _count: {
    contacts: number;
  };
}

export default function TableCampaign() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [showDeleted, setShowDeleted] = useState(false);

  const [lengthItems, setLengthItems] = useState(0);

  const { data } = useQuery(
    ['campaign', page, showDeleted],
    async () => {
      const result = await api.get(
        `/campaign?page=${page}&list_deleted=${showDeleted}`
      );

      setLengthItems(result.data.total || 0);

      return result;
    },
    { staleTime: 1000 * 4 } //60 seconds
  );

  const formatDate = (date?: string) => {
    if (date) return moment(date).format('DD/MM/YYYY - HH:mm');
    else return '- - - - - - - - - - - - - -';
  };

  const selectedCampaign = data?.data?.result?.filter(
    (item: any) => item.id === selected[0]
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

  const clearSelected = () => {
    setSelected([]);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selectedItem={selected}
          setSelectedItem={setSelected}
          showDeleted={showDeleted}
          setShowDeleted={setShowDeleted}
          campaign={selectedCampaign}
          clearSelected={clearSelected}
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
                    sx={{
                      cursor: 'pointer',
                      background: row.isDeleted ? '#ffd0d0' : 'initial',
                      '&:hover': {
                        background: row.isDeleted
                          ? '#fab2b2 !important'
                          : 'initial',
                      },
                    }}
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
                      {row.id.slice(0, 10) + '...'}
                    </TableCell>
                    <TableCell align="left">{row.title}</TableCell>
                    <TableCell align="left">
                      {formatDate(row.scheduleDate)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDate(row.startDate)}
                    </TableCell>
                    <TableCell align="left">
                      {formatDate(row.endDate)}
                    </TableCell>
                    <TableCell>{row.sendDelay}</TableCell>
                    <TableCell>
                      <span style={{ color: 'green', fontWeight: 600 }}>
                        {row.sentContactsCount}
                      </span>{' '}
                      / <span>{row._count.contacts}</span>
                    </TableCell>
                    <TableCell align="left">
                      <StatusLabel status={row.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={lengthItems}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
