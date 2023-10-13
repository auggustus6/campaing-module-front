import {
  Modal,
  ModalClose,
  FormControl,
  Select,
  Option,
  Textarea,
} from '@mui/joy';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import DefaultInput from '../../../components/Inputs/DefaultInput';
import { Call } from '@mui/icons-material';
import InputMask from 'react-input-mask';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import ErrorLabel from '../../../components/Labels/ErrorLabel';
import useChannels from '../../../hooks/querys/useChannels';
import Show from '../../../components/MetaComponents/Show';
import { useNewChatMutation } from '../logic/useNewChatMutation';
import { NewChatSchemaType, newChatSchema } from '../schemas/newServiceSchema';
import { useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { useChats } from '../logic/useChats';

type Props = {
  onClose: () => void;
};

export default function NewChatModal({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewChatSchemaType>({
    resolver: zodResolver(newChatSchema),
  });
  const channel = watch('channel');

  const channelsQuery = useChannels();
  const toast = useToast();

  const { store } = useChats();
  const chatStore = store();

  const newChatMutation = useNewChatMutation({
    onError: (error) => {
      return toast.error('Erro ao iniciar atendimento!');
    },
    onSuccess: (data) => {
      console.log('callcreated', data);

      if (data.alreadyExists) {
        chatStore.updateChat(data.call.id, data.call);
        chatStore.setSelectedChatId(data.call.id);
        onClose();
        toast.info('Atendimento já iniciado!');
      } else {
        chatStore.setSelectedChatId(data.call.id);
        chatStore.addChat(data.call);
        onClose();
        toast.success('Atendimento iniciado com sucesso!');
      }
    },
  });

  const shouldDisable =
    !channelsQuery.data?.length ||
    newChatMutation.isLoading ||
    channelsQuery.isLoading;

  const isLoading = channelsQuery.isLoading || newChatMutation.isLoading;

  function handleChannelSelect(event: any, value: string | null) {
    if (value) {
      setValue('channel', value);
    }
  }

  function handleFormSubmit(data: NewChatSchemaType) {
    newChatMutation.mutate(data);
  }

  useEffect(() => {}, [newChatMutation.error]);

  return (
    <Modal
      open
      onClose={isLoading ? undefined : onClose}
      sx={{
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'rgba(0,0,0,0.5)',
        paddingInline: '1rem',
      }}
    >
      <Box
        sx={{
          maxWidth: '30rem',
          width: '100%',
          bgcolor: 'white',
          p: 2,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        component={'form'}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Show when={!isLoading}>
          <ModalClose />
        </Show>
        <Typography
          variant={'h6'}
          display={'flex'}
          alignItems={'center'}
          gap={1}
        >
          <Call /> Iniciar novo atendimento
        </Typography>

        <Box>
          <FormControl>
            <Select
              value={channel}
              sx={{
                border: !!errors.channel?.message ? '1px solid red' : undefined,
              }}
              onChange={handleChannelSelect}
              defaultValue={'default'}
              disabled={shouldDisable}
            >
              <Option value={'default'}>Selecione um canal</Option>
              {channelsQuery.data?.map((option) => (
                <Option value={option.id} key={option.id}>
                  {option.instanceName}
                </Option>
              ))}
            </Select>
          </FormControl>
          <ErrorLabel>{errors.channel?.message}</ErrorLabel>
        </Box>

        <FormControl>
          {/* <FormLabel
            sx={{
              color: !!errors.message?.message ? '#d32f2f' : undefined,
            }}
          >
            Mensagem
          </FormLabel> */}
          <Textarea
            minRows={3}
            maxRows={3}
            placeholder="Escreva aqui sua mensagem inicial..."
            {...register('message')}
            sx={{
              border: !!errors.message?.message ? '1px solid red' : undefined,
            }}
            disabled={shouldDisable}
          />
          <ErrorLabel>{errors.message?.message}</ErrorLabel>
        </FormControl>

        <InputMask
          mask={'55 99 9 9999-9999'}
          {...register('phone')}
          onChange={(e) => setValue('phone', e.target.value)}
          disabled={shouldDisable}
        >
          <DefaultInput
            placeholder="55 99 9 9999-9999"
            errorMessage={errors.phone?.message}
            InputProps={{
              sx: {
                height: '2.25rem',
              },
            }}
          />
        </InputMask>
        <Button
          fullWidth
          variant="outlined"
          type="submit"
          disabled={shouldDisable}
        >
          {isLoading ? <CircularProgress size="25px" /> : 'Iniciar'}
        </Button>
      </Box>
    </Modal>
  );
}
