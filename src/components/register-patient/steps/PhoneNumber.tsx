import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";
import { isPossiblePhoneNumber } from "react-phone-number-input";

export interface IPhoneNumberProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

const fields = [
  {
    name: "phoneNumber",
    required: false,
    type: "phone",
  },
];

export interface IPhoneNumberState {
  invalidFields: any[];
}

class PhoneNumber extends React.Component<
  IPhoneNumberProps,
  IPhoneNumberState
> {
  state = { invalidFields: [] };

  componentDidMount() {}

  isInvalid = (value, required) => {
    if (required && !value) {
      return true;
    } else if (!!value && !isPossiblePhoneNumber(value)) {
      return true;
    }
    return false;
  };

  validate = () => {
    const invalidFields = _.filter(fields, (field) =>
      this.isInvalid(this.props.patient[field.name], field.required)
    );
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  render() {
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage
                id={"registerPatient.steps.phoneNumber.title"}
              />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.phoneNumber.subtitle"}
              />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
            {_.map(fields, (field) =>
              this.props.renderField(field, this.state.invalidFields)
            )}
          </FormGroup>
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
)(injectIntl(PhoneNumber));
