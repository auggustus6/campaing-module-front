import { ContentType } from "../models/message";

export type FileDialogProps = {
  type: ContentType;
};

export async function fileDialog({ type }:FileDialogProps ): Promise<File> {
  const input = document.createElement('input');
  input.type = 'file';
  switch (type) {
    case 'IMAGE_BASE64':
      input.accept = 'image/*';
      break;
    case 'VIDEO_BASE64':
      input.accept = 'video/*';
      break;
    case 'AUDIO_BASE64':
      input.accept = 'audio/*';
      break;
    case 'DOCUMENT_BASE64':
      input.accept = 'application/pdf';
      break;
  }
  input.click();
  return new Promise((resolve, reject) => {
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        resolve(input.files[0]);
      } else {
        reject();
      }
    };
  });
}
