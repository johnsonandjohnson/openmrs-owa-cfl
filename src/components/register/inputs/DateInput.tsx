/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import DatePicker from 'react-datepicker';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getPlaceholder } from '../../../shared/util/patient-form-util';
import { DATE_FORMAT, MILLIS_PER_MINUTE } from '../../../shared/util/date-util';

export interface IDateInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
  datePickerRef: any
}

class DateInput extends React.Component<IDateInputProps, IFieldState> {
  datePickerRef: RefObject<DatePicker>;

  constructor(props) {
    super(props);
    this.datePickerRef = React.createRef();
  }

  componentDidMount(): void {
    this.props.inputRef({ focus: () => this.datePickerRef.current.setFocus() });
  }

  createOnChangeCallback = (patient, fieldName, callback) => event => {
    this.setValueInModel(patient, fieldName, callback, event && event.target ? event.target.value : event);
  };

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
    const {intl, field, isInvalid, isDirty, className, value, patient, onPatientChange, onFirstInputKeyDown, onLastInputKeyDown} = this.props;
    const {name, required, label} = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = {
      name,
      id: name,
      required,
      className: 'form-control ' + (isDirty && isInvalid ? 'invalid' : ''),
      placeholderText: placeholder,
      value: value != null ? value : getDateFromModel(patient, name),
      selected: value != null ? value : getDateFromModel(patient, name),
      onChange: this.createOnChangeCallback(patient, name, onPatientChange),
      peekNextMonth: true,
      showMonthDropdown: true,
      showYearDropdown: true,
      dropdownMode: 'select',
      dateFormat: DATE_FORMAT
    };

    return (
      <div className={`${className} input-container`}
           // Overriding onKeyDown in DatePicker breaks its navigation
           onKeyDown={e => {
             !!onFirstInputKeyDown && onFirstInputKeyDown(e);
             if (!e.defaultPrevented) {
               !!onLastInputKeyDown && onLastInputKeyDown(e);
             }
           }}>
        <DatePicker ref={this.datePickerRef} {...props} />
        {hasValue && <span className="placeholder">{placeholder ? intl.formatMessage({ id: `${placeholder}` }) : ''}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field}/>}
      </div>
    );
  };
}

export function getDateFromModel(patient, field) {
  const modelValue = patient[field];

  if (typeof modelValue === 'string') {
    return new Date(modelValue);
  } else {
    return modelValue;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DateInput));
