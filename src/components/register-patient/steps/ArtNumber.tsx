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

export interface IArtNumberProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export const defaultFields = [
  {
    name: "artNumber",
    required: false,
    type: "number",
  },
];

export interface IArtNumberState {
  invalidFields: any[];
}

class ArtNumber extends React.Component<IArtNumberProps, IArtNumberState> {
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
    const { fields } = this.props;
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.artNumber.title"} />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.artNumber.subtitle"}
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

const mapStateToProps = ({ settings }) => ({
  fields: parseJsonSetting(
    getSettingOrDefault(settings, REGISTRATION_SETTINGS.artNumberFields)
  ),
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ArtNumber));
