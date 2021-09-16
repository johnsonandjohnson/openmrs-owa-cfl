import React, { RefObject } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/patient-form-util';
import { getPhoneNumberWithPlusSign } from '../../../shared/util/person-util';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export interface IInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

const PLUS_SIGN_LENGTH = 1;

class Input extends React.Component<IInputProps, IFieldState> {
  private inputRef = React.createRef() as RefObject<HTMLInputElement>;

  getErrorMessage = inputValue => {
    if (inputValue.length > 0 && !isPossiblePhoneNumber(inputValue)) {
      return 'registerPatient.invalidPhoneNumber';
    }
  };

  removePlusSign = phoneNumber => phoneNumber && phoneNumber.substring(PLUS_SIGN_LENGTH);

  render = () => {
    const { intl, field, isInvalid, isDirty, className, value, patient } = this.props;
    const { name, required, label } = field;
    const inputValue = getPhoneNumberWithPlusSign(value || patient[field.name] || '');
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = getCommonInputProps(this.props, placeholder);
    const errorMessage = this.getErrorMessage(inputValue);

    return (
      <div className={`${className} input-container`}>
        <PhoneInput
          {...props}
          value={inputValue}
          onChange={phoneNumber => props.onChange(this.removePlusSign(phoneNumber))}
          ref={this.inputRef}
          international
          numberInputProps={{ className: props.className }}
          className={null}
        />
        {inputValue.length > 0 && <span className="placeholder">{placeholder}</span>}
        {((isDirty && isInvalid) || errorMessage) && (
          <ValidationError hasValue={inputValue.length > 0} message={errorMessage} field={field} />
        )}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Input));
