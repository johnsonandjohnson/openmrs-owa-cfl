/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect }  from 'react';
import moment from "moment";
import { TimePicker } from "../../common/time-picker/TimePicker";
import { getCommonInputProps, getPlaceholder } from "../../../shared/util/patient-form-util";
import { DEFAULT_TIME_FORMAT } from "../../../shared/constants/input";
import { IFieldProps } from './Field';
import ValidationError from "./ValidationError";

interface ITimeInputProps extends IFieldProps {
}

const TimeInput = (props: PropsWithIntl<ITimeInputProps>) => {
  const {field, isInvalid, isDirty, className, value, patient, onPatientChange} = props;
  const {name, required, label} = field;
  const hasValue = !!value || !!patient[field.name];
  const placeholder = getPlaceholder(props.intl, label, name, required);

  useEffect(() => {
    setValueInModel(patient, field.name, onPatientChange, field.defaultValue);
  }, []);

  const createOnChangeCallback = (patient, fieldName, callback) => event =>
    setValueInModel(patient, fieldName, callback, event && event.target ? event.target.value : event);

  const setValueInModel = (patient, fieldName, callback, value) => {
    patient[fieldName] = getTimeFromDateTime(value);
    callback(patient);
  };

  const getTimeFromDateTime = dateTimeValue => {
    if (!dateTimeValue) {
      return null;
    }

    return moment.isMoment(dateTimeValue) ? dateTimeValue.format(DEFAULT_TIME_FORMAT) : dateTimeValue.toString();
  };

  const getDateTimeFromModel = (patient, name) => {
    const modelValue = patient[name];

    if (typeof modelValue === 'string') {
      return moment(modelValue, DEFAULT_TIME_FORMAT);
    } else {
      return modelValue;
    }
  };

  const timePickerProps = {
    ...getCommonInputProps(props, placeholder),
    placeholderText: placeholder,
    value: value ? value : getDateTimeFromModel(patient, name),
    selected: value ? value : getDateTimeFromModel(patient, name),
    onChange: createOnChangeCallback(patient, name, onPatientChange)
  };

  return (
    <div className={`${className} input-container`}>
      <TimePicker {...timePickerProps} />
      {hasValue && <span className="placeholder">{placeholder ? props.intl.formatMessage({ id: `${placeholder}` }) : ''}</span>}
      {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field}/>}
    </div>
  );
};

export default TimeInput;
