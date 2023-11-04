import {
  Grid,
  InputLabel,
  Stack,
  Typography,
  TextField as Input,
  FormControl,
  MenuItem,
  Select,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import MaterialButton from '@mui/material/Button';
import Button from '@mui/joy/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TextArea } from '../../components/TextArea';
import Swal from 'sweetalert2';
import api from '../../services/api';

import SaveIcon from '@mui/icons-material/Save';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { TABLE_CONTACTS_SIZE } from '../../utils/constants';
import { theme } from '../../styles/theme';
import PreviewWppMessage from '../../components/PreviewWppMessage';
import { useToast } from '../../context/ToastContext';
import {
  formatDate,
  formatDateTime,
  getTimeFromMinutes,
} from '../../utils/dateAndTimeUtils';
import TableContacts from '../../components/TableContacts';
import { Add } from '@mui/icons-material';
import ContactModal from '../../components/modals/ContactModal';
import { phoneRegex } from '../CreateCampanha/schemas/campaignSchema';
import { EditCampaignSchemaType, editCampaignSchema } from './schemas/edit';
import { Company } from '../../models/company';
import { usePagination } from '../../hooks/usePagination';
import useIsImage from '../../hooks/useIsImage';

export default function EditCampanha() {
  return null;
}

// export default function EditCampanha() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm<EditCampaignSchemaType>({
//     resolver: zodResolver(editCampaignSchema),
//   });
//   const status = watch('status');
//   const channel_id = watch('channel_id');
//   const message = watch('message');

//   const toast = useToast();

//   // const [statusState, setStatusState] = useState('');
//   // // useEffect(() => {
//   // //   setStatusState(status);
//   // // }, [status]);

//   const [contacts, setContacts] = useState<any[]>([]);
//   const [editedContacts, setEditedContacts] = useState<any[]>([]);
//   const [removedContacts, setRemovedContacts] = useState<any[]>([]);

//   const [isModalAddOpen, setIsModalAddOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(NaN);

//   const { id } = useParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   let midiaSrc = data?.midia;
//   if (data?.midiaUrl) midiaSrc = data?.midiaUrl;

//   const { dataToShow, page, setPage, selectedIndex } = usePagination({
//     data: contacts,
//     selectedFromPageIndex: selectedContact,
//   });

//   const [contactKey, setContactKey] = useState('');

//   const selectedContactObject = JSON.parse(
//     contacts?.[selectedIndex]?.variables || '{}'
//   );

//   const contactTableHeaders = Object.keys(
//     JSON.parse(contacts?.[0]?.variables || '{}')
//   ).concat(['status']);
//   const contactsFormatted =
//     dataToShow?.map((item: any) => {
//       return {
//         ...JSON.parse(item.variables || '{}'),
//         status: item.status,
//       };
//     }) || [];

//   useEffect(() => {
//     async function getData() {
//       try {
//         const { data } = await api.get(`/campaign/${id}`);

//         if (!data) {
//           navigate('/campanhas');
//         }

//         reset({
//           id: data.id,
//           title: data.title,
//           message: data.message,
//           scheduleDate: formatDate(data.scheduleDate) as any,
//           startTime: getTimeFromMinutes(data.startTime) as any,
//           endTime: getTimeFromMinutes(data.endTime) as any,
//           status: data.status,
//           startDate: formatDateTime(data.startDate) as any,
//           endDate: formatDateTime(data.endDate) as any,
//           sendDelay: String(data.sendDelay) as any,
//           channel_id: data.channel_id,
//         });

//         const { data: companyData } = await api.get(`/companies`);

//         if (companyData.channel?.length === 0) {
//           toast.error(
//             'Nenhum canal ativo no momento. Ative ao menos um canal para editar a campanha.'
//           );
//           navigate('./..');
//         }

//         const formattedValues = JSON.parse(
//           data?.contacts?.[0]?.variables || '{}'
//         );

//         const key = Object.keys(formattedValues).find((item) => {
//           return phoneRegex.test(
//             String(formattedValues?.[item] || '').replace(/[^0-9]/gi, '')
//           );
//         });

//         setContactKey(key || '');

//         setCompany(companyData);
//         setData(data);
//         setContacts(data.contacts || []);
//       } catch (error) {
//         console.error('error', error);

//         navigate('/campanhas');
//       }
//     }
//     getData();
//   }, []);

//   async function handleSave(values: EditCampaignSchemaType) {
//     setIsLoading(true);

//     try {
//       await api.patch(`/campaign/${id}`, {
//         title: values.title,
//         message: values.message,
//         scheduleDate: values.scheduleDate || undefined,
//         startTime: values.startTime,
//         endTime: values.endTime,
//         status: values.status,
//         sendDelay: values.sendDelay,
//         channel_id: values.channel_id,
//         contacts: contacts,
//         removedContacts: removedContacts,
//       });
//       Swal.fire('Sucesso', 'Alterações feitas com sucesso!', 'success');
//       navigate('campanhas');
//     } catch (error) {
//       console.error(error);
//       Swal.fire(
//         'Erro',
//         'Erro ao editar campanha, por favor tente novamente.',
//         'error'
//       );
//     }
//     setIsLoading(false);
//   }

//   function handleCancelButton() {
//     navigate('./..');
//   }

//   function handleCanalSelect(e: SelectChangeEvent<string>) {
//     setValue('channel_id', e.target.value);
//   }

//   async function handleRemoveContact(index: number) {
//     const option = await Swal.fire({
//       title: 'Tem certeza que deseja remover esse contato?',
//       showCancelButton: true,
//       confirmButtonText: 'Sim',
//       cancelButtonText: 'Não',
//       icon: 'question',
//     });

//     if (!option.isConfirmed) {
//       return;
//     }

//     const indexToSlice = index + page * TABLE_CONTACTS_SIZE;

//     const newContactsObject = [...contacts];

//     const contactToRemove = newContactsObject.splice(indexToSlice, 1);

//     if (contactToRemove?.[0]?.id) {
//       setRemovedContacts([
//         newContactsObject?.[indexToSlice],
//         ...removedContacts,
//       ]);
//     }

//     setContacts(newContactsObject);
//   }

//   return (
//     <Stack justifyContent="center">
//       <ContactModal
//         addContact={(cont) => {}}
//         updateContactTable={(cont) => {
//           const variablesFromJson = JSON.parse(
//             contacts?.[0]?.variables || '{}'
//           );
//           const correctKeysOrder = Object.keys(variablesFromJson);

//           const newObjVariables = correctKeysOrder.reduce((acc: any, key) => {
//             acc[key] = cont[key];
//             return acc;
//           }, {});

//           const objectToSave = {
//             contact: cont[contactKey],
//             variables: JSON.stringify(newObjVariables),
//           };

//           setContacts([objectToSave, ...contacts]);
//           setEditedContacts([objectToSave, ...editedContacts]);
//         }}
//         isOpen={isModalAddOpen}
//         onClose={() => setIsModalAddOpen(false)}
//         fields={contactTableHeaders.filter((h) => h !== 'status')}
//         contactKey={contactKey}
//       />

//       {/* EditContactModal */}
//       <ContactModal
//         addContact={(contact) => {}}
//         updateContactTable={(cont) => {
//           const variablesFromJson = JSON.parse(
//             contacts?.[0]?.variables || '{}'
//           );
//           const correctKeysOrder = Object.keys(variablesFromJson);

//           const newObjVariables = correctKeysOrder.reduce((acc: any, key) => {
//             acc[key] = cont[key];
//             return acc;
//           }, {});

//           const objectToSave = {
//             id: contacts?.[selectedIndex]?.id,
//             contact: cont[contactKey],
//             variables: JSON.stringify(newObjVariables),
//             status: contacts?.[selectedIndex]?.status,
//           };

//           const newValues = [...contacts];
//           newValues[selectedIndex] = objectToSave;
//           setContacts(newValues);

//           const isEditingCreated = editedContacts.find(
//             (i) =>
//               JSON.stringify(i) === JSON.stringify(contacts?.[selectedIndex])
//           );

//           if (!isEditingCreated) {
//             setEditedContacts([objectToSave, ...editedContacts]);
//           }
//         }}
//         isOpen={!Number.isNaN(selectedContact)}
//         onClose={() => setSelectedContact(NaN)}
//         fields={contactTableHeaders.filter((h) => h !== 'status')}
//         contactKey={contactKey}
//         selectedContact={selectedContactObject}
//       />
//       <Grid
//         container
//         spacing={2}
//         component="form"
//         onSubmit={handleSubmit(handleSave)}
//       >
//         <Grid item xs={12}>
//           <Stack
//             direction={'row'}
//             flexWrap="wrap"
//             justifyContent="space-between"
//             gap={4}
//           >
//             <Typography variant="h4">Editando campanha</Typography>
//             <Stack direction={'row'} gap={2}>
//               <Box>
//                 <Button
//                   color="success"
//                   type="submit"
//                   sx={{ textTransform: 'uppercase' }}
//                   disabled={isLoading}
//                 >
//                   <SaveIcon fontSize="small" />
//                   Salvar
//                 </Button>
//               </Box>
//               <Box>
//                 <Button
//                   color="neutral"
//                   variant="outlined"
//                   onClick={handleCancelButton}
//                   sx={{ textTransform: 'uppercase', borderWidth: '2px' }}
//                   disabled={isLoading}
//                 >
//                   <DoDisturbIcon fontSize="small" />
//                   Cancelar
//                 </Button>
//               </Box>
//             </Stack>
//           </Stack>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <InputLabel>Titulo da Campanha</InputLabel>
//           <Input
//             disabled={isLoading}
//             {...register('title')}
//             defaultValue={''}
//             error={!!errors.title}
//             helperText={errors.title?.message}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <InputLabel error={!!errors.channel_id}>Canal</InputLabel>
//           <FormControl fullWidth>
//             <Select
//               {...register('channel_id')}
//               error={!!errors.channel_id}
//               disabled={isLoading}
//               value={channel_id || ''}
//               onChange={handleCanalSelect}
//             >
//               {company?.channel.map((option) => (
//                 <MenuItem value={option.id} key={option.id}>
//                   {option.instanceName}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <InputLabel>Status</InputLabel>
//           <FormControl fullWidth>
//             <Select
//               {...register('status')}
//               disabled={isLoading}
//               fullWidth
//               value={statusState}
//             >
//               <MenuItem value={'CANCELADO'}>CANCELADO</MenuItem>
//               <MenuItem value={'PAUSADO'}>PAUSADO</MenuItem>
//               <MenuItem value={'EM_PROGRESSO'}>EM_PROGRESSO</MenuItem>
//               <MenuItem value={'CONCLUIDO'}>CONCLUIDO</MenuItem>
//               <MenuItem value={'INICIAR'}>INICIAR</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <InputLabel>Data para disparo:</InputLabel>
//           <Input
//             disabled={isLoading}
//             type="date"
//             error={!!errors.scheduleDate}
//             helperText={errors.scheduleDate?.message}
//             fullWidth
//             {...register('scheduleDate')}
//           />
//         </Grid>

//         <Grid item xs={6} sm={6}>
//           <InputLabel>Delay</InputLabel>
//           <Input
//             variant="outlined"
//             fullWidth
//             {...register('sendDelay')}
//             type="number"
//             error={!!errors.sendDelay}
//             helperText={errors.sendDelay?.message}
//           />
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <InputLabel error={!!errors.startTime}>De</InputLabel>
//           <Input
//             disabled={isLoading}
//             type="time"
//             {...register('startTime')}
//             error={!!errors.startTime}
//             helperText={errors.startTime?.message}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={6} sm={3}>
//           <InputLabel error={!!errors.endTime}>Até</InputLabel>
//           <Input
//             disabled={isLoading}
//             type="time"
//             {...register('endTime')}
//             error={!!errors.endTime}
//             helperText={errors.endTime?.message}
//             fullWidth
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <InputLabel>Mensagem:</InputLabel>
//           <TextArea
//             {...register('message')}
//             disabled={isLoading}
//             errorMessage={errors.message?.message}
//             // error={errors.message}
//           />
//         </Grid>
//         <Grid item xs={12} sx={{ marginBottom: 2 }}>
//           <InputLabel sx={{ color: theme.palette.primary.main }}>
//             Preview da mensagem:
//           </InputLabel>
//           <PreviewWppMessage
//             imgSrc={midiaType === 'image' ? midiaSrc : undefined}
//             messagePreview={message}
//           />
//         </Grid>
//       </Grid>
//       <TableContacts
//         headers={contactTableHeaders}
//         onEdit={(index) => setSelectedContact(index)}
//         onDelete={handleRemoveContact}
//         contacts={contactsFormatted}
//         total={contacts.length}
//         onChangePage={setPage}
//         allowEdit
//         isEditing
//         title={
//           <>
//             <InputLabel
//               sx={{
//                 fontSize: '1.5rem',
//               }}
//             >
//               Valores da Planilha
//             </InputLabel>
//             <MaterialButton
//               disabled={isLoading}
//               sx={{ height: '3.5rem', textTransform: 'uppercase' }}
//               variant={'outlined'}
//               onClick={() => setIsModalAddOpen(true)}
//             >
//               <Add />
//               Adicionar mais contato
//             </MaterialButton>
//           </>
//         }
//       />
//     </Stack>
//   );
// }
