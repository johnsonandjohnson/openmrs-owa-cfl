import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { IPatient } from "../../../shared/models/patient";
import { Alert } from "reactstrap";
import _ from "lodash";

export interface IConfirmProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

export interface IConfirmState {}

class Confirm extends React.Component<IConfirmProps, IConfirmState> {
  state = {};

  componentDidMount() {}

  validate = () => {
    return true;
  };

  gender = (patient) => {
    const { intl } = this.props;
    if (patient.gender === "M") {
      return intl.formatMessage({ id: `registerPatient.steps.gender.male` });
    } else if (patient.gender === "F") {
      return intl.formatMessage({ id: `registerPatient.steps.gender.female` });
    } else {
      return intl.formatMessage({ id: `registerPatient.unknown` });
    }
  };

  birthdate = (patient) => {
    const { intl } = this.props;
    if (
      !!patient.birthdateDay &&
      !!patient.birthdateMonth &&
      !!patient.birthdateYear
    ) {
      return intl.formatDate(
        new Date(
          patient.birthdateYear,
          patient.birthdateMonth,
          patient.birthdateDay
        )
      );
    } else if (!!patient.birthdateYears || !!patient.birthdateMonths) {
      const yearPart =
        !!patient.birthdateYears &&
        patient.birthdateYears +
          " " +
          intl.formatMessage({ id: "registerPatient.steps.confirm.years" });
      const monthPart =
        !!patient.birthdateMonths &&
        patient.birthdateMonths +
          " " +
          intl.formatMessage({ id: "registerPatient.steps.confirm.months" });
      return [
        intl.formatMessage({ id: "registerPatient.steps.confirm.estimated" }),
        yearPart,
        monthPart,
      ]
        .filter(Boolean)
        .join(" ");
    }
  };

  address = (patient) => {
    return [
      patient.address1,
      patient.address2,
      patient.cityVillage,
      patient.stateProvince,
      patient.country,
      patient.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  location = (patient) => {
    if (patient.locationId) {
      return this.props.locations.find((loc) => loc.uuid === patient.locationId)
        ?.display;
    }
  };

  relationshipType = (relationshipTypeId) => {
    const relationshipType = this.props.relationshipTypes.find(
      (relationshipType) =>
        relationshipTypeId.indexOf(relationshipType.uuid) >= 0
    );
    return relationshipTypeId.endsWith("-A")
      ? relationshipType.displayAIsToB
      : relationshipType.displayBIsToA;
  };

  relatives = (patient) => {
    return (
      patient.relatives &&
      patient.relatives
        .filter(
          (relative) => !!relative.relationshipType && !!relative.otherPerson
        )
        .map((relative) =>
          [
            this.relationshipType(relative.relationshipType),
            relative.otherPerson.label,
          ].join(" - ")
        )
        .join(", ")
    );
  };

  fields = (patient) => {
    return {
      name: [patient.givenName, patient.middleName, patient.familyName]
        .filter(Boolean)
        .join(" "),
      gender: this.gender(patient),
      birthdate: this.birthdate(patient),
      address: this.address(patient),
      language: patient.personLanguage,
      phoneNumber: patient.phoneNumber,
      location: this.location(patient),
      aadharNumber: patient.aadharNumber,
      artNumber: patient.artNumber,
      relatives: this.relatives(patient),
    };
  };

  renderField = (key, value) => {
    return (
      <div className="mb-3">
        <span className="helper-text mr-3">
          <FormattedMessage id={"registerPatient.fields." + key} />:
        </span>
        <span>{value}</span>
      </div>
    );
  };

  errors = (errors) => {
    return (
      errors &&
      _.map(errors, (err) => (
        <Alert color="danger">
          {err && err.replace(/<\/?[^>]+(>|$)/g, "")}
        </Alert>
      ))
    );
  };

  render() {
    const fields = this.fields(this.props.patient);
    const fieldKeys = Object.getOwnPropertyNames(fields);
    const itemsPerColumn = Math.floor(fieldKeys.length / 2);
    const { errors } = this.props;
    return (
      <>
        <div className="step-fields">
          {this.errors(errors)}
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.confirm.title"} />
            </h2>
            <p>
              <FormattedMessage id={"registerPatient.steps.confirm.subtitle"} />
            </p>
          </div>
          <div className="row">
            <div className="col-sm-6">
              {fieldKeys
                .slice(0, itemsPerColumn)
                .map((key) => this.renderField(key, fields[key]))}
            </div>
            <div className="col-sm-6">
              {fieldKeys
                .slice(itemsPerColumn)
                .map((key) => this.renderField(key, fields[key]))}
            </div>
          </div>
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ relationshipType, location, registration }) => ({
  relationshipTypes: relationshipType.relationshipTypes,
  locations: location.locations,
  errors: registration.errors,
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Confirm));
