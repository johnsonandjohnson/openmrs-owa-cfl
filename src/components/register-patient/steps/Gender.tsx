import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import { setValue } from "../../../shared/util/patient-util";
import _ from "lodash";

export interface IGenderProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export interface IGenderState {
  gender: string;
  invalidFields: any[];
}

const fields = [
  {
    name: "gender",
    required: true,
  },
];

class Gender extends React.Component<IGenderProps, IGenderState> {
  state = {
    gender: "",
    invalidFields: [],
  };

  componentDidMount() {
    this.setState({
      gender: this.props.patient.gender,
    });
  }

  validate = () => {
    const invalidFields = _.filter(
      fields,
      (field) => field.required && !this.props.patient[field.name]
    );
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  onGenderChange = (gender) => (evt) => {
    this.setState({
      gender,
    });
    setValue(this.props.patient, "gender", this.props.onPatientChange, gender);
  };

  render() {
    const { intl } = this.props;
    const { invalidFields } = this.state;
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.gender.title"} />
            </h2>
            <p>
              <FormattedMessage id={"registerPatient.steps.gender.subtitle"} />
            </p>
          </div>
          {/*<Input hidden name="gender" value={this.state.gender} readOnly />*/}
          <FormGroup check inline>
            <Button
              onClick={this.onGenderChange("M")}
              className={`gender-button ${
                this.state.gender === "M" ? "active" : ""
              }`}
            >
              <FormattedMessage id={"registerPatient.steps.gender.male"} />
            </Button>
          </FormGroup>
          <FormGroup check inline>
            <Button
              onClick={this.onGenderChange("F")}
              className={`gender-button ${
                this.state.gender === "F" ? "active" : ""
              }`}
            >
              <FormattedMessage id={"registerPatient.steps.gender.female"} />
            </Button>
          </FormGroup>
          {invalidFields.length > 0 && (
            <div className="error field-error mt-1">
              {intl.formatMessage({ id: `registerPatient.required` })}
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Gender));
