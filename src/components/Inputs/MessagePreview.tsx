import { Grid, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PreviewWppMessage from '../PreviewWppMessage';
import { fileToBase64 } from '../../utils/fileUtils';

type Props = {
  imgSrc?: string | FileList;
  text?: string;
  // files?:  | null;
};

export default function MessagePreview({ imgSrc, text }: Props) {
  const [file, setFile] = useState<string | undefined>();

  useEffect(() => {
    async function convert() {
      console.log(imgSrc instanceof FileList);
      if (imgSrc instanceof FileList && imgSrc.length > 0) {
        const content = await fileToBase64(imgSrc[0]);
        console.log('content', content);
        return setFile(content);
      } else if (typeof imgSrc === 'string') {
        return setFile(imgSrc);
      }
      setFile(undefined);
    }
    convert();
  }, [imgSrc]);

  return (
    <Grid item xs={12} sx={{ marginBottom: 2 }}>
      <InputLabel>Preview da mensagem:</InputLabel>
      <PreviewWppMessage imgSrc={file} messagePreview={text} />
    </Grid>
  );
}
