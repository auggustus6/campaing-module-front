import { ZodRawShape, z } from 'zod';
import { CrudBuilderField } from '../models/CrudBuilderField';

// type CrudBuilderSchemaProps<T extends CrudBuilderField> = {
//   [key: string]: T;
// };

// export class CrudBuilderSchema<T extends CrudBuilderField> {
//   constructor(private fields: CrudBuilderSchemaProps<T>) {}
// }

// type ObjType<T> = Record<string, CrudBuilderField>;

// function crudSchema<T extends ObjType<T>>(
//   props: T
// ): T & { getValidators: () => { [key in keyof T]: T[key]['validator'] } } {
//   const newObj = props;

//   function getValidators<T extends ObjType<T>>(obj: ObjType<T>) {
//     return Object.entries(obj).reduce(
//       (acc, [key, value]) => ({
//         ...acc,
//         [key]: value.validator,
//       }),
//       {}
//     ) as { [key in keyof T]: T[key]['validator'] };
//   }

//   Object.assign(newObj, {
//     getValidators: () => getValidators(newObj),
//   });

//   return props as T & {
//     getValidators: () => { [key in keyof T]: T[key]['validator'] };
//   };
// }

// const algo = crudSchema({
//   test: new CrudBuilderField({
//     label: 'teste',
//     name: 'teste',
//     type: 'TEXT',
//     validator: z.string(),
//   }),
//   test2: new CrudBuilderField({
//     label: 'teste',
//     name: 'teste',
//     type: 'TEXT',
//     validator: z.number(),
//   }),
// });

// const t = algo.getValidators();

export type CrudSchema<T> = Record<string, CrudBuilderField>;

export function crudSchema<T extends CrudSchema<T>>(props: T): CrudSchema<T> {
  return props;
}

export type Validators<T extends CrudSchema<T>> = { [key in keyof T]: T[key]['validator'] };
export function getValidators<T extends CrudSchema<T>>(obj: CrudSchema<T>) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: value.validator,
    }),
    {}
  ) as Validators<T>;
}

// const algo = crudSchema({
//   test: new CrudBuilderField({
//     label: 'teste',
//     name: 'teste',
//     type: 'TEXT',
//     validator: z.string(),
//   }),
//   test2: new CrudBuilderField({
//     label: 'teste',
//     name: 'teste',
//     type: 'TEXT',
//     validator: z.number(),
//   }),
// });

// const t = getValidators(algo);
