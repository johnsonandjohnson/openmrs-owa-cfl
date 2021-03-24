import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";

export interface IBirthdateProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export interface IBirthdateState {
  invalidFields: any[];
}

const fieldsGroup1 = [
  {
    name: "birthdateDay",
    required: true,
    type: "number",
  },
  {
    name: "birthdateMonth",
    required: true,
    type: "select",
  },
  {
    name: "birthdateYear",
    required: true,
    type: "number",
  },
];

const fieldsGroup2 = [
  {
    name: "birthdateYears",
    required: false,
    type: "number",
  },
  {
    name: "birthdateMonths",
    required: false,
    type: "number",
  },
];

class Birthdate extends React.Component<IBirthdateProps, IBirthdateState> {
  state = {
    invalidFields: [],
  };

  componentDidMount() {}

  validate = () => {
    const invalidFieldsGroup1 = _.filter(
      fieldsGroup1,
      (field) => field.required && !this.props.patient[field.name]
    );
    const invalidFieldsGroup2 = _.filter(
      fieldsGroup2,
      (field) => !this.props.patient[field.name]
    );
    const usesEstimate =
      invalidFieldsGroup1.length === fieldsGroup1.length &&
      invalidFieldsGroup2.length < fieldsGroup2.length;
    const invalidFields = usesEstimate
      ? invalidFieldsGroup2
      : invalidFieldsGroup1;
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  render() {
    const { intl, patient, onPatientChange } = this.props;
    const { invalidFields } = this.state;
    const monthOptions = (
      <>
        <option value="" disabled selected hidden>
          {`${intl.formatMessage({
            id: "registerPatient.fields.birthdateMonth",
          })}`}{" "}
          {fieldsGroup1.find((field) => field.name === "birthdateMonth")
            ?.required
            ? intl.formatMessage({ id: "registerPatient.fields.required" })
            : ""}
        </option>
        {_.range(1, 13).map((m) => (
          <option value={m}>{m}</option>
        ))}
      </>
    );
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.birthdate.title"} />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.birthdate.subtitle"}
              />
            </p>
          </div>
          {fieldsGroup1.length > 0 && (
            <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
              {_.map(fieldsGroup1, (field) =>
                this.props.renderField(
                  field,
                  invalidFields,
                  field.name === "birthdateMonth" ? monthOptions : null,
                  "col-sm-4"
                )
              )}
            </FormGroup>
          )}
          {fieldsGroup1.length > 0 && fieldsGroup2.length > 0 ? (
            <div className="m-5 text-center">
              <FormattedMessage id="registerPatient.steps.birthdate.or" />
            </div>
          ) : null}
          {fieldsGroup2.length > 0 && (
            <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
              {_.map(fieldsGroup2, (field) =>
                this.props.renderField(
                  field,
                  invalidFields,
                  field.name === "birthdateMonth" ? monthOptions : null,
                  "col-sm-6"
                )
              )}
            </FormGroup>
          )}
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = (rootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Birthdate));
