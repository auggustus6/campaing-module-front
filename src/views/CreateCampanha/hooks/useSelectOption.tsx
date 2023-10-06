import { SelectChangeEvent } from '@mui/material';

type Props = {
  caretPosition: number;
  message?: string;
  setMessage: (message: string) => void;
};

export default function useSelectOption({ caretPosition, message, setMessage }: Props) {
  function handleSelectOption(e: SelectChangeEvent<string>) {
    const messageContent = message || '';
    let messageFirstPart = messageContent.substring(0, caretPosition);
    let messageLastPart = messageContent.substring(caretPosition);
    if (messageFirstPart[messageFirstPart.length - 1] !== ' ') {
      messageFirstPart = messageFirstPart + ' ';
    }
    if (messageLastPart[0] !== ' ') {
      messageLastPart = ' ' + messageLastPart;
    }
    setMessage(messageFirstPart + `{{${e.target.value}}}` + messageLastPart);
    const messageInput = document.getElementById(
      'messageTextArea'
    ) as HTMLTextAreaElement;

    setTimeout(() => {
      messageInput?.focus();
      let pos = caretPosition + e.target.value.length + 6;

      messageInput?.setSelectionRange(pos, pos);
    }, 100);
  }

  return { handleSelectOption };
}
