import Buttons from './Buttons';
import Input from './Input';
import React from 'react';
import Select from './Select';
import Relatives from './Relatives';
import DateInput from './DateInput';
import PhoneInput from './PhoneInput';

const DEFAULT_FIELD_TYPE = 'text';
const DEFAULT_INPUT = Input;

export interface IFieldProps {
  patient: any;
  field: any;
  className?: any;
  value?: any;
  onChange?: any;
  onPatientChange: any;
  selectOptions?: any[];
  isInvalid: boolean;
  isDirty: boolean;
  onKeyDown?: any;
}

// tslint:disable-next-line:no-empty-interface
export interface IFieldState {}

export const inputsByType = {
  buttons: Buttons,
  select: Select,
  number: Input,
  text: Input,
  phone: PhoneInput,
  date: DateInput,
  relatives: Relatives
};

function Field(props: IFieldProps) {
  const type = props.field.type || DEFAULT_FIELD_TYPE;
  const InputComponent = inputsByType[type] || DEFAULT_INPUT;
  return <InputComponent {...props} />;
}

export default Field;
