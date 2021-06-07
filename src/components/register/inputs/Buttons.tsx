import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { setValue } from '../../../shared/util/patient-form-util';
import { IFieldProps, IFieldState } from './Field';
import { Buttons as GenericButtons } from '../../common/form/Buttons';

export interface IButtonsProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class Buttons extends React.Component<IButtonsProps, IFieldState> {
  onChange = value => setValue(this.props.patient, this.props.field.name, this.props.onPatientChange, value);

  render = () => {
    const { intl, field, isInvalid, className, patient, isDirty, onKeyDown } = this.props;
    const { options } = field;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <GenericButtons options={options} entity={patient} fieldName={field.name} onChange={this.onChange} onKeyDown={onKeyDown} />
        {isDirty && isInvalid && (
          <span className="error field-error">
            {intl.formatMessage({
              id: hasValue ? field.errorMessage || `registerPatient.invalid` : `registerPatient.required`
            })}
          </span>
        )}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Buttons));
