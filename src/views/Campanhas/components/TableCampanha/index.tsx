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

import { useMemo, useState } from 'react';
import StatusLabel from '../StatusLabel';
import {
  getTimeFromMinutes,
  tableFormatDate,
  tableFormatDateTime,
} from '../../../../utils/dateAndTimeUtils';
import useCampaigns from '../../../../hooks/querys/useCampaigns';
import { Campaign } from '../../../../models/campaign';

export default function TableCampaign() {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);

  const {data: campaigns} = useCampaigns({ page, showDeleted });

  const itemsCount = useMemo(() => {
    return campaigns?.total || 0;
  }, [campaigns]);

  const selectedCampaign = campaigns?.result?.filter(
    (item: any) => selected.includes(item.id)
  );

  const rows: Campaign[] = campaigns?.result || [];

  const handleSelectAllClick = () => {
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
              rowCount={itemsCount}
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
                      {tableFormatDate(row.scheduleDate)}
                    </TableCell>
                    <TableCell align="left">
                      {getTimeFromMinutes(row.startTime)}
                    </TableCell>
                    <TableCell align="left">
                      {getTimeFromMinutes(row.endTime)}
                    </TableCell>
                    <TableCell align="left">
                      {tableFormatDateTime(row.endDate)}
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
          count={itemsCount}
          rowsPerPage={5}
          page={page}
          onPageChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Paper>
    </Box>
  );
}
