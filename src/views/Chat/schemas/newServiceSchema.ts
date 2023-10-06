import { z } from 'zod';
import { phoneRegex } from '../../CreateCampanha/schemas/campaignSchema';

const stringValidator = z.string({
  required_error: 'Campo obrigatório!',
  invalid_type_error: 'Campo obrigatório!',
});

export type NewServiceSchemaType = z.infer<typeof newServiceSchema>;
export const newServiceSchema = z.object({
  channel: stringValidator
    .nonempty()
    .refine((value) => value !== 'default', { message: 'Selecione um canal' }),
  phone: stringValidator
    .transform((value) => value.replaceAll(/[ -]/g, ''))
    .refine((value) => phoneRegex.test(value), {
      message: 'Telefone inválido',
    }),
  message: stringValidator.nonempty("Campo 'Mensagem' obrigatório!"),
});
