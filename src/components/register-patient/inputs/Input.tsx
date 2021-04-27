import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setValueOnChange } from '../../../shared/util/patient-util';
import PhoneInput from 'react-phone-number-input/input';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getPlaceholder } from '../../../shared/util/form-util';
import { BIRTHDATE_FIELD, ESTIMATED_BIRTHDATE_FIELDS } from '../Step';

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
    const { intl, field, isInvalid, isDirty, className, value, onChange, patient, onPatientChange, onKeyDown } = this.props;
    const { name, required, type, label } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = {
      name,
      id: name,
      placeholder,
      value: value != null ? value : patient[name],
      onChange: onChange || setValueOnChange(patient, name, onPatientChange),
      required,
      className: 'form-control ' + (isDirty && isInvalid ? 'invalid' : ''),
      type: type || 'text',
      onKeyDown: !!onKeyDown && onKeyDown,
      disabled: this.isDisabled(patient, name)
    };
    if (type === 'number') {
      // Firefox doesn't support number inputs
      props['pattern'] = '[1-9]';
    }
    return (
      <div className={`${className} input-container`}>
        {type === 'phone' ? <PhoneInput {...props} /> : <input {...props} />}
        {hasValue && <span className="placeholder">{placeholder}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Input));
