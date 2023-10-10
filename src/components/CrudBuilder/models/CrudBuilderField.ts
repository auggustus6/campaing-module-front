import { ZodRawShape } from 'zod';

export type CBFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'SELECT'
  | 'RADIO'
  | "FILE"
  | 'CHECKBOX'
  | 'DATE'
  | 'TIME'
  | 'DATETIME'
  | 'SWITCH'
  | 'SLIDER'
  | 'CUSTOM';

type CBScreenActions = {
  create?: boolean;
  update?: boolean;
  // delete?: boolean;
  view?: boolean;
};

type CrudBuilderFieldProps = {
  type: CBFieldType;
  label: string;
  name: string;
  disableOn?: CBScreenActions;
  hideOn?: CBScreenActions;
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

  get name() {
    return this.props.name;
  }
}
