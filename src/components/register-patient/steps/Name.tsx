import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";

export interface INameProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

const fields = [
  {
    name: "givenName",
    required: true,
  },
  {
    name: "middleName",
    required: false,
  },
  {
    name: "familyName",
    required: true,
  },
];

export interface INameState {
  invalidFields: any[];
}

class Name extends React.Component<INameProps, INameState> {
  state = {
    invalidFields: [],
  };

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
    const { invalidFields } = this.state;
    return (
      <>
        <div className="step-fields">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.name.title"} />
            </h2>
            <p>
              <FormattedMessage id={"registerPatient.steps.name.subtitle"} />
            </p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap flex-md-nowrap">
            {_.map(fields, (field) =>
              this.props.renderField(field, invalidFields)
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Name));
