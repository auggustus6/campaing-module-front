import { z } from 'zod';
import { getMinutesFromTime } from '../../../utils/dateAndTimeUtils';


export type EditCampaignSchemaType = z.infer<typeof editCampaignSchema>;
export const editCampaignSchema = z
  .object({
    id: z.string(),
    title: z
      .string()
      .min(6, 'Muito curto!')
      .max(70, 'Muito extenso!')
      .nonempty('Campo obrigatório.'),
    message: z.string().min(6, 'Muito curto!'),
    scheduleDate: z
      .string()
      .transform((date) => (date ? new Date(date) : ''))
      .refine(
        (date) => {
          if (!date) return false;
          return true;
        },
        { message: 'Escolha uma data!' }
      )
      .optional(),
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
    status: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    sendDelay: z
      .string()
      .transform((delay) => Number(delay))
      .refine(
        (delay) => {
          if (delay < 10) return false;
          return true;
        },
        { message: 'O tempo mínimo é de 10 segundos.' }
      ),
    channel_id: z.string().nonempty('Selecione uma opção!'),
  })
  .refine((values) => values.startTime < values.endTime, {
    message: 'O horário de início deve ser menor que o horário de término.',
    path: ['startTime'],
  });
