import { Box, Typography } from '@mui/material';
import { MessageType } from '../../../../models/message';
import React, { useEffect, useState } from 'react';
import { getTime } from '../../../../utils/dateAndTimeUtils';
import Show from '../../../../components/MetaComponents/Show';
import MidiaModal from '../../modals/MidiaModal';
import { BrokenImage, BrokenImageOutlined } from '@mui/icons-material';

type Props = {
  type: MessageType;
  srcUrl?: string;
  src64?: string;
  sentAt: string;
  text?: string;
};

export function ImageMessage({ type, srcUrl, text, sentAt, src64 }: Props) {
  const imageRef = React.createRef<HTMLImageElement>();
  const imageSrc = src64 ? `data:image/png;base64,${src64}` : srcUrl;
  const maxWidth = 330;
  const [imageWidth, setImageWidth] = useState<number>(maxWidth);

  const [isImageOpen, setIsImageOpen] = useState(false);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc!;
    img.onload = () => {
      if (img.width <= maxWidth) {
        return setImageWidth(maxWidth);
      }
      if (img.width >= img.height) {
        if (img.width > maxWidth) {
          return setImageWidth(maxWidth);
        } else {
          return setImageWidth(img.width);
        }
      }

      const aspectRatio = img.width / img.height;
      setImageWidth(Math.floor(aspectRatio * maxWidth));
    };
    img.onerror = () => {
      setIsError(true);
      setImageWidth(200);
    };
  }, []);

  return (
    <>
      <Show when={isImageOpen}>
        <MidiaModal
          onClose={() => setIsImageOpen(false)}
          text={text}
          content={
            <img
              src={imageSrc}
              style={{
                maxWidth: '80vw',
                maxHeight: '80vh',
              }}
            />
          }
        />
      </Show>
      <Box
        display={'flex'}
        flexDirection={'column'}
        borderRadius={2}
        overflow={'hidden'}
        position={'relative'}
        p={0.3}
        bgcolor={type === 'RECEIVED' ? 'white' : '#4b00df'}
        border="1px solid #dfdfdf"
        maxWidth={imageWidth}
        width={'100%'}
      >
        {/* IMAGE */}
        <Show when={isError}>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <BrokenImageOutlined
              sx={{
                fontSize: '6rem',
                color: type === 'RECEIVED' ? '#8b8b8b' : 'white',
              }}
            />
          </Box>
        </Show>
        <Show when={!isError}>
          <Box
            onClick={() => setIsImageOpen(true)}
            component={'img'}
            ref={imageRef}
            draggable={false}
            src={imageSrc}
            sx={{
              maxWidth: `${maxWidth}px`,
              width: '100%',
              maxHeight: '500px',
              borderRadius: '6px',
              objectFit: 'contain',
              cursor: 'pointer',
              ['&:hover']: {
                opacity: 0.9,
              },
            }}
          />
        </Show>
        <Show when={!!text}>
          <Typography
            p={1}
            pr={3}
            color={type === 'RECEIVED' ? 'initial' : 'white'}
          >
            {text}
          </Typography>
        </Show>
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 4,
            fontSize: '0.7rem',
            color: type === 'RECEIVED' && !!text ? '#8b8b8b' : '#f0f0f0',
          }}
        >
          {getTime(sentAt)}
        </Box>
      </Box>
    </>
  );
}
