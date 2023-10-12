import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import {MessageItem} from './MessageItem';

export  function Messages() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.scrollTop = container.current.scrollHeight;
    return () => {};
  }, [container]);

  return (
    <Box
      flex={1}
      display={'flex'}
      flexDirection={'column'}
      gap={2}
      px={4}
      py={2}
      overflow={'scroll'}
      sx={{
        '&::-webkit-scrollbar-thumb': {
          borderRadius: 0,
        },
      }}
      ref={container}
    >
      {new Array(10).fill(0).map((_, i) => (
        <React.Fragment key={i}>
          <MessageItem
            type={i % 3 == 0 ? 'received' : 'sent'}
            sentAt={new Date()}
            text="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam explicabo
        qui tempore expedita cupiditate earum quidem reprehenderit accusantium
        et sint eius, deserunt non dignissimos laborum ipsam magni, nisi
        doloremque rerum?"
          />
        </React.Fragment>
      ))}
    </Box>
  );
}
