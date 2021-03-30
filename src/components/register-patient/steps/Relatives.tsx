import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import { IPatient } from "../../../shared/models/patient";
import _ from "lodash";
import Plus from "../../../img/plus.png";
import Minus from "../../../img/minus.png";
import { getRelationshipTypes } from "../../../redux/reducers/relationship-type";
import Select from "react-select";
import { reset, search } from "../../../redux/reducers/patient";

export interface IRelativesProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  renderField: any;
}

const OTHER_PERSON_NAME = "otherPersonInput";

const relationshipTypeField = {
  name: "relationshipType",
  required: false,
  type: "select",
};

const otherPersonField = {
  name: "otherPerson",
  required: false,
};

export const rowFields = [relationshipTypeField, otherPersonField];

export interface IRelative {
  relationshipType: string;
  otherPerson: object | null;
  otherPersonInput: string;
}

const emptyRelative = {
  relationshipType: "",
  otherPerson: null,
  otherPersonInput: "",
};

export interface IRelativesState {
  invalidFields: any[];
  relatives: IRelative[];
  otherPersonInput: string;
}

class Relatives extends React.Component<IRelativesProps, IRelativesState> {
  state = {
    invalidFields: [],
    relatives: [] as IRelative[],
    otherPersonInput: "",
  };

  componentDidMount() {
    this.props.getRelationshipTypes();
    this.props.reset();
  }

  componentDidUpdate(
    prevProps: Readonly<IRelativesProps>,
    prevState: Readonly<IRelativesState>,
    snapshot?: any
  ) {
    const { patient } = this.props;
    if (prevProps.patient !== patient && !!patient) {
      this.setState({
        relatives:
          patient.relatives && patient.relatives.length > 0
            ? patient.relatives
            : [{ ...emptyRelative }],
      });
    }
  }

  validate = () => {
    const invalidFields = _.filter(
      rowFields,
      (field) => field.required && !this.props.patient[field.name]
    );
    this.setState({
      invalidFields,
    });
    return invalidFields.length === 0;
  };

  addRelative = () => {
    const { relatives } = this.state;
    relatives.push({ ...emptyRelative });
    this.setState({
      relatives,
    });
  };

  relationshipTypeOptions = () => {
    return (
      <>
        <option
          value=""
          disabled
          selected
          hidden
        >{`${this.props.intl.formatMessage({
          id: "registerPatient.fields.relationshipType",
        })}`}</option>
        {this.props.relationshipTypes
          .filter((relationshipType) => !relationshipType.retired)
          .map((relationshipType) => (
            <>
              <option value={relationshipType.uuid + "-A"}>
                {relationshipType.displayAIsToB}
              </option>
              <option value={relationshipType.uuid + "-B"}>
                {relationshipType.displayBIsToA}
              </option>
            </>
          ))}
      </>
    );
  };

  removeRelative = (rowNo) => () => {
    const { relatives } = this.state;
    if (relatives.length > 1) {
      relatives.splice(rowNo, 1);
    }
    this.setState({
      relatives,
    });
  };

  onChangeEvent = (rowNo, fieldName) => (event) => {
    this.onChange(rowNo, fieldName)(event.target.value);
  };

  onChange = (rowNo, fieldName) => (value) => {
    const { relatives } = this.state;
    const { patient, onPatientChange } = this.props;
    if (fieldName === OTHER_PERSON_NAME) {
      relatives[rowNo].otherPersonInput = value;
      this.setState({
        relatives,
        otherPersonInput: value,
      });
      this.loadOptions();
    } else {
      relatives[rowNo][fieldName] = value;
      this.setState({
        relatives,
      });
    }
    patient.relatives = relatives;
    onPatientChange(patient);
  };

  loadOptions = _.debounce((e) => {
    this.props.search(this.state.otherPersonInput);
  }, 500);

  patientOptions = (rowNo) => {
    const { relatives } = this.state;
    const name = relatives[rowNo].otherPersonInput;
    const options =
      name && name.length >= 3
        ? this.props.patients.map((patient) => ({
            value: patient.uuid,
            label: patient.person.display,
          }))
        : [];
    return options;
  };

  relative = (relative, rowNo) => {
    return (
      <FormGroup className="d-flex flex-row flex-wrap">
        {rowFields.includes(relationshipTypeField) &&
          this.props.renderField(
            relationshipTypeField,
            this.state.invalidFields,
            this.relationshipTypeOptions(),
            "col-sm-4",
            relative[relationshipTypeField.name],
            this.onChangeEvent(rowNo, relationshipTypeField.name)
          )}
        {rowFields.includes(otherPersonField) && (
          <Select
            options={this.patientOptions(rowNo)}
            onInputChange={this.onChange(rowNo, OTHER_PERSON_NAME)}
            onChange={this.onChange(rowNo, otherPersonField.name)}
            className="flex-fill other-person"
            classNamePrefix="other-person"
            placeholder={`${this.props.intl.formatMessage({
              id: "registerPatient.fields.otherPerson",
            })}`}
            value={relative.otherPerson}
          />
        )}
        <div className="align-items-center justify-content-center d-flex">
          <img
            src={Plus}
            alt="add"
            className="mx-2"
            onClick={this.addRelative}
          />
          <img src={Minus} alt="remove" onClick={this.removeRelative(rowNo)} />
        </div>
      </FormGroup>
    );
  };

  render() {
    return (
      <>
        <div className="step-fields relatives">
          <div className="step-title">
            <h2>
              <FormattedMessage id={"registerPatient.steps.relatives.title"} />
            </h2>
            <p>
              <FormattedMessage
                id={"registerPatient.steps.relatives.subtitle"}
              />
            </p>
          </div>
          {_.map(this.state.relatives, (relative, i) =>
            this.relative(relative, i)
          )}
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ relationshipType, patient }) => ({
  relationshipTypes: relationshipType.relationshipTypes,
  patients: patient.patients || [],
});

const mapDispatchToProps = {
  getRelationshipTypes,
  search,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Relatives));
