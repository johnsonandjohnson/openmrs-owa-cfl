import React from "react";
import { connect } from "react-redux";
import { search, reset } from "../../redux/reducers/patient";
import _ from "lodash";
import { Form, FormGroup, Input } from "reactstrap";
import "./FindPatient.scss";
import { FormattedMessage } from "react-intl";
import searchIcon from "../../img/search.png";
import { columnContent } from "../../shared/util/patient-util";
import { DEFAULT_FIND_PATIENT_TABLE_COLUMNS } from "../../shared/constants/patient";
import {
  SEARCH_INPUT_DELAY,
  SEARCH_INPUT_MIN_CHARS,
} from "../../shared/constants/input";
import PagedTable from "../common/PagedTable";
import { helperText } from "../../shared/util/table-util";

export interface IPatientsProps extends StateProps, DispatchProps {}

export interface IPatientsState {
  query: string;
  page: number;
}

class FindPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {
    query: "",
    page: 0,
  };

  componentDidMount() {
    this.props.reset();
  }

  search = () => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query, this.state.page);
    }
  };

  searchAfterDelay = _.debounce((e) => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query, this.state.page);
    }
  }, SEARCH_INPUT_DELAY);

  onQueryChange = (event) => {
    this.setState({
      query: event.target.value,
      page: 0,
    });
    this.searchAfterDelay();
  };

  onSearchClick = (e) => {
    e.preventDefault();
    this.searchAfterDelay.cancel();
    this.setState({
      page: 0,
    });
    this.search();
  };

  switchPage = (page) => {
    this.setState(
      {
        page,
      },
      this.search
    );
  };

  render() {
    return (
      <div className="find-patient">
        <h2>
          <FormattedMessage id="findPatient.title" />
        </h2>
        <div className="helper-text">
          <FormattedMessage id="findPatient.subtitle" />
        </div>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.onSearchClick}>
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
            <div className="helper-text">
              {helperText(
                this.state.query,
                this.props.loading,
                this.props.totalCount
              )}
            </div>
            {this.props.totalCount > 0 && (
              <PagedTable
                columns={this.props.tableColumns.split(",")}
                entities={this.props.patients}
                columnContent={columnContent}
                hasNext={this.props.hasNext}
                hasPrev={this.props.hasPrev}
                currentPage={this.props.currentPage}
                switchPage={this.switchPage}
                totalCount={this.props.totalCount}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ patient, settings }) => ({
  patients: patient.patients,
  loading: patient.loading,
  error: patient.errorMessage,
  hasNext: patient.hasNext,
  hasPrev: patient.hasPrev,
  currentPage: patient.currentPage,
  totalCount: patient.totalCount,
  tableColumns:
    (settings.findPatientTableColumnsSetting &&
      settings.findPatientTableColumnsSetting.value) ||
    DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
});

const mapDispatchToProps = { search, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FindPatient);
