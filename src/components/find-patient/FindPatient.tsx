import React from "react";
import { connect } from "react-redux";
import { search } from "../../redux/reducers/patient";
import _ from "lodash";
import { Form, FormGroup, Input, Table } from "reactstrap";
import "./FindPatient.scss";
import { dobToAge } from "../../shared/date-util";
import { FormattedMessage } from "react-intl";
import searchIcon from "../../img/search.png";
import arrowIcon from "../../img/arrow.png";

export interface IPatientsProps extends StateProps, DispatchProps {}

export interface IPatientsState {
  query: string;
}

const TABLE_COLUMNS = (
  process.env.REACT_APP_FIND_PATIENT_TABLE_COLUMNS || "id,name,gender,age,dob"
).split(",");

const columnContent = (patient, column) => {
  switch (column) {
    case "id":
      return patient.uuid;
    case "name":
      return patient.display;
    case "gender":
      return patient.gender;
    case "age":
      return dobToAge(patient.birthdate);
    case "dob":
      return patient.birthdate && patient.birthdate.split("T")[0];
    default:
      return patient[column];
  }
};

class FindPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {
    query: "",
  };

  componentDidMount() {
    this.props.search("");
  }

  onQueryChange = (event) => {
    this.setState({
      query: event.target.value,
    });
  };

  search = (e) => {
    e.preventDefault();
    this.props.search(this.state.query);
  };

  render() {
    return (
      <div className="find-patient">
        <h1>
          <FormattedMessage id="findPatient.title" />
        </h1>
        <div className="helper-text">
          <FormattedMessage id="findPatient.subtitle" />
        </div>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.search}>
            <FormGroup className="patient-search">
              <img src={searchIcon} alt="search" className="search-icon" />
              <Input
                placeholder="Search by ID or name"
                value={this.state.query}
                onChange={this.onQueryChange}
                className="search-input"
              />
            </FormGroup>
          </Form>
          <div className="patient-table">
            <Table borderless striped responsive>
              <thead>
                <tr>
                  {_.map(TABLE_COLUMNS, (column) => (
                    <th>
                      <FormattedMessage
                        id={`findPatient.tableHeader.${column}`}
                      />
                    </th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {_.map(this.props.patients, (patient, i) => (
                  <tr key={i}>
                    {_.map(TABLE_COLUMNS, (column) => (
                      <td>{columnContent(patient, column)}</td>
                    ))}
                    <td>
                      <img
                        src={arrowIcon}
                        alt="details"
                        className="details-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ patient }) => ({
  patients: patient.patients,
  loading: patient.loading,
  error: patient.errorMessage,
});

const mapDispatchToProps = { search };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FindPatient);
