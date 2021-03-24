import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";

export interface IAddressProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

const fields = [
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
      fields,
      (field) => field.required && !this.props.patient[field.name]
    );
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  render() {
    const { intl, patient, onPatientChange } = this.props;
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

const mapStateToProps = (rootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Address));
