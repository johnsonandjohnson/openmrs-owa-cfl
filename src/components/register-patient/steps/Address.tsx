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

export interface IAddressProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export const defaultFields = [
  {
    name: "address1",
    required: false,
  },
  {
    name: "address2",
    required: false,
  },
  {
    name: "cityVillage",
    required: false,
  },
  {
    name: "stateProvince",
    required: false,
  },
  {
    name: "country",
    required: false,
  },
  {
    name: "postalCode",
    required: false,
  },
];

export interface IAddressState {
  invalidFields: any[];
}

class Address extends React.Component<IAddressProps, IAddressState> {
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
              <FormattedMessage id={"registerPatient.steps.address.title"} />
            </h2>
            <p>
              <FormattedMessage id={"registerPatient.steps.address.subtitle"} />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap">
            {_.map(fields, (field) =>
              this.props.renderField(
                field,
                this.state.invalidFields,
                null,
                "col-sm-6"
              )
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
    getSettingOrDefault(settings, REGISTRATION_SETTINGS.addressFields)
  ),
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Address));
