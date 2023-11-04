import { Add, Circle, KeyboardArrowDown, PlusOne } from '@mui/icons-material';
import { FormControl, IconButton, Select, Option } from '@mui/joy';
import { Box, Typography } from '@mui/material';
import React, { createRef, useEffect, useState } from 'react';
import { useChatModals } from '../logic/useChatModals';
import { useChats } from '../logic/useChats';
import useCompany from '../../../hooks/querys/useCompany';
import { getTwoFirstLetters } from '../../../utils/stringUtils';
import useChannels from '../../../hooks/querys/useChannels';
import { Channel } from '../../../models/channel';
import { searchStore } from '../logic/useSearchStore';

export function ChatHeader() {
  const { openChatModal } = useChatModals();
  const { data: company } = useCompany();
  const [chatSearch, setChatSearch] = searchStore((state) => [
    state.chatSearch,
    state.setChatSearch,
  ]);

  const [lastChannelSelected, setLastChannelSelected] = useState<string | null>(
    null
  );

  const {
    data: channels,
    isLoading: isChannelsLoading,
    isSuccess: isChannelsSuccess,
  } = useChannels();
  const { store } = useChats();

  const setSelectedChatId = store((state) => state.setSelectedChatId);

  const [selectedChannel, setSelectedChannel] = store((state) => [
    state.selectedChannel,
    state.setSelectedChannel,
  ]);

  const companyInitialLetters = getTwoFirstLetters(company?.name);

  const shouldDisable = isChannelsLoading || !company;

  function handleChannelSelect(e: any, id: string | null) {
    if (!id) return;

    setSelectedChannel(channels?.find((channel) => channel.id === id) || null);
    setSelectedChatId(null);
    localStorage.setItem('lastChannelSelected', id);
  }

  useEffect(() => {
    if (!isChannelsSuccess) return;
    if (!channels) return;
    if (!channels.length) return;
    setSelectedChannel(
      channels.find((channel) => channel.id === lastChannelSelected) || null
    );
  }, [isChannelsSuccess, lastChannelSelected]);

  
  useEffect(() => {
    if (!channels) return;
    const lastChannel = localStorage.getItem('lastChannelSelected');
    console.log('lastChannel', lastChannel);
    
    setLastChannelSelected(lastChannel);
  }, [channels]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #8e2ce1 0%, #4b00df 100%)',
        p: '1rem',
        height: '80px',
      }}
      display={'flex'}
      gap={'1rem'}
      color={'white'}
      alignItems={'center'}
    >
      <Box
        sx={{
          background: '#e51c3f',
          height: '3rem',
          width: '3rem',
          borderRadius: '5px',
          display: 'grid',
          placeItems: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        {companyInitialLetters}
      </Box>
      <Box
        display={'flex'}
        flex={1}
        flexDirection={'column'}
        justifyContent={'center'}
      >
        {/* <p>{company?.name}</p> */}
        <Box pr={4} display={'flex'} gap={1} alignItems={'center'}>
          <FormControl sx={{ flex: 1, maxWidth: '12rem' }}>
            <Select
              value={selectedChannel?.id}
              onChange={handleChannelSelect}
              disabled={shouldDisable}
              indicator={<KeyboardArrowDown />}
            >
              {channels?.map((option) => (
                <Option
                  value={option.id}
                  key={option.id}
                  sx={{
                    color: option.state === 'connected' ? 'green' : 'initial',
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '12rem',
                  }}
                >
                  {option.instanceName}
                  <Circle
                    color={option?.state === 'connected' ? 'success' : 'error'}
                  />
                </Option>
              ))}
            </Select>
          </FormControl>
          <Circle
            color={selectedChannel?.state === 'connected' ? 'success' : 'error'}
          />
        </Box>
        {/* <Typography display={'flex'} alignItems={'center'} gap={1}>
          online <Circle color="success" fontSize={'small'} />
        </Typography> */}
      </Box>
      <Box>
        <IconButton
          sx={{ bgcolor: 'white' }}
          onClick={() => openChatModal('newService')}
        >
          <Add />
        </IconButton>
      </Box>
    </Box>
  );
}
