import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';

import { Typography } from '@mui/joy';

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'id',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Titulo',
  },
  {
    id: 'schedule-date',
    numeric: false,
    disablePadding: false,
    label: 'Data Agendada',
  },
  {
    id: 'start-date',
    numeric: false,
    disablePadding: false,
    label: 'Data de Início',
  },
  {
    id: 'end-date',
    numeric: false,
    disablePadding: false,
    label: 'Data de Término',
  },
  { id: 'delay', numeric: false, disablePadding: false, label: 'Delay' },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
];

export interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={'left'}>
            <Typography>{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
