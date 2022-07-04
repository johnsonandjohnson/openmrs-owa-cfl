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
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/patient-form-util';
import { BIRTHDATE_FIELD, ESTIMATED_BIRTHDATE_FIELDS } from '../Step';
import InputMask from 'react-input-mask';

export interface IInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class Input extends React.Component<IInputProps, IFieldState> {
  isDisabled = (patient, fieldName) => {
    if (ESTIMATED_BIRTHDATE_FIELDS.includes(fieldName)) {
      return !!patient[BIRTHDATE_FIELD];
    }
    return false;
  };

  render = () => {
    const { intl, field, isInvalid, isDirty, className, value, patient, message } = this.props;
    const { name, required, type, label, mask } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = getCommonInputProps(this.props, placeholder);

    props['disabled'] = this.isDisabled(patient, name);
    props['data-testid'] = this.props['data-testid'] || name;

    if (type === 'number') {
      // Firefox doesn't support number inputs
      props['pattern'] = '[1-9]';
    }

    return (
      <div className={`${className} input-container`}>
        <InputMask {...props} mask={mask} maskChar={null} value={props.value} onChange={props.onChange} />
        {hasValue && <span className="placeholder">{placeholder}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field} message={message} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Input));
