import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { queryClient } from '../../../main';
import { API_URLS } from '../../../utils/constants';

interface QrCodeViewProps {
  channelId: string;
}

export default function QrCodeView({ channelId }: QrCodeViewProps) {
  const [qrCode, setQrCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const qrCodeRefreshTime = 60 * 1000; // 40 seconds
  const statusRefreshTime = 10 * 2000; // 4 seconds

  function invalidateChannelQuery() {
    queryClient.invalidateQueries([API_URLS.CHANNELS.BASE, 'GET']);
  }

  useEffect(() => {
    let timer: number;
    let qrCodeTimer: number | undefined = undefined;

    if (isConnected) return;

    async function getStatus() {
      const result = await api.get(`/channels/get-status/${channelId}`);

      if (result.data.state == 'connected') {
        clearInterval(timer);
        clearInterval(qrCodeTimer);
        setQrCode('');
        setIsConnected(true);
        invalidateChannelQuery();
        return true;
      }
    }

    async function getQrCode() {
      setIsLoading(true);
      try {
        const result = await api.get(`/channels/get-qrcode/${channelId}`);

        if (result.data.state != 'connected') {
          setQrCode('data:image/webp;base64,' + result.data.base64);
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
      // i know this is ugly, but ill refactor later
      (async () => {
        const result = await getStatus();
        if (!!result) {
          setIsLoading(false);
          return;
        }
        await getQrCode();
      })();
    }

    qrCodeTimer = setInterval(getQrCode, qrCodeRefreshTime);

    return () => {
      clearInterval(timer);
      clearInterval(qrCodeTimer);
    };
  }, [isConnected]);

  async function handleDisconnect() {
    try {
      await api.get(`/channels/disconnect/${channelId}`);

      setIsConnected(false);
      invalidateChannelQuery();
    } catch (error) {
      toast.error('Erro ao desconectar instância');
    }
  }

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
              <br />
              <Button
                color="error"
                onClick={handleDisconnect}
                variant="outlined"
              >
                Desconectar instância
              </Button>
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
