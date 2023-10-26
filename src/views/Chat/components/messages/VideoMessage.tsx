import { Box, Typography } from '@mui/material';
import { MessageType } from '../../../../models/message';
import React, { useEffect, useState } from 'react';
import { getTime } from '../../../../utils/dateAndTimeUtils';
import Show from '../../../../components/MetaComponents/Show';
import MidiaModal from '../../modals/MidiaModal';
import { PlayArrow, PlayCircle } from '@mui/icons-material';

type Props = {
  type: MessageType;
  srcUrl?: string;
  src64?: string;
  sentAt: string;
  text?: string;
};

export function VideoMessage({ type, srcUrl, text, sentAt, src64 }: Props) {
  const videoRef = React.createRef<HTMLVideoElement>();
  const videoSrc = src64 ? `data:video/mp4;base64,${src64}` : srcUrl;
  const maxWidth = 200;
  const [videoWidth, setVideoWidth] = useState<number>(maxWidth);

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // useEffect(() => {
  //   const video = document.createElement("video");
  //   const canvas = document.createElement("canvas");
  //   let thumbnail = "";

  //   canvas.width = 90;
  //   canvas.height = 90;
  //   const canvasContext = canvas.getContext("2d");
  //   canvasContext?.drawImage(video, 0, 0, 90, 90);
  //   thumbnail = canvas.toDataURL("image/png");

  //   const img = new Image();
  //   img.src = videoSrc!;
  //   img.onload = () => {
  //     if (img.width <= maxWidth) {
  //       setVideoWidth(maxWidth);
  //       return;
  //     }

  //     const aspectRatio = img.width / img.height;
  //     setVideoWidth(Math.floor(aspectRatio * maxWidth));
  //   };
  // }, []);

  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
    >
      <Show when={isVideoOpen}>
        <MidiaModal
          onClose={() => setIsVideoOpen(false)}
          text={text}
          content={
            <video
              src={videoSrc}
              autoPlay
              controls
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
        // maxWidth={videoWidth}
        // width={'100%'}
      >
        {/* VIDEO */}
        <Box
          onClick={() => setIsVideoOpen(true)}
          position="relative"
          sx={{
            cursor: 'pointer',
            ['&:hover']: {
              opacity: 0.9,
            },
          }}
        >
          <Box
            component={'video'}
            ref={videoRef}
            draggable={false}
            src={videoSrc}
            sx={{
              maxWidth: `${maxWidth}px`,
              width: '100%',
              maxHeight: '500px',
              borderRadius: '6px',
              objectFit: 'contain',
            }}
          />
          <PlayCircle
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '3rem',
            }}
          />
        </Box>
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
    </Box>
  );
}
