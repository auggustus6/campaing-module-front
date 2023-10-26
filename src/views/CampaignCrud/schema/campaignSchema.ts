import { z } from 'zod';
import {
  getMinutesFromTime,
  getNowOnlyDate,
} from '../../../utils/dateAndTimeUtils';
import { CrudBuilderField } from '../../../components/CrudBuilder/models/CrudBuilderField';
// import { CrudBuilderSchema } from '../../../components/CrudBuilder/schemaBuilder/crudSchema';
import { CBScreenStateOptions } from '../../../components/CrudBuilder';
import { fileToBase64 } from '../../../utils/fileUtils';

// TODO - move this to utils
export const phoneRegex = new RegExp(/\b\d{8,14}\b/);

// pra consertar o problema de que possivelmente alguns campos nao serao obrigatorios em outros
// telas, posso criar um campo no zod mesmo pra receber o estado da tela, ai posso fazer todas as
// validacoes seguindo isso
// export const campaignSchema = new CrudBuilderSchema({
//   schema: z
//     .object({
//       screenState: z.enum(CBScreenStateOptions),
//       title: z.string().min(6, 'Muito curto!').max(70, 'Muito extenso!'),
//       scheduleDate: z
//         .string()
//         .transform((date) => (date ? new Date(date) : ''))
//         .refine(
//           (date) => {
//             if (!date) return false;
//             return date >= getNowOnlyDate();
//           },
//           { message: 'Escolha uma data no futuro!' }
//         ),
//       startTime: z
//         .string({
//           invalid_type_error: 'Horário inválido.',
//           required_error: 'Campo obrigatório.',
//         })
//         .transform((time) => {
//           return getMinutesFromTime(time);
//         }),
//       endTime: z
//         .string({
//           invalid_type_error: 'Horário inválido.',
//           required_error: 'Campo obrigatório.',
//         })
//         .transform((time) => {
//           return getMinutesFromTime(time);
//         }),
//       file: z
//         .any()
//         .refine((file: FileList) => {
//           if (!file.length) return true;
//           return file[0]?.size < 10 * 1024 * 1024;
//         }, 'Limite de 10MB excedido.')
//         .refine((file: FileList) => {
//           if (!file.length) return true;
//           return 'image/png, image/gif, image/jpeg, audio/*'.includes(
//             file[0]?.type
//           );
//         }, 'Formato inválido. Apenas imagens e áudios são aceitos.')
//         .transform(async(file: FileList) => {
//           if (!file.length) return undefined;
//           return await fileToBase64(file[0]);
//         }),
//       midiaUrl: z.string().refine(
//         (url) => {
//           if (!url) return true;
//           if (z.string().url().safeParse(url).success) return true;
//           return false;
//         },
//         {
//           message: 'URL inválida.',
//         }
//       ),
//       sendDelay: z
//         .string()
//         .default('120')
//         .transform((delay) => Number(delay))
//         .refine(
//           (delay) => {
//             if (delay < 10) return false;
//             return true;
//           },
//           { message: 'O tempo mínimo é de 10 segundos.' }
//         ),
//       session: z.string().min(10, 'Selecio  ne uma opção!'),
//       message: z.string().min(1, 'Muito curto!').max(1000, 'Muito extenso!'),
//     })
//     .refine((values) => values.startTime < values.endTime, {
//       message: 'O horário de início deve ser menor que o horário de término.',
//       path: ['startTime'],
//     }),
//   fields: [
//     new CrudBuilderField({
//       label: 'Titulo da Campanha:',
//       type: 'TEXT',
//       name: 'title',
//     }),
//     new CrudBuilderField({
//       label: 'Canal:',
//       type: 'SELECT',
//       name: 'session',
//     }),
//     new CrudBuilderField({
//       label: 'Data para disparo:',
//       type: 'DATE',
//       name: 'scheduleDate',
//     }),
//     new CrudBuilderField({
//       label: 'Delay entre cada mensagem (em segundos):',
//       type: 'NUMBER',
//       name: 'sendDelay',
//     }),
//     new CrudBuilderField({
//       label: 'Url da imagem:',
//       type: 'TEXT',
//       name: 'midiaUrl',
//     }),
//     new CrudBuilderField({
//       label: 'De',
//       type: 'TIME',
//       name: 'startTime',
//     }),
//     new CrudBuilderField({
//       label: 'Até',
//       type: 'TIME',
//       name: 'endTime',
//     }),
//     new CrudBuilderField({
//       label: 'midia:',
//       type: 'FILE',
//       name: 'file',
//     }),
//     new CrudBuilderField({
//       label: 'Mensagem:',
//       type: 'TEXTAREA',
//       name: 'message',
//     }),
//     new CrudBuilderField({
//       label: 'Preview da mensagem:',
//       type: 'CUSTOM',
//       name: 'preview-message',
//     }),
//     // new CrudBuilderField({
//     //   label: 'Variáveis',
//     //   type: 'TEXT',
//     //   name: 'variables',
//     // }),
//   ],
// });

// export type CampaignSchemaType = z.infer<typeof campaignSchema>;
// export const campaignSchema = ;
