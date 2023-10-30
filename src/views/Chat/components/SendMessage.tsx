import {
  AudioFile,
  Description,
  DocumentScannerOutlined,
  Photo,
  Send,
  VideoFile,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  Dropdown,
  IconButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from '@mui/joy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DefaultInput from '../../../components/Inputs/DefaultInput';
import { useState } from 'react';
import { useSendMessageMutation } from '../logic/useSendMessageMutation';
import Show from '../../../components/MetaComponents/Show';
import { FileDialogProps, fileDialog } from '../../../utils/fileDialog';
import { fileToBase64 } from '../../../utils/fileUtils';
import { useToast } from '../../../context/ToastContext';

export function SendMessage() {
  const [text, setText] = useState('');
  const { mutate, mutateAsync } = useSendMessageMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text) return;
    mutate({ text });
    setText('');
  }

  async function handleSendFileMessage(type: FileDialogProps['type']) {
    const file = await fileDialog({ type });
    if (!file) return;
    const midia64 = await fileToBase64(file);
    await mutateAsync({
      text: type,
      midia64: midia64,
      fileName: file.name,
      type: type,
    });
  }

  return (
    <Box p={4} component={'form'} onSubmit={handleSubmit}>
      <DefaultInput
        sx={{ p: 0, margin: 0, bgcolor: 'white' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite uma mensagem"
        InputProps={{
          endAdornment: (
            <Stack direction={'row'}>
              <Show when={!text}>
                <Dropdown>
                  <MenuButton slots={{ root: IconButton }}>
                    <AttachFileIcon />
                  </MenuButton>
                  <Menu placement="top-end">
                    <MenuItem
                      onClick={() => handleSendFileMessage('DOCUMENT_BASE64')}
                    >
                      <ListItemDecorator>
                        <Description sx={{color: "#b748f7"}}/>
                      </ListItemDecorator>
                      Documento
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('IMAGE_BASE64')}
                    >
                      <ListItemDecorator>
                        <Photo sx={{color: "#4894f7"}}/>
                      </ListItemDecorator>
                      Fotos
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('VIDEO_BASE64')}
                    >
                      <ListItemDecorator>
                        <VideoFile sx={{color: "#f7486e"}}/>
                      </ListItemDecorator>
                      Vídeos
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('AUDIO_BASE64')}
                    >
                      <ListItemDecorator>
                        <AudioFile sx={{color: "#f77f48"}}/>
                      </ListItemDecorator>
                      Audio
                    </MenuItem>
                  </Menu>
                </Dropdown>
              </Show>
              <Show when={!!text}>
                <IconButton type="submit">
                  <Send />
                </IconButton>
              </Show>
            </Stack>
          ),
          sx: {
            py: 1,
            px: 2,
            '&:hover': {
              outline: 'none',
              border: 'none',
            },
          },
        }}
      />
    </Box>
  );
}
