import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import ErrorIcon from '@mui/icons-material/Error';
import { DoNotDisturb } from '@mui/icons-material';


export default function StatusLabel({ status }: { status: string }) {
  const commonStyles = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  };

  switch (status) {
    case 'CANCELADO':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#ff7167',
          }}
        >
          <CancelScheduleSendIcon />
          {status}
        </span>
      );
    case 'PAUSADO':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#2cabff',
          }}
        >
          <PauseCircleFilledIcon />
          {status}
        </span>
      );
    case 'EM_PROGRESSO':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#3ac770',
          }}
        >
          <ForwardToInboxIcon />
          {status}
        </span>
      );
    case 'CONCLUIDO':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#2cabff',
          }}
        >
          <DoneAllIcon />
          {status}
        </span>
      );
    case 'INICIAR':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#e252f5',
          }}
        >
          <PlayCircleIcon />
          {status}
        </span>
      );
    case 'PAUSE_AUTOMATIC':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#9d21d6',
          }}
        >
          <SettingsEthernetIcon />
          {status}
        </span>
      );
    case 'ERRO':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#ff2d1e',
          }}
        >
          <ErrorIcon />
          {status}
        </span>
      );
    case 'CHANNEL_DISCONNECTED':
      return (
        <span
          style={{
            ...commonStyles,
            color: '#ff2d1e',
          }}
        >
          <DoNotDisturb />
          {status}
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}
