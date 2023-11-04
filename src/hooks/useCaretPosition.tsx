import { useEffect, useState } from "react";

type Props = {
  id: string;
}

export default function useCaretPosition({ id }: Props) {
  const [caretPosition, setCaretPosition] = useState(0);
  useEffect(() => {
    const messageInput = document.getElementById(id);

    function getCaretPosition(e: any) {
      setCaretPosition(() => e.target?.selectionStart || 0);
    }

    messageInput?.addEventListener('click', getCaretPosition);
    messageInput?.addEventListener('blur', getCaretPosition);
    messageInput?.addEventListener('keyup', getCaretPosition);

    return () => {
      messageInput?.removeEventListener('click', getCaretPosition);
      messageInput?.removeEventListener('blur', getCaretPosition);
      messageInput?.removeEventListener('keyup', getCaretPosition);
    };
  }, []);

  return { caretPosition };
}
