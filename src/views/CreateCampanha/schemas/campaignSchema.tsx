import { z } from 'zod';
import {
  getMinutesFromTime,
  getNowOnlyDate,
} from '../../../utils/dateAndTimeUtils';

export type CampaignSchemaType = z.infer<typeof campaignSchema>;
export const campaignSchema = z
  .object({
    title: z
      .string()
      .min(6, 'Muito curto!')
      .max(70, 'Muito extenso!')
      .nonempty('Campo obrigatório.'),
    message: z
      .string({
        required_error: 'Campo obrigatório.',
      })
      .min(6, 'Muito curto!'),
    scheduleDate: z
      .string()
      .transform((date) => (date ? new Date(date) : ''))
      .refine(
        (date) => {
          if (!date) return false;
          return date >= getNowOnlyDate();
        },
        { message: 'Escolha uma data no futuro!' }
      ),
    startTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
    endTime: z
      .string({
        invalid_type_error: 'Horário inválido.',
        required_error: 'Campo obrigatório.',
      })
      .transform((time) => {
        return getMinutesFromTime(time);
      }),
    variables: z.string().array().min(1, 'Ao menos uma variável é necessária.'),
    contacts: z.any().array().min(1, 'Arquivo vazio.'),
    fileName: z.string().optional(),
    midiaName: z.string().optional(),
    midiaUrl: z.string().refine(
      (url) => {
        if (!url) return true;
        if (z.string().url().safeParse(url).success) return true;
        return false;
      },
      {
        message: 'URL inválida.',
      }
    ),
    sendDelay: z
      .string()
      .default('120')
      .transform((delay) => Number(delay))
      .refine(
        (delay) => {
          if (delay < 10) return false;
          return true;
        },
        { message: 'O tempo mínimo é de 10 segundos.' }
      ),
    session: z.string().min(10, 'Selecio  ne uma opção!'),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: 'O horário de início deve ser menor que o horário de término.',
    path: ['startTime'],
  });
