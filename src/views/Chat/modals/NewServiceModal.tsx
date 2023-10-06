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
import {
  NewServiceSchemaType,
  newServiceSchema,
} from '../schemas/newServiceSchema';
import ErrorLabel from '../../../components/Labels/ErrorLabel';
import useNewServiceMutation from '../logic/useNewServiceMutation';
import useChannels from '../../../hooks/querys/useChannels';
import useCompany from '../../../hooks/querys/useCompany';
import Show from '../../../components/MetaComponents/Show';

type Props = {
  onClose: () => void;
};

export default function NewServiceModal({ onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NewServiceSchemaType>({
    resolver: zodResolver(newServiceSchema),
  });
  const channel = watch('channel');

  const channelsQuery = useChannels();

  const newServiceMutation = useNewServiceMutation();

  const shouldDisable =
    !channelsQuery.data?.length ||
    newServiceMutation.isLoading ||
    channelsQuery.isLoading;

  const isLoading = channelsQuery.isLoading || newServiceMutation.isLoading;

  function handleChannelSelect(event: any, value: string | null) {
    if (value) {
      setValue('channel', value);
    }
  }

  function handleFormSubmit(data: NewServiceSchemaType) {
    newServiceMutation.mutate(data);
  }


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
