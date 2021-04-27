import React from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { FormGroup } from "reactstrap";
import _ from "lodash";
import Plus from "../../../assets/img/plus.png";
import Minus from "../../../assets/img/minus.png";
import { getRelationshipTypes } from "../../../redux/reducers/relationship-type";
import Select from "react-select";
import { reset, search } from "../../../redux/reducers/patient";
import Field, { IFieldProps } from "./Field";

export interface IRelativesProps
  extends StateProps,
    DispatchProps,
    IFieldProps {
  intl: any;
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

  addRelative = () => {
    const { relatives } = this.state;
    relatives.push({ ...emptyRelative });
    this.setState({
      relatives,
    });
  };

  relationshipTypeOptions = () => {
    return this.props.relationshipTypes
      .filter((relationshipType) => !relationshipType.retired)
      .flatMap((relationshipType) => [
        {
          value: relationshipType.uuid + "-A",
          label: relationshipType.displayAIsToB,
        },
        {
          value: relationshipType.uuid + "-B",
          label: relationshipType.displayBIsToA,
        },
      ]);
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
    const otherPersonPlaceholder = this.props.intl.formatMessage({
      id: "registerPatient.fields.otherPerson",
    });
    return (
      <FormGroup className="d-flex flex-row flex-wrap w-100">
        {rowFields.includes(relationshipTypeField) && (
          <Field
            {...this.props}
            field={relationshipTypeField}
            selectOptions={this.relationshipTypeOptions()}
            value={relative[relationshipTypeField.name]}
            onChange={this.onChangeEvent(rowNo, relationshipTypeField.name)}
            onKeyDown={null}
          />
        )}
        {rowFields.includes(otherPersonField) && (
          <div className={`input-container flex-fill`}>
            <Select
              options={this.patientOptions(rowNo)}
              onInputChange={this.onChange(rowNo, OTHER_PERSON_NAME)}
              onChange={this.onChange(rowNo, otherPersonField.name)}
              className="flex-fill other-person"
              classNamePrefix="other-person"
              placeholder={otherPersonPlaceholder}
              value={relative.otherPerson}
              onKeyDown={
                rowNo + 1 === this.state.relatives.length
                  ? this.props.onKeyDown
                  : null
              }
            />
            {!!relative.otherPerson && (
              <span className="placeholder">{otherPersonPlaceholder}</span>
            )}
          </div>
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
        {_.map(this.state.relatives, (relative, i) =>
          this.relative(relative, i)
        )}
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
