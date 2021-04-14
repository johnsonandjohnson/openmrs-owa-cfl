import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Input as ReactstrapInput } from "reactstrap";
import { setValueOnChange } from "../../../shared/util/patient-util";
import { IFieldProps } from "./Field";
import ValidationError from "./ValidationError";

export interface ISelectProps extends StateProps, DispatchProps, IFieldProps {
  intl: any;
}

export interface ISelectState {}

class Select extends React.Component<ISelectProps, ISelectState> {
  getSelectOptions = (fieldDefinition) => {
    const { intl, selectOptions } = this.props;
    const { name, options, required, label } = fieldDefinition;
    const opts = selectOptions || options;
    if (!!opts) {
      return (
        <>
          {
            <option value="" disabled selected hidden>
              {`${
                label ||
                intl.formatMessage({
                  id: "registerPatient.fields." + name,
                }) ||
                name
              }`}{" "}
              {required
                ? intl.formatMessage({
                    id: "registerPatient.fields.required",
                  })
                : ""}
            </option>
          }
          {opts.map((option) => (
            <option value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </>
      );
    }
  };

  render = () => {
    const {
      field,
      invalidFields,
      className,
      value,
      onChange,
      patient,
      onPatientChange,
    } = this.props;
    const { name, required } = field;
    const isInvalid =
      invalidFields.filter((field) => field["name"] === name).length > 0;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <ReactstrapInput
          name={name}
          id={name}
          value={value != null ? value : patient[name]}
          onChange={
            onChange || setValueOnChange(patient, name, onPatientChange)
          }
          required={required}
          className={
            "form-control " +
            (isInvalid ? "invalid " : " ") +
            (!value && !patient[name] ? "placeholder" : "")
          }
          type="select"
        >
          {this.getSelectOptions(field)}
        </ReactstrapInput>
        {isInvalid && <ValidationError hasValue={hasValue} />}
      </div>
    );
  };
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Select));
