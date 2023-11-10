import {
  AudioFile,
  Description,
  DocumentScannerOutlined,
  EmojiEmotions,
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
import { useChats } from '../logic/useChats';
import { ContentType, Message } from '../../../models/message';
import MidiaModal from '../modals/MidiaModal';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import i18n from '@emoji-mart/data/i18n/pt.json';

import useCaretPosition from '../../../hooks/useCaretPosition';

export function SendMessage() {
  const toast = useToast();
  const [text, setText] = useState('');
  const { caretPosition } = useCaretPosition({ id: 'sendMessageInput' });
  const { mutate, mutateAsync } = useSendMessageMutation();
  const [modalText, setModalText] = useState('');
  const [modalContent, setModalContent] = useState<{
    type: ContentType;
    content?: string;
    fileName?: string;
  } | null>(null);

  const { store } = useChats();
  const selectedChannel = store((state) => state.selectedChannel);

  const shouldDisable =
    !selectedChannel || selectedChannel.state !== 'connected';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text) return;
    mutate({ text });
    setText('');
  }

  function scrollToBottom() {
    document.querySelector('#scrollToRef')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  async function handleSendFileMessage(type: FileDialogProps['type']) {
    const file = await fileDialog({ type });
    if (!file) return;
    const midia64 = await fileToBase64(file);

    if (type == 'IMAGE_BASE64' || type == 'VIDEO_BASE64') {
      const size = file.size / 1024;
      if (size > 2000) {
        toast.error('O arquivo é muito grande, o tamanho máximo é 2MB');
        return;
      }
      setModalContent({ type: type, content: midia64, fileName: file.name });
      return;
    }

    mutateAsync({
      text: type,
      midia64: midia64,
      fileName: file.name,
      type: type,
    });
    scrollToBottom();
  }

  function handleCloseModal() {
    setModalContent(null);
    setModalText('');
  }

  async function handleSubmitMidia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutateAsync({
      text: modalText,
      midia64: modalContent?.content,
      type: modalContent?.type,
      fileName: modalContent?.fileName,
    });
    scrollToBottom();
    handleCloseModal();
  }

  function onEmojiSelect(emoji: any) {
    const start = text.slice(0, caretPosition);
    const end = text.slice(caretPosition);
    setText(start + emoji.native + end);
  }

  return (
    <Box
      p={4}
      component={'form'}
      onSubmit={handleSubmit}
      sx={{
        pointerEvents: shouldDisable ? 'none' : 'auto',
        opacity: shouldDisable ? 0.5 : 1,
        cursor: shouldDisable ? 'not-allowed' : 'auto',
      }}
    >
      <Show when={!!modalContent}>
        <MidiaModal
          onClose={handleCloseModal}
          content={
            <Box maxHeight={'90vh'} maxWidth={'100%'}>
              <Show when={modalContent?.type == 'IMAGE_BASE64'}>
                <img
                  src={modalContent?.content}
                  style={{ maxHeight: '80vh' }}
                />
              </Show>
              <Show when={modalContent?.type == 'VIDEO_BASE64'}>
                <video
                  src={modalContent?.content}
                  controls
                  style={{ maxHeight: '80vh' }}
                />
              </Show>
              <form onSubmit={handleSubmitMidia}>
                <DefaultInput
                  value={modalText}
                  sx={{ background: 'white', borderRadius: 1 }}
                  placeholder="Digite uma mensagem"
                  onChange={(e) => setModalText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit">
                        <Send />
                      </IconButton>
                    ),
                  }}
                />
              </form>
            </Box>
          }
        />
      </Show>

      <DefaultInput
        sx={{ p: 0, margin: 0, bgcolor: 'white' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite uma mensagem"
        id="sendMessageInput"
        disabled={shouldDisable}
        InputProps={{
          endAdornment: (
            <Stack direction={'row'}>
              <Dropdown>
                <MenuButton slots={{ root: IconButton }}>
                  <EmojiEmotions />
                </MenuButton>
                <Menu placement="top-end">
                  <Picker
                    data={data}
                    onEmojiSelect={onEmojiSelect}
                    i18n={i18n}
                  />
                </Menu>
              </Dropdown>
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
                        <Description sx={{ color: '#b748f7' }} />
                      </ListItemDecorator>
                      Documento
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('IMAGE_BASE64')}
                    >
                      <ListItemDecorator>
                        <Photo sx={{ color: '#4894f7' }} />
                      </ListItemDecorator>
                      Fotos
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('VIDEO_BASE64')}
                    >
                      <ListItemDecorator>
                        <VideoFile sx={{ color: '#f7486e' }} />
                      </ListItemDecorator>
                      Vídeos
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSendFileMessage('AUDIO_BASE64')}
                    >
                      <ListItemDecorator>
                        <AudioFile sx={{ color: '#f77f48' }} />
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
