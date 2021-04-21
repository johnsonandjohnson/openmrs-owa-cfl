import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Input as ReactstrapInput } from "reactstrap";
import { setValueOnChange } from "../../../shared/util/patient-util";
import PhoneInput from "react-phone-number-input/input";
import { IFieldProps, IFieldState } from "./Field";
import ValidationError from "./ValidationError";

export interface IInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

export interface IInputState extends IFieldState {}

class Input extends React.Component<IInputProps, IInputState> {
  render = () => {
    const {
      intl,
      field,
      isInvalid,
      isDirty,
      className,
      value,
      onChange,
      patient,
      onPatientChange,
    } = this.props;
    const { name, required, type, label } = field;
    const InputElement = type === "phone" ? PhoneInput : ReactstrapInput;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <InputElement
          name={name}
          id={name}
          placeholder={`${
            label ||
            intl.formatMessage({
              id: "registerPatient.fields." + name,
            }) ||
            name
          } ${
            required
              ? intl.formatMessage({
                  id: "registerPatient.fields.required",
                })
              : ""
          }`}
          value={value != null ? value : patient[name]}
          onChange={
            onChange || setValueOnChange(patient, name, onPatientChange)
          }
          required={required}
          className={"form-control " + (isDirty && isInvalid ? "invalid" : "")}
          type={type || "text"}
        />
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
