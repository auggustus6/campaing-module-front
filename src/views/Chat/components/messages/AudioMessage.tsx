import React, { useEffect, useState } from 'react';
import { MessageType } from '../../../../models/message';
import { Box, Slider, Typography } from '@mui/material';
import {
  getSecondsFromNumber,
  getTime,
} from '../../../../utils/dateAndTimeUtils';
import ReactAudioPlayer from 'react-audio-player';
import Show from '../../../../components/MetaComponents/Show';
import { Pause, PlayCircle } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

type Props = {
  type: MessageType;
  srcUrl?: string;
  src64?: string;
  sentAt: string;
};

export function AudioMessage({ type, srcUrl, sentAt, src64 }: Props) {
  const audioSrc = src64 ? `data:audio/ogg;base64,${src64}` : srcUrl;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.createRef<HTMLAudioElement>();

  const percent = (currentTime / duration) * 100;

  function play() {
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function onSliderTimeChange(e: any, value: number | number[]) {
    const time = (Number(value) * duration) / 100;

    audioRef.current!.currentTime = time;
  }

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = new Audio(audioSrc!);

    audio.addEventListener('loadedmetadata', () => {
      console.log('audio', audio.duration);
      setDuration(audio.duration);
    });
  }, [audioRef.current]);

  console.log('duration, currentTime', duration, currentTime);

  return (
    <Box
      display={'flex'}
      justifyContent={type === 'RECEIVED' ? 'start' : 'end'}
    >
      <Box
        sx={{
          width: '300px',
          height: '60px',
          position: 'relative',
          borderRadius: 2,
          p: 1,
          bgcolor: type === 'RECEIVED' ? 'white' : '#4b00df',
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #dfdfdf',
          gap: 2,
        }}
      >
        <audio
          src={audioSrc}
          ref={audioRef}
          onPlay={() => play()}
          onPause={() => pause()}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        />
        <Show
          when={!isPlaying}
          fallback={
            <IconButton
              onClick={pause}
              sx={{
                color: type === 'RECEIVED' ? '#8e2ce1' : 'white',
                ['&:hover>svg']: {
                  color: type === 'RECEIVED' ? '#8e2ce1' : '#8e2ce1',
                },
              }}
            >
              <Pause
                sx={{
                  color: type === 'RECEIVED' ? '#8e2ce1' : 'white',
                }}
              />
            </IconButton>
          }
        >
          <IconButton
            onClick={play}
            sx={{
              color: type === 'RECEIVED' ? '#8e2ce1' : 'white',
              ['&:hover>svg']: {
                color: type === 'RECEIVED' ? '#8e2ce1' : '#8e2ce1',
              },
            }}
          >
            <PlayCircle
              id="iconlol"
              sx={{
                color: type === 'RECEIVED' ? 'initial' : 'white',
              }}
            />
          </IconButton>
        </Show>
        <Slider
          value={percent}
          onChange={onSliderTimeChange}
          sx={{
            color: type === 'RECEIVED' ? '#8e2ce1' : 'white',
          }}
        />
        <Typography
          variant={'caption'}
          sx={{
            color: type === 'RECEIVED' ? 'initial' : 'white',
          }}
        >
          {getSecondsFromNumber(duration - currentTime)}
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            bottom: 2,
            right: 4,
            fontSize: '0.7rem',
            color: type === 'RECEIVED' ? '#8b8b8b' : 'white',
          }}
        >
          {getTime(sentAt)}
        </Box>
      </Box>
    </Box>
  );
}
