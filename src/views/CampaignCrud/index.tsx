import React from 'react';
import { CBScreenState } from '../../components/CrudBuilder';
import { z } from 'zod';
import DefaultInput from '../../components/Inputs/DefaultInput';
// import { campaignSchema } from './schema/campaignSchema';
import { DefaultSelect } from '../../components/Inputs/DefaultSelect';
import useChannels from '../../hooks/querys/useChannels';
import CustomTooltip from '../../components/CustomTooltip';
import Show from '../../components/MetaComponents/Show';
import { UploadButton } from '../../components/Buttons/UploadButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import MessagePreview from '../../components/Inputs/MessagePreview';
import { TextArea } from '../../components/TextArea';
import Grid from '@mui/material/Grid';

type Props = {
  screenState: CBScreenState;
};

export const CampaignCrud = ({ screenState }: Props) => {
  const { data: channels, isLoading: isChannelsLoading } = useChannels();

  // const s = ;

  // const algo = campaignSchema.schema.sha

  return <></>;

  // return (
  //   <CrudBuilder
  //     data={{
  //       session: channels?.map((c) => ({ id: c.id, name: c.instanceName })),
  //     }}
  //     // TODO - change to use hook instead
  //     onInit={(hook) => hook.setValue('screenState', screenState)}
  //     title={'Criação de campanha'}
  //     screenState={screenState}
  //     schema={campaignSchema}
  //     onCreate={async (data) => console.log(data)}
  //     buttons={({}) => <button type="submit">Enviar</button>}
  //     render={({ field, hook, errorMessage, disabled, data, loading }) => {
  //       console.log(hook.formState.errors);

  //       switch (field.type) {
  //         case 'TEXT':
  //         case 'NUMBER':
  //         case 'EMAIL':
  //         case 'DATE':
  //           const shouldDisable =
  //             field.name === 'midiaUrl' && !!hook.watch('file')?.length;

  //           return (
  //             <DefaultInput
  //               {...hook.register(field.name as any)}
  //               key={field.label}
  //               disabled={disabled || shouldDisable}
  //               label={field.label}
  //               errorMessage={errorMessage}
  //               type={field.type.toLowerCase()}
  //             />
  //           );
  //         case 'TIME':
  //           return (
  //             <DefaultInput
  //               {...hook.register(field.name as any)}
  //               key={field.label}
  //               disabled={disabled}
  //               label={
  //                 <Show when={field.label === 'De'} fallback={'Até'}>
  //                   De
  //                   <CustomTooltip title="O horário de inicio deve ser menor que o de término" />
  //                 </Show>
  //               }
  //               errorMessage={errorMessage}
  //               type={field.type.toLowerCase()}
  //               fullWidth
  //               xs={6}
  //               sm={3}
  //             />
  //           );
  //         case 'SELECT':
  //           return (
  //             <DefaultSelect
  //               {...hook.register(field.name as any)}
  //               key={field.label}
  //               disabled={disabled}
  //               label={field.label}
  //               errorMessage={errorMessage}
  //               options={data?.[field.name ?? ''] || []}
  //             />
  //           );
  //         case 'FILE':
  //           return (
  //             <UploadButton
  //               {...hook.register(field.name as any)}
  //               key={field.label}
  //               disabled={disabled || !!hook.watch('midiaUrl')}
  //               errorMessage={errorMessage}
  //             />
  //           );
  //         case 'TEXTAREA':
  //           return (
  //             <Grid item xs={12} key={field.label}>
  //               <TextArea
  //                 {...hook.register(field.name as any)}
  //                 disabled={disabled}
  //                 errorMessage={errorMessage}
  //                 label={field.label}
  //               />
  //             </Grid>
  //           );
  //         case 'CUSTOM':
  //           const img = hook.watch('midiaUrl') || hook.watch('file');
  //           const text = hook.watch('message');
  //           return (
  //             <MessagePreview key={field.label} imgSrc={img} text={text} />
  //           );
  //       }
  //     }}
  //   />
  // );
};
