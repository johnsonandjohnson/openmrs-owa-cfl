import React from "react";
import { connect } from "react-redux";
import { reset, search } from "../../redux/reducers/person";
import _ from "lodash";
import { Form, FormGroup, Input } from "reactstrap";
import "./FindCaregiver.scss";
import { FormattedMessage } from "react-intl";
import searchIcon from "../../img/search.png";
import { columnContent } from "../../shared/util/person-util";
import { CAREGIVER_TABLE_COLUMNS } from "../../shared/constants/patient";
import {
  SEARCH_INPUT_DELAY,
  SEARCH_INPUT_MIN_CHARS,
} from "../../shared/constants/input";
import PagedTable from "../common/PagedTable";

export interface ICaregiversProps extends StateProps, DispatchProps {}

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
      this.searchAfterDelay.cancel();
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
    this.switchPage(0);
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
      <div className="find-caregiver">
        <h1>
          <FormattedMessage id="findCaregiver.title" />
        </h1>
        <div className="helper-text">
          <FormattedMessage id="findCaregiver.subtitle" />
        </div>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.onSearchClick}>
            <FormGroup className="caregiver-search">
              <img src={searchIcon} alt="search" className="search-icon" />
              <Input
                placeholder="Search by ID or name"
                value={this.state.query}
                onChange={this.onQueryChange}
                className="search-input"
              />
            </FormGroup>
          </Form>
          <div className="caregiver-table">
            <PagedTable
              columns={CAREGIVER_TABLE_COLUMNS}
              entities={this.props.caregivers}
              columnContent={columnContent}
              hasNext={this.props.hasNext}
              hasPrev={this.props.hasPrev}
              currentPage={this.props.currentPage}
              switchPage={this.switchPage}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ person }) => ({
  caregivers: person.people,
  loading: person.loading,
  error: person.errorMessage,
  hasNext: person.hasNext,
  hasPrev: person.hasPrev,
  currentPage: person.currentPage,
});

const mapDispatchToProps = { search, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FindCaregiver);
