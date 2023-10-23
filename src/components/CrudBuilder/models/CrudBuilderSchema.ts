import { ZodRawShape, z } from 'zod';
import { CrudBuilderField } from './CrudBuilderField';

// type CrudBuilderSchemaProps<T extends CrudBuilderField> = {
//   [key: string]: T;
// };

// export class CrudBuilderSchema<T extends CrudBuilderField> {
//   constructor(private fields: CrudBuilderSchemaProps<T>) {}
// }

type ObjType<T> = Record<string, CrudBuilderField>;

function crudSchema<T extends ObjType<T>>(props: T): ObjType<T> {
  return props;
}

function getValidators<T extends ObjType<T>>(obj: ObjType<T>){
  return Object.entries(obj).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value.validator,
  }), {}) as { [key in keyof T]: T[key]['validator'] };
}

const algo = crudSchema({
  test: new CrudBuilderField({
    label: 'teste',
    name: 'teste',
    type: 'TEXT',
    validator: z.string(),
  }),
  test2: new CrudBuilderField({
    label: 'teste',
    name: 'teste',
    type: 'TEXT',
    validator: z.number(),
  }),
});

const t = getValidators(algo);
