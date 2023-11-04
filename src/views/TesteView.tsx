import React from 'react';
// import { CrudBuilder } from '../components/CrudBuilder';
// import { CrudBuilderSchema } from '../components/CrudBuilder/schemaBuilder/crudSchema';
import { z } from 'zod';
import { CrudBuilderField } from '../components/CrudBuilder/models/CrudBuilderField';
import DefaultInput from '../components/Inputs/DefaultInput';

enum Campos {
  Nome = 'Nome',
  Idade = 'Idade',
  Email = 'Email',
}

// const schemaAndFields = new CrudBuilderSchema({
//   schema: z.object({
//     [Campos.Nome]: z.string().min(10).nonempty(),
//     [Campos.Idade]: z.string().nonempty(),
//     [Campos.Email]: z.string().email(),
//   }),
//   fields: [
//     new CrudBuilderField({
//       label: Campos.Nome,
//       type: 'TEXT',
//       disableOn: {
//         create: true,
//       }
//     }),
//     new CrudBuilderField({
//       label: Campos.Idade,
//       type: 'NUMBER',
//     }),
//     new CrudBuilderField({
//       label: Campos.Email,
//       type: 'EMAIL',
//     }),
//   ],
// });

export const TesteView = () => {
  return (
    <></>
    // <CrudBuilder
    //   screenState={'create'}
    //   fields={schemaAndFields.fields}
    //   zodSchema={schemaAndFields.schema}
    //   onCreate={async (data) => alert('foi')}
    //   onRemove={async () => {
    //     throw new Error('Not implemented');
    //   }}
    //   buttons={({ onRemove }) => (
    //     <>
    //       <button type="submit">Enviar</button>
    //       <button onClick={onRemove} type="button">
    //         Remover
    //       </button>
    //     </>
    //   )}
    //   render={({ field, hook, errorMessage, disabled }) => {
    //     switch (field.type) {
    //       case 'TEXT':
    //       case 'NUMBER':
    //       case 'EMAIL':
    //         return (
    //           <DefaultInput
    //             key={field.label}
    //             {...hook.register(field.label)}
    //             disabled={disabled}
    //             type={field.type.toLowerCase()}
    //             placeholder={field.label}
    //             errorMessage={errorMessage}
    //           />
    //         );
    //     }
    //   }}
    // />
  );
};
