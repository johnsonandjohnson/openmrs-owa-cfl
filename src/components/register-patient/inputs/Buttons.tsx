import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Button, FormGroup } from "reactstrap";
import { setValue } from "../../../shared/util/patient-util";
import { IFieldProps } from "./Field";

export interface IButtonsProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

export interface IButtonsState {}

class Buttons extends React.Component<IButtonsProps, IButtonsState> {
  onChange = (value) => (evt) => {
    setValue(
      this.props.patient,
      this.props.field.name,
      this.props.onPatientChange,
      value
    );
  };

  render = () => {
    const { intl, field, invalidFields, className, patient } = this.props;
    const { name, options } = field;
    const isInvalid =
      invalidFields.filter((field) => field["name"] === name).length > 0;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <>
          {(options || []).map((option) => {
            const value = option.value || option;
            const label = option.label || option;
            return (
              <FormGroup check inline>
                <Button
                  onClick={this.onChange(value)}
                  className={`gender-button ${
                    this.props.patient.gender === value ? "active" : ""
                  }`}
                >
                  {label}
                </Button>
              </FormGroup>
            );
          })}
        </>
        {isInvalid && (
          <span className="error field-error">
            {intl.formatMessage({
              id: hasValue
                ? `registerPatient.invalid`
                : `registerPatient.required`,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Buttons));
