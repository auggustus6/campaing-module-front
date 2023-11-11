// import { Clear, Search } from '@mui/icons-material';
// import DefaultInput from '../../../../components/Inputs/DefaultInput';
// import { searchStore } from '../../logic/useSearchStore';
// import Show from '../../../../components/MetaComponents/Show';
// import { IconButton } from '@mui/material';
// import { useChats } from '../../logic/useChats';

import { IconButton } from '@mui/material';
import DefaultInput from '../../../../components/Inputs/DefaultInput';
import Show from '../../../../components/MetaComponents/Show';
import { useChats } from '../../logic/useChats';
import { searchStore } from '../../logic/useSearchStore';
import { Clear, Search } from '@mui/icons-material';

export function SearchInput() {
  const { store } = useChats();
  const chats = store((state) => state.chats);
  const [chatSearch, setChatSearch] = searchStore((state) => [
    state.chatSearch,
    state.setChatSearch,
  ]);

  return (
    <DefaultInput
      sx={{ p: 0, margin: 0 }}
      variant="standard"
      name="contacts-search"
      value={chatSearch}
      onChange={(e) => setChatSearch(e.target.value)}
      placeholder="Pesquisar uma conversa"
      disabled={!chats.length}
      InputProps={{
        endAdornment: (
          <Show when={!!chatSearch} fallback={<Search />}>
            <IconButton onClick={() => setChatSearch('')} size="small">
              <Clear fontSize="small" />
            </IconButton>
          </Show>
        ),
        sx: {
          py: 1,
          px: 2,
        },
      }}
    />
  );
}
