export type CBFieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'NUMBER'
  | 'EMAIL'
  | 'SELECT'
  | 'RADIO'
  | 'FILE'
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
  view?: boolean;
};

type CrudBuilderFieldProps<T> = {
  type: CBFieldType;
  label: string;
  name: string;
  validator: T;
  disableOn?: CBScreenActions;
  hideOn?: CBScreenActions;
};

export class CrudBuilderField<T = any> {
  constructor(private props: CrudBuilderFieldProps<T>) {}

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

  get validator() {
    return this.props.validator;
  }
}
