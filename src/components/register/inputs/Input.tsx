import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/form-util';
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
    const { intl, field, isInvalid, isDirty, className, value, patient } = this.props;
    const { name, required, type, label } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = getCommonInputProps(this.props, placeholder);
    props['disabled'] = this.isDisabled(patient, name);
    if (type === 'number') {
      // Firefox doesn't support number inputs
      props['pattern'] = '[1-9]';
    }
    return (
      <div className={`${className} input-container`}>
        <input {...props} />
        {hasValue && <span className="placeholder">{placeholder}</span>}
        {isDirty && isInvalid && <ValidationError hasValue={hasValue} field={field} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Input));
