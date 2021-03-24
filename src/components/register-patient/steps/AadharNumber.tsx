import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";
import {
  getSettingOrDefault,
  parseJsonSetting,
} from "../../../shared/util/setting-util";
import { REGISTRATION_SETTINGS } from "../../../shared/constants/setting";

export interface IAadharNumberProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export const defaultFields = [
  {
    name: "aadharNumber",
    required: false,
    type: "number",
  },
];

export interface IAadharNumberState {
  invalidFields: any[];
}

class AadharNumber extends React.Component<
  IAadharNumberProps,
  IAadharNumberState
> {
  state = { invalidFields: [] };

  componentDidMount() {}

  validate = () => {
    const invalidFields = _.filter(
      this.props.fields,
      (field) => field.required && !this.props.patient[field.name]
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
                id={"registerPatient.steps.aadharNumber.title"}
              />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.aadharNumber.subtitle"}
              />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
            {_.map(this.props.fields, (field) =>
              this.props.renderField(field, this.state.invalidFields)
            )}
          </FormGroup>
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ settings }) => ({
  fields: parseJsonSetting(
    getSettingOrDefault(settings, REGISTRATION_SETTINGS.aadharNumberFields)
  ),
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AadharNumber));
