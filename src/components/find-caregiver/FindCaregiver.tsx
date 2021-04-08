import React from "react";
import { connect } from "react-redux";
import { reset, search } from "../../redux/reducers/cfl-people";
import _ from "lodash";
import { Form, FormGroup, Input, Spinner } from "reactstrap";
import "./FindCaregiver.scss";
import { FormattedMessage, injectIntl } from "react-intl";
import searchIcon from "../../assets/img/search.png";
import { columnContent } from "../../shared/util/cfl-person-util";
import { DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS } from "../../shared/constants/patient";
import {
  SEARCH_INPUT_DELAY,
  SEARCH_INPUT_MIN_CHARS,
} from "../../shared/constants/input";
import PagedTable from "../common/PagedTable";
import { DEFAULT_PAGE_SIZE, pageOf } from "../../redux/page.util";
import { helperText } from "../../shared/util/table-util";
import { PATIENT_PAGE_URL } from "../../shared/constants/openmrs";

export interface ICaregiversProps extends StateProps, DispatchProps {
  intl: any;
}

export interface ICaregiversState {
  query: string;
  page: number;
}

class FindCaregiver extends React.Component<
  ICaregiversProps,
  ICaregiversState
> {
  state = {
    query: "",
    page: 0,
  };

  componentDidMount() {
    this.props.reset();
  }

  search = () => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query);
    }
  };

  searchAfterDelay = _.debounce((e) => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query);
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
    this.setState({
      page,
    });
  };

  getRecordLink = (entity) => {
    return `${PATIENT_PAGE_URL}?patientId=${entity.uuid}&dashboard=person`;
  };

  render() {
    return (
      <div className="find-caregiver">
        <h2>
          <FormattedMessage id="findCaregiver.title" />
        </h2>
        <div className="helper-text">
          <FormattedMessage id="findCaregiver.subtitle" />
        </div>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.onSearchClick}>
            <FormGroup className="caregiver-search">
              <img src={searchIcon} alt="search" className="search-icon" />
              <Input
                placeholder={this.props.intl.formatMessage({
                  id: "findCaregiver.searchInputPlaceholder",
                })}
                value={this.state.query}
                onChange={this.onQueryChange}
                className="search-input"
              />
            </FormGroup>
          </Form>
          <div className="caregiver-table">
            <div className="helper-text">
              {this.props.loading ? (
                <Spinner color="dark" size="sm" />
              ) : (
                helperText(
                  this.state.query,
                  this.props.loading,
                  this.props.totalCount
                )
              )}
            </div>
            {this.props.totalCount > 0 && (
              <PagedTable
                columns={this.props.tableColumns.split(",")}
                // frontend paging as the endpoint has no support for it
                entities={pageOf(this.props.caregivers, this.state.page)}
                columnContent={columnContent}
                hasNext={
                  this.props.totalCount >
                  (this.state.page + 1) * DEFAULT_PAGE_SIZE
                }
                hasPrev={this.state.page > 0}
                currentPage={this.state.page}
                switchPage={this.switchPage}
                totalCount={this.props.totalCount}
                getRecordLink={this.getRecordLink}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ cflPeople, settings }) => ({
  caregivers: cflPeople.people,
  loading: cflPeople.loading,
  error: cflPeople.errorMessage,
  hasNext: cflPeople.hasNext,
  hasPrev: cflPeople.hasPrev,
  currentPage: cflPeople.currentPage,
  totalCount: cflPeople.totalCount,
  tableColumns:
    (settings.findCaregiverTableColumnsSetting &&
      settings.findCaregiverTableColumnsSetting.value) ||
    DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
});

const mapDispatchToProps = { search, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(FindCaregiver));
