import React from 'react';
import { CrudBuilder } from '../components/CrudBuilder';
import { CrudBuilderSchema } from '../components/CrudBuilder/models/CrudBuilderSchema';
import { z } from 'zod';
import { CrudBuilderField } from '../components/CrudBuilder/models/CrudBuilderField';

enum Campos {
  Nome = 'Nome',
  Idade = 'Idade',
  Email = 'Email',
}

const schemaAndFields = new CrudBuilderSchema({
  schema: z.object({
    [Campos.Nome]: z.string().min(10).nonempty(),
    [Campos.Idade]: z.string().nonempty(),
    [Campos.Email]: z.string().email(),
  }),
  fields: [
    new CrudBuilderField({
      label: Campos.Nome,
      type: 'TEXT',
    }),
    new CrudBuilderField({
      label: Campos.Idade,
      type: 'NUMBER',
    }),
    new CrudBuilderField({
      label: Campos.Email,
      type: 'EMAIL',
    }),
  ],
});

export const TesteView = () => {
  return (
    <CrudBuilder
      screenState={'create'}
      fields={schemaAndFields.fields}
      zodSchema={schemaAndFields.schema}
      onCreate={async (data) => alert('foi')}
      render={({ field, hook, errorMessage, disabled }) => {
        switch (field.type) {
          case 'TEXT':
          case 'NUMBER':
          case 'EMAIL':
            return (
              <div key={field.label}>
                <input
                  {...hook.register(field.label)}
                  disabled={disabled}
                  type={field.type.toLowerCase()}
                  placeholder={field.label}
                />
                {errorMessage && <span>{errorMessage}</span>}
              </div>
            );
        }

        return null;
      }}
      container={(children) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: 300,
          }}
        >
          {children}
        </div>
      )}
    />
  );
};
