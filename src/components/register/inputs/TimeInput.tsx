/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';
import {IFieldProps, IFieldState} from './Field';
import {getCommonInputProps, getPlaceholder} from "../../../shared/util/patient-form-util";
import ValidationError from "./ValidationError";
import {TimePicker} from "../../common/time-picker/TimePicker";
import moment from "moment";
import {DEFAULT_TIME_FORMAT} from "../../../shared/constants/input";

export interface ITimeInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class TimeInput extends React.Component<ITimeInputProps, IFieldState> {
  createOnChangeCallback = (patient, fieldName, callback) => event =>
    this.setValueInModel(patient, fieldName, callback, event && event.target ? event.target.value : event);

  setValueInModel = (patient, fieldName, callback, value) => {
    patient[fieldName] = this.getTimeFromDateTime(value);
    callback(patient);
  };

  getTimeFromDateTime = (dateTimeValue) => {
    if (!!dateTimeValue) {
      return moment.isMoment(dateTimeValue) ? dateTimeValue.format(DEFAULT_TIME_FORMAT) : dateTimeValue.toString();
    } else {
      return null;
    }
  };

  getDateTimeFromModel = (patient, name) => {
    const modelValue = patient[name];

    if (typeof modelValue === 'string') {
      return moment(modelValue, DEFAULT_TIME_FORMAT);
    } else {
      return modelValue;
    }
  };

  render = () => {
    const {intl, field, isInvalid, isDirty, className, value, patient, onPatientChange} = this.props;
    const {name, required, label} = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = {
      ...getCommonInputProps(this.props, placeholder),
      placeholderText: placeholder,
      value: value != null ? value : this.getDateTimeFromModel(patient, name),
      selected: value != null ? value : this.getDateTimeFromModel(patient, name),
      onChange: this.createOnChangeCallback(patient, name, onPatientChange)
    };
    return (
      <div className={`${className} input-container`}>
        <TimePicker {...props} />
        {hasValue && <span className="placeholder">{placeholder}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field}/>}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TimeInput));
