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
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Spinner } from 'reactstrap';
import './Conditions.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import '../Inputs.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { getConditionHistory, saveCondition, saveConditions } from '../../redux/reducers/condition';
import { addBreadcrumbs, resetBreadcrumbs } from '../../redux/reducers/breadcrumbs';
import { PATIENT_PAGE_URL } from '../../shared/constants/openmrs';
import { getPatient } from '../../redux/reducers/patient';
import Header from '../person-header/person-header';
import PersonStatus from '../person-status/person-status';
import { STATUS_ACTIVE, STATUS_INACTIVE } from '../../shared/constants/condition';
import { formatDate } from '../../shared/util/date-util';
import { successToast } from '../toast-handler/toast-handler';

export interface IConditionsProps extends StateProps, DispatchProps, RouteComponentProps<{ patientUuid?: string }> {
  intl: any;
}

export interface IConditionsState {
  active: boolean;
  conditionToDelete: any;
}

class Condition extends React.Component<IConditionsProps, IConditionsState> {
  state = {
    active: true,
    conditionToDelete: null
  };

  redirectUrl = () => `${PATIENT_PAGE_URL}?patientId=${this.props.match.params.patientUuid}`;

  componentDidMount() {
    const id = this.props.match.params.patientUuid;
    this.props.getConditionHistory(id);
    this.props.getPatient(id);
  }

  componentDidUpdate(prevProps: Readonly<IConditionsProps>, prevState: Readonly<IConditionsState>, snapshot?: any) {
    const { patient, match, conditionUpdated } = this.props;
    const id = match.params.patientUuid;
    if (!!patient && patient !== prevProps.patient) {
      this.props.resetBreadcrumbs();
      this.props.addBreadcrumbs([
        {
          label: patient.person.preferredName.display,
          url: `${PATIENT_PAGE_URL}?patientId=${id}`,
          order: 1
        }
      ]);
    }
    if (conditionUpdated && !prevProps.conditionUpdated) {
      this.props.getConditionHistory(id);
      successToast(this.props.intl.formatMessage({ id: 'conditions.success' }));
    }
  }

  cancel = () => {
    this.props.history.goBack();
  };

  editCondition = id => () => {
    this.props.history.push(`/conditions/${this.props.match.params.patientUuid}/manage/?conditionId=${id}`);
  };

  setConditionToDelete = condition => () => {
    this.setState({
      conditionToDelete: condition
    });
  };

  switchConditionActive = condition => () => {
    condition.status = condition.status === STATUS_ACTIVE ? STATUS_INACTIVE : STATUS_ACTIVE;
    this.props.saveCondition(condition);
  };

  renderConditionRow = (condition, i) => {
    const { intl } = this.props;
    const lastCondition = condition.conditions[condition.conditions.length - 1];
    const isActive = lastCondition.status === STATUS_ACTIVE;
    if (isActive === this.state.active) {
      return (
        <tr>
          <td>{lastCondition.conditionNonCoded ? `"${lastCondition.conditionNonCoded}"` : lastCondition.concept?.name}</td>
          <td>{lastCondition.onSetDate && formatDate(intl, new Date(lastCondition.onSetDate))}</td>
          <td>
            <i className="icon-pencil edit-action" onClick={this.editCondition(lastCondition.uuid)} />
            <i className="icon-remove delete-action" onClick={this.setConditionToDelete(condition)} />
            <button className="btn-small set-status-button" onClick={this.switchConditionActive(lastCondition)}>{`${intl.formatMessage({
              id: 'conditions.set'
            })} ${isActive ? STATUS_INACTIVE : STATUS_ACTIVE}`}</button>
          </td>
        </tr>
      );
    }
  };

  switchActive = () => {
    this.setState({
      active: !this.state.active
    });
  };

  voidCondition = () => {
    const { conditionToDelete } = this.state;
    conditionToDelete.conditions.forEach(condition => {
      condition.voided = true;
      condition.endDate = new Date().toISOString();
    });
    this.props.saveConditions(conditionToDelete.conditions);
    this.setState({
      conditionToDelete: null
    });
  };

  renderDeleteModal = () => (
    <Modal isOpen fade={false}>
      <ModalHeader closeButton>
        <FormattedMessage id="conditions.remove" />
      </ModalHeader>

      <ModalBody>
        <p>
          <FormattedMessage id="conditions.removeConfirmation" />
        </p>
      </ModalBody>

      <ModalFooter>
        <button className="btn cancel" onClick={this.setConditionToDelete(null)}>
          <FormattedMessage id="conditions.no" />
        </button>
        <button className="btn btn-primary" onClick={this.voidCondition}>
          <FormattedMessage id="conditions.yes" />
        </button>
      </ModalFooter>
    </Modal>
  );

  renderConditionTable = () => (
    <Table borderless striped responsive className="table">
      <thead>
        <tr>
          <th>
            <FormattedMessage id="conditions.condition" />
          </th>
          <th>
            <FormattedMessage id="conditions.onsetDate" />
          </th>
          <th>
            <FormattedMessage id="conditions.actions" />
          </th>
        </tr>
      </thead>
      <tbody>{this.props.conditions.map((condition, i) => this.renderConditionRow(condition, i))}</tbody>
    </Table>
  );

  loading = () => (
    <div className="px-5 py-3">
      <Spinner />
    </div>
  );

  render() {
    const headerProps = {
      ...this.props,
      patientUuid: this.props.match.params.patientUuid,
      dashboardType: 'PATIENT',
      redirectUrl: this.redirectUrl(),
      displayTelephone: true
    };
    return (
      <div className="conditions">
        <Header {...headerProps}>
          <PersonStatus patientUuid={headerProps.patientUuid} />
        </Header>
        {!!this.state.conditionToDelete && this.renderDeleteModal()}
        <h2>
          <FormattedMessage id={'conditions.title'} />
        </h2>
        <div className="inner-content">
          <div className="error">{this.props.error}</div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <div className={`nav-link ${this.state.active && 'active'}`} onClick={this.switchActive}>
                <FormattedMessage id={'conditions.active'} />
              </div>
            </li>
            <li className="nav-item">
              <div className={`nav-link ${!this.state.active && 'active'}`} onClick={this.switchActive}>
                <FormattedMessage id={'conditions.inactive'} />
              </div>
            </li>
          </ul>
          {this.props.loading && this.props.conditions.length === 0 ? this.loading() : this.renderConditionTable()}
        </div>
        <div className="mt-5">
          <div className="d-inline">
            <a href={this.redirectUrl()} className="cancel btn">
              <FormattedMessage id={'common.return'} />
            </a>
          </div>
          <div className="d-inline pull-right confirm-button-container">
            <Link to={this.props.location.pathname + '/manage'} className="save btn">
              <FormattedMessage id='Add New Condition' />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ condition, cflPatient, cflPerson }) => ({
  error: condition.errorMessage,
  conditions: condition.conditions,
  loading: condition.loading,
  conditionUpdated: condition.conditionUpdated,
  patient: cflPatient.patient,
  person: cflPerson.person
});

const mapDispatchToProps = { saveCondition, saveConditions, getConditionHistory, addBreadcrumbs, resetBreadcrumbs, getPatient };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Condition)));
