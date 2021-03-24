import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";
import { search } from "../../../redux/reducers/location";
import {
  getSettingOrDefault,
  parseJsonSetting,
} from "../../../shared/util/setting-util";
import { REGISTRATION_SETTINGS } from "../../../shared/constants/setting";

export interface IPatientLocationProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export const defaultFields = [
  {
    name: "locationId",
    required: false,
    type: "select",
  },
];

export interface IPatientLocationState {
  invalidFields: any[];
}

class PatientLocation extends React.Component<
  IPatientLocationProps,
  IPatientLocationState
> {
  state = { invalidFields: [] };

  componentDidMount() {
    this.props.search("");
  }

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
    const locationOptions = (
      <>
        <option
          value=""
          disabled
          selected
          hidden
        >{`${this.props.intl.formatMessage({
          id: "registerPatient.fields.patientLocation",
        })}`}</option>
        {this.props.locations.map((l) => (
          <option value={l.uuid}>{l.display}</option>
        ))}
      </>
    );
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage
                id={"registerPatient.steps.patientLocation.title"}
              />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.patientLocation.subtitle"}
              />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
            {_.map(this.props.fields, (field) =>
              this.props.renderField(
                field,
                this.state.invalidFields,
                locationOptions
              )
            )}
          </FormGroup>
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ location, settings }) => ({
  locations: location.locations,
  fields: parseJsonSetting(
    getSettingOrDefault(settings, REGISTRATION_SETTINGS.patientLocationFields)
  ),
});
const mapDispatchToProps = {
  search,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PatientLocation));
