import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Input as ReactstrapInput } from "reactstrap";
import { setValueOnChange } from "../../../shared/util/patient-util";
import PhoneInput from "react-phone-number-input/input";
import { IFieldProps } from "./Field";
import ValidationError from "./ValidationError";

export interface IInputProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

export interface IInputState {}

class Input extends React.Component<IInputProps, IInputState> {
  render = () => {
    const {
      intl,
      field,
      invalidFields,
      className,
      value,
      onChange,
      patient,
      onPatientChange,
    } = this.props;
    const { name, required, type, label } = field;
    const InputElement = type === "phone" ? PhoneInput : ReactstrapInput;
    const isInvalid =
      invalidFields.filter((field) => field["name"] === name).length > 0;
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
          className={"form-control " + (isInvalid ? "invalid" : "")}
          type={type || "text"}
        />
        {isInvalid && <ValidationError hasValue={hasValue} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Input));
