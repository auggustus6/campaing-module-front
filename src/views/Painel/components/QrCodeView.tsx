import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

interface QrCodeViewProps {
  channelId: string;
}

export default function QrCodeView({ channelId }: QrCodeViewProps) {
  const [qrCode, setQrCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const qrCodeRefreshTime = 60 * 1000; // 40 seconds
  const statusRefreshTime = 10 * 1000; // 4 seconds

  useEffect(() => {
    let timer: number;
    let qrCodeTimer: number | undefined = undefined;

    async function getStatus() {
      const result = await api.get(`/channels/get-status/${channelId}`);

      if (result.data == 'connected') {
        clearInterval(timer);
        clearInterval(qrCodeTimer);
        setQrCode('');
        setIsConnected(true);
      }
    }

    async function getQrCode() {
      setIsLoading(true);
      try {
        const result = await api.get(`/channels/get-qrcode/${channelId}`);
        if (result.data.state != 'connected') {
          setQrCode('data:image/webp;base64,' + result.data.qrCode);
          timer = setInterval(getStatus, statusRefreshTime);
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    if (qrCodeTimer == undefined) {
      getQrCode();
    }

    qrCodeTimer = setInterval(getQrCode, qrCodeRefreshTime);

    return () => {
      clearInterval(timer);
      clearInterval(qrCodeTimer);
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
      }}
    >
      {(() => {
        if (isLoading)
          return (
            <Box textAlign={'center'}>
              <CircularProgress />
            </Box>
          );

        if (!isConnected && qrCode) {
          return (
            <>
              <img
                src={qrCode}
                style={{
                  width: '100%',
                  maxHeight: '25rem',
                  objectFit: 'contain',
                  aspectRatio: 1,
                }}
                height={'auto'}
              />
              <Typography textAlign={'center'} variant="h5">
                Escaneie o Codigo
              </Typography>
            </>
          );
        }

        if (isConnected) {
          return (
            <Typography textAlign={'center'} variant="h5" color={'green'}>
              <b>Status: </b>
              Conectado!
            </Typography>
          );
        }

        return (
          <Typography textAlign={'center'} variant="h5" color={'red'}>
            <b>Status: </b>
            Erro ao carregar o QR Code! Feche esta janela e tente novamente mais
            tarde.
          </Typography>
        );
      })()}
    </Box>
  );
}
