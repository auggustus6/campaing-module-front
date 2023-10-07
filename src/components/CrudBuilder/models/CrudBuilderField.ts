import { ZodRawShape } from 'zod';

export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'DATE'
  | 'TIME'
  | 'DATETIME'
  | 'SWITCH'
  | 'SLIDER'
  | 'UPLOAD'
  | 'CUSTOM';

type Actions = {
  create?: boolean;
  update?: boolean;
  // delete?: boolean;
  view?: boolean;
};

type CrudBuilderFieldProps = {
  type: FieldType;
  label: string;
  disableOn?: Actions;
  hideOn?: Actions;
};

export class CrudBuilderField {
  constructor(private props: CrudBuilderFieldProps) {}

  get type() {
    return this.props.type;
  }

  get label() {
    return this.props.label;
  }

  get disableOn() {
    return this.props.disableOn;
  }

  get hideOn() {
    return this.props.hideOn;
  }
}
