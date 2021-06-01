import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Input as ReactstrapInput } from 'reactstrap';
import { IFieldProps, IFieldState } from './Field';
import ValidationError from './ValidationError';
import { getCommonInputProps, getPlaceholder } from '../../../shared/util/patient-form-util';

export interface ISelectProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class Select extends React.Component<ISelectProps, IFieldState> {
  setDirty = callback => {
    this.setState({
      isDirty: true
    });
    callback();
  };

  getSelectOptions = (fieldDefinition, placeholder) => {
    const { selectOptions } = this.props;
    const { options } = fieldDefinition;
    const opts = selectOptions || options;
    if (!!opts) {
      return (
        <>
          {
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          }
          {opts.map(option => (
            <option value={option.value || option} key={`option-${option.value || option}`}>
              {option.label || option}
            </option>
          ))}
        </>
      );
    }
  };

  render = () => {
    const { field, isInvalid, isDirty, className, value, patient, intl } = this.props;
    const { name, required, label } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = getCommonInputProps(this.props, placeholder);
    return (
      <div className={`${className} input-container`}>
        <ReactstrapInput
          {...props}
          className={'form-control ' + (isDirty && isInvalid ? 'invalid ' : ' ') + (!value && !patient[name] ? 'placeholder' : '')}
          type="select"
        >
          {this.getSelectOptions(field, placeholder)}
        </ReactstrapInput>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Select));
