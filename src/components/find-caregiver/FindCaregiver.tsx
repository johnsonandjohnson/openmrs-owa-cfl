/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { connect } from 'react-redux';
import { reset, search } from '../../redux/reducers/cfl-people';
import _ from 'lodash';
import { Form, FormGroup, Input, Spinner } from 'reactstrap';
import './FindCaregiver.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import searchIcon from '../../assets/img/search.png';
import { columnContent } from '../../shared/util/cfl-person-util';
import { DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS } from '../../shared/constants/patient';
import { SEARCH_INPUT_DELAY, SEARCH_INPUT_MIN_CHARS } from '../../shared/constants/input';
import { DEFAULT_PAGE_SIZE, pageOf } from '../../redux/page.util';
import { helperText } from '../../shared/util/table-util';
import { PATIENT_PAGE_URL } from '../../shared/constants/openmrs';
import InfiniteTable from '../common/InfiniteTable';

export interface ICaregiversProps extends StateProps, DispatchProps {
  intl: any;
}

export interface ICaregiversState {
  query: string;
  page: number;
}

class FindCaregiver extends React.Component<ICaregiversProps, ICaregiversState> {
  state = {
    query: '',
    page: 0
  };

  searchAfterDelay = _.debounce(e => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query);
    }
  }, SEARCH_INPUT_DELAY);

  componentDidMount() {
    this.props.reset();
  }

  search = () => {
    if (this.state.query.length >= SEARCH_INPUT_MIN_CHARS) {
      this.props.search(this.state.query);
    }
  };

  onQueryChange = event => {
    this.setState({
      query: event.target.value,
      page: 0
    });
    this.searchAfterDelay();
  };

  onSearchClick = e => {
    e.preventDefault();
    this.searchAfterDelay.cancel();
    this.setState({
      page: 0
    });
    this.search();
  };

  switchPage = page =>
    this.setState({
      page
    });

  getRecordLink = entity => `${PATIENT_PAGE_URL}?patientId=${entity.uuid}&dashboard=person`;

  render() {
    return (
      <div className="find-caregiver">
        <h2>
          <FormattedMessage id="findCaregiver.title" />
        </h2>
        <div className="error">{this.props.error}</div>
        <div className="search-section">
          <Form onSubmit={this.onSearchClick}>
            <FormGroup className="caregiver-search">
              <img src={searchIcon} alt="search" className="search-icon" />
              <Input
                id="search-caregiver"
                placeholder={this.props.intl.formatMessage({
                  id: 'findCaregiver.searchInputPlaceholder'
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
                helperText(this.state.query, this.props.loading, this.props.totalCount)
              )}
            </div>
            {this.props.totalCount > 0 && (
              <InfiniteTable
                columns={this.props.tableColumns.split(',')}
                // frontend paging as the endpoint has no support for it
                entities={pageOf(this.props.caregivers, this.state.page)}
                columnContent={columnContent}
                hasNext={this.props.totalCount > (this.state.page + 1) * DEFAULT_PAGE_SIZE}
                currentPage={this.state.page}
                switchPage={this.switchPage}
                getRecordLink={this.getRecordLink}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ cflPeople, apps }) => ({
  caregivers: cflPeople.people,
  loading: cflPeople.loading,
  error: cflPeople.errorMessage,
  hasNext: cflPeople.hasNext,
  hasPrev: cflPeople.hasPrev,
  currentPage: cflPeople.currentPage,
  totalCount: cflPeople.totalCount,
  tableColumns: (apps.findCaregiverTableColumns && apps.findCaregiverTableColumns) || DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS
});

const mapDispatchToProps = { search, reset };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FindCaregiver));
