import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import ErrorIcon from '@mui/icons-material/Error';

// function pick

export default function StatusLabel({ status }: { status: string }) {
  switch (status) {
    case 'CANCELADO':
      return (
        <span style={{ color: '#ff7167', display: 'flex', gap: '4px' }}>
          <CancelScheduleSendIcon />
          {status}
        </span>
      );
    case 'PAUSADO':
      return (
        <span style={{ color: '#2cabff', display: 'flex', gap: '4px' }}>
          <PauseCircleFilledIcon />
          {status}
        </span>
      );
    case 'EM_PROGRESSO':
      return (
        <span style={{ color: '#3ac770', display: 'flex', gap: '4px' }}>
          <ForwardToInboxIcon />
          {status}
        </span>
      );
    case 'CONCLUIDO':
      return (
        <span style={{ color: '#2cabff', display: 'flex', gap: '4px' }}>
          <DoneAllIcon />
          {status}
        </span>
      );
    case 'INICIAR':
      return (
        <span style={{ color: '#e252f5', display: 'flex', gap: '4px' }}>
          <PlayCircleIcon />
          {status}
        </span>
      );
    case 'PAUSE_AUTOMATIC':
      return (
        <span style={{ color: '#9d21d6' }}>
          <SettingsEthernetIcon />
          {status}
        </span>
      );
    case 'ERRO':
      return (
        <span style={{ color: '#ff2d1e', display: 'flex', gap: '4px' }}>
          <ErrorIcon />
          {status}
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}
