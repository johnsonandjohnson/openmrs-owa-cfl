import React from "react";
import { connect } from "react-redux";
import { search } from "../../redux/reducers/patient";
import _ from "lodash";
import { Form, FormGroup, Input, Table } from "reactstrap";
import "./FindPatient.scss";
import { dobToAge } from "../../shared/date-util";
import { FormattedMessage } from "react-intl";

export interface IPatientsProps extends StateProps, DispatchProps {}

export interface IPatientsState {
  query: string;
}

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
      <div className="patients">
        <h2>
          <FormattedMessage id="findPatient.title" />
        </h2>
        <div className="subtitle">
          <FormattedMessage id="findPatient.subtitle" />
        </div>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.search}>
            <FormGroup>
              <Input
                placeholder="Search by ID or name"
                value={this.state.query}
                onChange={this.onQueryChange}
                className="patient-search"
              />
            </FormGroup>
          </Form>
          <div className="patient-table">
            <Table borderless striped>
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="findPatient.tableHeader.id" />
                  </th>
                  <th>
                    <FormattedMessage id="findPatient.tableHeader.name" />
                  </th>
                  <th>
                    <FormattedMessage id="findPatient.tableHeader.gender" />
                  </th>
                  <th>
                    <FormattedMessage id="findPatient.tableHeader.age" />
                  </th>
                  <th>
                    <FormattedMessage id="findPatient.tableHeader.dob" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {_.map(this.props.patients, (patient, i) => (
                  <tr key={i}>
                    <td>{patient.uuid}</td>
                    <td>{patient.display}</td>
                    <td>{patient.gender}</td>
                    <td>{dobToAge(patient.birthdate)}</td>
                    <td>
                      {patient.birthdate && patient.birthdate.split("T")[0]}
                    </td>
                    <td></td>
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
