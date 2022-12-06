/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { IFieldProps } from '../../components/register/inputs/Field';

export const getPlaceholder = (intl, label, fieldName, required) => {
  let placeholder =
    label ||
    intl.formatMessage({
      id: 'registerPatient.fields.' + fieldName
    }) ||
    fieldName;

  placeholder =  intl.formatMessage({ id: `${placeholder}` })

  if (required) {
    placeholder = [
      placeholder,
      intl.formatMessage({
        id: 'registerPatient.fields.required'
      })
    ].join(' ');
  }

  return intl.formatMessage({ id: `${placeholder}` });
};

export const getCommonInputProps = (props: IFieldProps, placeholder) => {
  const { field, isInvalid, isDirty, value, onChange, patient, onPatientChange, onKeyDown } = props;
  const { name, required, type } = field;
  return {
    name,
    id: name,
    placeholder,
    value: value != null ? value : patient[name],
    onChange: onChange || setValueOnChange(patient, name, onPatientChange),
    required,
    className: 'form-control ' + (isDirty && isInvalid ? 'invalid' : ''),
    type: type || 'text',
    onKeyDown: !!onKeyDown && onKeyDown
  };
};

export const setValue = (patient, prop, callback, value) => {
  patient[prop] = value;
  callback(patient);
};

export const setValueOnChange = (patient, prop, callback) => event =>
  setValue(patient, prop, callback, event && event.target ? event.target.value : event);
