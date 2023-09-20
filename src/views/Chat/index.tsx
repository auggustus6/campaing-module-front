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
import { IconButton } from '@mui/joy';

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
      <Box
        sx={{
          height: '84vh',
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(180deg, #8e2ce1 0%, #4b00df 100%)',
            p: '1rem',
            height: '80px',
          }}
          display={'flex'}
          gap={'1rem'}
          color={'white'}
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
            ID
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <p>Idw Soluções</p>
            <Typography display={'flex'} alignItems={'center'} gap={1}>
              online <Circle color="success" fontSize={'small'} />
            </Typography>
          </Box>
        </Box>
        <Box>
          <DefaultInput
            sx={{ p: 0, margin: 0 }}
            variant="standard"
            placeholder="Pesquisar ou começar uma nova conversa"
            InputProps={{
              endAdornment: <Search />,
              sx: {
                py: 1,
                px: 2,
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'scroll',
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 0,
            },
          }}
        >
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {new Array(30).fill(0).map((_, i) => (
              <ListItem
                alignItems="flex-start"
                key={i}
                sx={{
                  '&+&': {
                    borderTop: '1px solid #ececec',
                  },
                  '&:hover': {
                    background: '#f3f3f3',
                    cursor: 'pointer',
                  },
                  px: 2,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Chris coy"
                  secondary={
                    <>{"I'll be in your neighborhood doing errands this…"}</>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        sx={{
          background: '#f7f7f7',
          display: 'flex',
          flexDirection: 'column',
          height: '84vh',
          maxHeight: '84vh',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          bgcolor={'white'}
          borderBottom={'1px solid #dfdfdf'}
          p={4}
          height={'80px'}
        >
          <Box display={'flex'} alignItems={'center'}>
            <Avatar
              alt="Remy Sharp"
              src="https://love.doghero.com.br/wp-content/uploads/2019/09/Corgi-1.jpg-1.jpg"
            />
            <Typography ml={2} fontWeight={'bold'}>
              Chris Coy
            </Typography>
          </Box>
          <Box display={'flex'} gap={2}>
            <IconButton>
              <Search />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
        <Box
          flex={1}
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          px={2}
          overflow={'scroll'}
          sx={{
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 0,
            },
          }}
        >
          {new Array(10).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <Box py={1} />
              <Box display={'flex'} justifyContent={i % 3 ? 'start' : 'end'}>
                <Box
                  // bgcolor={'white'}
                  bgcolor={i % 3 ? 'white' : '#4b00df'}
                  pl={2}
                  pr={6}
                  borderRadius={2}
                  py={2}
                  textAlign={'start'}
                  // boxShadow={'0px 0px 3px rgba(0,0,0,0.1)'}
                  border={'1px solid #dfdfdf'}
                  maxWidth={'50%'}
                  color={i % 3 ? '#333333' : 'white'}
                >
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam
                  explicabo qui tempore expedita cupiditate earum quidem
                  reprehenderit accusantium et sint eius, deserunt non
                  dignissimos laborum ipsam magni, nisi doloremque rerum?
                </Box>
              </Box>
            </React.Fragment>
          ))}
        </Box>
        <Box p={4}>
          <DefaultInput
            sx={{ p: 0, margin: 0, bgcolor: 'white' }}
            // variant="standard"
            placeholder="Digite uma mensagem"
            InputProps={{
              endAdornment: (
                <IconButton>
                  <Send />
                </IconButton>
              ),
              sx: {
                py: 1,
                px: 2,
                '&:hover': {
                  outline: 'none',
                  border: 'none',
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
