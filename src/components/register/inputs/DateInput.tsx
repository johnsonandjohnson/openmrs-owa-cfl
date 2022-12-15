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
import DatePicker from 'react-datepicker';
import {IFieldProps, IFieldState} from './Field';
import ValidationError from './ValidationError';
import {getCommonInputProps, getPlaceholder} from '../../../shared/util/patient-form-util';
import {DATE_FORMAT, MILLIS_PER_MINUTE} from '../../../shared/util/date-util';

export interface IDateInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class DateInput extends React.Component<IDateInputProps, IFieldState> {
  createOnChangeCallback = (patient, fieldName, callback) => event =>
    this.setValueInModel(patient, fieldName, callback, event && event.target ? event.target.value : event);

  setValueInModel = (patient, fieldName, callback, value) => {
    patient[fieldName] = this.getDateFromDateTime(value);
    callback(patient);
  };

  getDateFromDateTime = (dateTimeValue) => {
    if(!!dateTimeValue) {
      const offsetInMinutes = dateTimeValue.getTimezoneOffset();
      const date = new Date(dateTimeValue.getTime() - (offsetInMinutes * MILLIS_PER_MINUTE));
      return date.toISOString().split('T')[0];
    } else {
      return null;
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
      value: value != null ? value : this.getDateFromModel(patient, name),
      selected: value != null ? value : this.getDateFromModel(patient, name),
      onChange: this.createOnChangeCallback(patient, name, onPatientChange)
    };
    return (
      <div className={`${className} input-container`}>
        <DatePicker {...props} peekNextMonth showMonthDropdown showYearDropdown dropdownMode="select"
                    dateFormat={DATE_FORMAT}/>
        {hasValue && <span className="placeholder">{placeholder ? intl.formatMessage({ id: `${placeholder}` }) : ''}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field}/>}
      </div>
    );
  };

  getDateFromModel = (patient, name) => {
    const modelValue = patient[name];

    if (typeof modelValue === 'string') {
      return new Date(modelValue);
    } else {
      return modelValue;
    }
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DateInput));
