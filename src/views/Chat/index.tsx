import { Circle, MoreVert, Search, Send } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import DefaultInput from '../../components/Inputs/DefaultInput';

import ChatHeader from './components/ChatHeader';
import MessagesList from './components/MessagesList';
import SearchInput from './components/SearchInput';
import ContentHeader from './components/ContentHeader';
import Messages from './components/Messages';
import SendMessage from './components/SendMessage';
import NewServiceModal from './modals/NewServiceModal';

export default function ChatView() {
  return (
    <Box
      display={'grid'}
      gridTemplateColumns={'1fr 3fr'}
      height={'100%'}
      borderRadius={1}
      overflow={'hidden'}
      boxShadow={'0px 0px 10px rgba(0,0,0,0.1)'}
    >
      <NewServiceModal />
      <Box
        sx={{
          height: '84vh',
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatHeader />
        <SearchInput />
        <MessagesList />
      NewServiceModal</Box>
      <Box
        sx={{
          background: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          height: '84vh',
          maxHeight: '84vh',
        }}
      >
        <ContentHeader />
        <Messages />
        <SendMessage />
      </Box>
    </Box>
  );
}
