import { ZodRawShape, z } from 'zod';
import { CrudBuilderField } from './CrudBuilderField';

type CrudBuilderSchemaProps<T> = {
  schema: T;
  fields: CrudBuilderField[];
};

export class CrudBuilderSchema<T> {
  constructor(private props: CrudBuilderSchemaProps<T>) {}

  get schema() {
    return this.props.schema;
  }

  get fields() {
    return this.props.fields;
  }
}
