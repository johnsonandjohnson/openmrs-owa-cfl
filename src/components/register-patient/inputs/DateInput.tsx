import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { setValueOnChange } from "../../../shared/util/patient-util";
import DatePicker from "react-datepicker";
import { IFieldProps, IFieldState } from "./Field";
import ValidationError from "./ValidationError";
import { getPlaceholder } from "../../../shared/util/form-util";

export interface IDateInputProps
  extends StateProps,
    DispatchProps,
    IFieldProps {
  intl: any;
}

export interface IDateInputState extends IFieldState {}

class DateInput extends React.Component<IDateInputProps, IDateInputState> {
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
      onKeyDown,
    } = this.props;
    const { name, required, type, label } = field;
    const hasValue = !!value || !!patient[field.name];
    const placeholder = getPlaceholder(intl, label, name, required);
    const props = {
      name: name,
      id: name,
      placeholderText: placeholder,
      selected: value != null ? value : patient[name],
      onChange: onChange || setValueOnChange(patient, name, onPatientChange),
      required: required,
      className: "form-control " + (isDirty && isInvalid ? "invalid" : ""),
      type: type || "text",
      onKeyDown: !!onKeyDown && onKeyDown,
    };
    return (
      <div className={`${className} input-container`}>
        <DatePicker
          {...props}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DateInput));
