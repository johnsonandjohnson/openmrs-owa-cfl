import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, FormGroup } from 'reactstrap';
import { setValue } from '../../../shared/util/patient-util';
import { IFieldProps, IFieldState } from './Field';
import _ from 'lodash';

export interface IButtonsProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

class Buttons extends React.Component<IButtonsProps, IFieldState> {
  onChange = value => evt => setValue(this.props.patient, this.props.field.name, this.props.onPatientChange, value);

  render = () => {
    const { intl, field, isInvalid, className, patient, isDirty, onKeyDown } = this.props;
    const { options } = field;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <>
          {_.map(options || [], (option, i) => {
            const value = option.value || option;
            const label = option.label || option;
            return (
              <FormGroup check inline key={`button-${value}`}>
                <Button
                  onClick={this.onChange(value)}
                  className={`gender-button ${this.props.patient.gender === value ? 'active' : ''}`}
                  onKeyDown={!!onKeyDown && i === options.length - 1 && onKeyDown}
                >
                  {label}
                </Button>
              </FormGroup>
            );
          })}
        </>
        {isDirty && isInvalid && (
          <span className="error field-error">
            {intl.formatMessage({
              id: hasValue ? `registerPatient.invalid` : `registerPatient.required`
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
