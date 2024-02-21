/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import Buttons from './Buttons';
import Input from './Input';
import React from 'react';
import Select from './Select';
import Relatives from './Relatives';
import DateInput from './DateInput';
import PhoneInput from './PhoneInput';
import TimeInput from "./TimeInput";
import StaticInput from "./StaticInput";
import AddressFields from "./AddressFields";

const DEFAULT_FIELD_TYPE = 'text';
const DEFAULT_INPUT = Input;

export interface IFieldProps {
  inputRef: (element: { focus: () => void }) => void | undefined;
  patient: any;
  field: any;
  className?: any;
  value?: any;
  onChange?: any;
  onPatientChange: any;
  selectOptions?: any[];
  isInvalid: boolean;
  isDirty: boolean;
  isFirstVisible?: boolean;
  onKeyDown?: any;
  onFirstInputKeyDown?: (e) => void;
  onLastInputKeyDown?: (e) => void;
  message?: string;
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
  relatives: Relatives,
  time: TimeInput,
  static: StaticInput,
  addressFields: AddressFields
};

export const isInputField = (type: string): boolean => {
  return !type || ['buttons', 'select', 'number', 'text', 'phone', 'date', 'time', 'addressFields', 'relatives'].includes(type);
};

function Field(props: IFieldProps) {
  const type = props.field.type || DEFAULT_FIELD_TYPE;
  const InputComponent = inputsByType[type] || DEFAULT_INPUT;
  return <InputComponent {...props} />;
}

export default Field;
