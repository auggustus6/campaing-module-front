import { Box } from '@mui/material';
import React from 'react';

export default function Messages() {
  return (
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      px={4}
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
              reprehenderit accusantium et sint eius, deserunt non dignissimos
              laborum ipsam magni, nisi doloremque rerum?
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
}
