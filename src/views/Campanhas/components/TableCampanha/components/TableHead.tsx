import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import KeyIcon from '@mui/icons-material/Key';
import AbcIcon from '@mui/icons-material/Abc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AlarmAddIcon from '@mui/icons-material/AlarmAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import InfoIcon from '@mui/icons-material/Info';

import { Typography } from '@mui/joy';
import { AlarmOff } from '@mui/icons-material';

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'id',
    Icon: KeyIcon,
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Titulo',
    Icon: AbcIcon,
  },
  {
    id: 'schedule-date',
    numeric: false,
    disablePadding: false,
    label: 'Data Agendada',
    Icon: CalendarMonthIcon,
  },
  {
    id: 'start-time',
    numeric: false,
    disablePadding: false,
    label: 'Horas de Início',
    Icon: AlarmAddIcon,
  },
  {
    id: 'end-time',
    numeric: false,
    disablePadding: false,
    label: 'Horas de Término',
    Icon: AlarmOff,
  },
  {
    id: 'end-date',
    numeric: false,
    disablePadding: false,
    label: 'Data de Término',
    Icon: EventAvailableIcon,
  },
  {
    id: 'delay',
    numeric: false,
    disablePadding: false,
    label: 'Delay',
    Icon: HourglassBottomIcon,
  },
  {
    id: 'sentContacts',
    numeric: true,
    disablePadding: false,
    label: 'Contatos Enviados',
    Icon: MarkEmailReadIcon,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
    Icon: InfoIcon,
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
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                svg: {
                  fontSize: '1rem',
                },
              }}
            >
              {headCell.label} <headCell.Icon />
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
