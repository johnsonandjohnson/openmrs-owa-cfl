/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from "react";
import { connect } from "react-redux";
import { reset, searchConcepts } from "../../redux/reducers/concept";
import _ from "lodash";
import { Button, FormGroup } from "reactstrap";
import "./Conditions.scss";
import { FormattedMessage, injectIntl } from "react-intl";
import { getSettingByQuery } from "../../redux/reducers/settings";
import Select from "react-select/creatable";
import "../Inputs.scss";
import { DATE_FORMAT, MONTH_NAMES_KEYS, WEEK_DAYS_KEYS, isoDateString } from "../../shared/util/date-util";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getCondition, saveCondition } from "../../redux/reducers/condition";
import queryString from "query-string";
import { addBreadcrumbs, resetBreadcrumbs } from "../../redux/reducers/breadcrumbs";
import { PATIENT_PAGE_URL } from "../../shared/constants/openmrs";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../../shared/constants/condition";
import { getPatient } from "../../redux/reducers/patient";
import { successToast } from "../toast-handler/toast-handler";
import PatientHeader from "../patient-header/patient-header";

export interface IConditionsProps extends StateProps, DispatchProps, RouteComponentProps<{ patientUuid?: string }> {
  intl: any;
}

export interface IConditionsState {
  conceptQuery: string;
  concept: object | null;
  conceptInput: string;
  onsetDate: any;
  endDate: any;
  active: boolean;
}

class Condition extends React.Component<IConditionsProps, IConditionsState> {
  state = {
    conceptQuery: "",
    concept: null,
    conceptInput: "",
    onsetDate: null,
    endDate: null,
    active: true,
  };

  loadOptions = _.debounce(() => {
    this.searchConcepts();
  }, 500);

  setConceptInput = (value) => {
    this.setState({
      conceptQuery: value,
      conceptInput: value,
    });
    this.loadOptions();
  };

  onConceptChange = (concept) => {
    this.setState({
      concept,
    });
  };

  conditionId = () => {
    const params = queryString.parse(this.props.location.search);
    return params.conditionId;
  };

  componentDidMount() {
    this.props.reset();
    this.props.getSettingByQuery("coreapps.conditionListClasses");
    const conditionId = this.conditionId();
    if (!!conditionId) {
      this.props.getCondition(conditionId);
    }
    const id = this.props.match.params.patientUuid;
    this.props.getPatient(id);
  }

  componentDidUpdate(prevProps: Readonly<IConditionsProps>, prevState: Readonly<IConditionsState>, snapshot?: any) {
    const { condition, patient, match, conditionUpdated, conceptListClasses } = this.props;
    const id = match.params.patientUuid;
    if (prevProps.condition !== condition && !!condition) {
      const { concept, status, onSetDate, endDate, conditionNonCoded } = condition;
      this.setState({
        concept: concept && {
          label: conditionNonCoded ? `"${conditionNonCoded}"` : concept.name,
          value: concept.uuid,
        },
        active: status === STATUS_ACTIVE,
        onsetDate: onSetDate && new Date(onSetDate),
        endDate: endDate && new Date(endDate),
      });
    }
    if (prevProps.conceptListClasses !== conceptListClasses) {
      this.props.searchConcepts("", conceptListClasses);
    }
    if (!!patient && patient !== prevProps.patient) {
      this.props.resetBreadcrumbs();
      this.props.addBreadcrumbs([
        {
          label: patient.person.preferredName.display,
          url: `${PATIENT_PAGE_URL}?patientId=${id}`,
          order: 1,
        },
      ]);
    }
    if (conditionUpdated && !prevProps.conditionUpdated) {
      successToast(this.props.intl.formatMessage({ id: "conditions.success" }));
      this.props.history.push(`/conditions/${this.props.match.params.patientUuid}`);
    }
  }

  searchConcepts = () => {
    if (this.state.conceptInput.length > 0 && this.state.conceptInput !== this.props.conceptQuery) {
      this.props.searchConcepts(this.state.conceptInput, this.props.conceptListClasses);
    }
  };

  onConceptFocus = () => {
    const { concept } = this.state;
    if (!!concept) {
      this.setConceptInput(concept.label);
    }
  };

  onQueryChange = (conceptQuery) => {
    this.setConceptInput(conceptQuery);
    this.loadOptions();
  };

  conceptOptions = () => {
    const { concepts } = this.props;
    const options = concepts.map((concept) => ({
      value: concept.concept.uuid,
      label: concept.display,
    }));
    return options;
  };

  onOnsetDateChange = (onsetDate) => {
    this.setState({
      onsetDate,
    });
  };

  onEndDateChange = (endDate) => {
    this.setState({
      endDate,
    });
  };

  onActiveChange = (active) => () => {
    this.setState({
      active,
    });
  };

  cancel = () => {
    this.props.history.push(`/conditions/${this.props.match.params.patientUuid}`);
  };

  save = () => {
    if (this.state.concept) {
      this.saveConditionConcept();
    }
  };

  saveConditionConcept = () => {
    const conditionId = this.conditionId();
    const condition = !!conditionId ? { ...this.props.condition } : {};

    condition.status = this.getConditionStatus();
    condition.patientUuid = this.props.match.params.patientUuid;

    if (this.state.concept?.__isNew__) {
      condition.concept = { uuid: "", name: "", shortName: "" };
      condition.conditionNonCoded = this.state.concept.label;
    } else {
      condition.concept = { ...(condition.concept || {}), uuid: this.state.concept.value };
    }

    condition.onSetDate = this.getSetDate();
    condition.endDate = this.getEndDate();
    condition.voided = false;

    if (!condition.additionalDetail) {
      condition.additionalDetail = "";
    }
    if (!condition.endReason) {
      condition.endReason = { shortName: "" };
    }

    this.props.saveCondition(condition);
  };

  getConditionStatus = () => (this.state.active ? STATUS_ACTIVE : STATUS_INACTIVE);

  getSetDate = () => isoDateString(this.state.onsetDate || new Date());

  getEndDate = () => (!this.state.active ? isoDateString(this.state.endDate) : "");

  getDayLabelsKey = () => {
    return WEEK_DAYS_KEYS.map((key) => this.props.intl.formatMessage({ id: key }));
  };

  getMonthLabelsKey = () => {
    return MONTH_NAMES_KEYS.map((key) => this.props.intl.formatMessage({ id: key }));
  };

  getDatePickerLocaleConfig = () => {
    const days = this.getDayLabelsKey();
    const months = this.getMonthLabelsKey();

    return {
      localize: {
        day: (n) => days[n],
        month: (n) => months[n],
      },
      formatLong: {
        date: () => DATE_FORMAT,
      },
      match: () => {},
    };
  };

  render() {
    const { intl } = this.props;
    const conditionId = this.conditionId();

    const headerProps = {
      ...this.props,
      patientUuid: this.props.match.params.patientUuid,
      dashboardType: "PATIENT",
      headerAppConfig: this.props.headerAppConfig,
    };
    return (
      <div className="condition">
        <PatientHeader {...headerProps} />
        <h2>
          <FormattedMessage id={!!conditionId ? "manageCondition.editCondition" : "manageCondition.addNewCondition"} />
        </h2>
        <div className="error">{this.props.error}</div>
        <div className="inner-content">
          <div className="d-flex">
            <div className="col-12 mt-3">
              <div className="input-container">
                <Select
                  options={this.conceptOptions()}
                  onInputChange={this.onQueryChange}
                  onChange={this.onConceptChange}
                  className="flex-fill concept"
                  classNamePrefix="default-select"
                  placeholder={intl.formatMessage({ id: "manageCondition.condition" })}
                  value={this.state.concept}
                  inputValue={this.state.conceptInput}
                  onFocus={this.onConceptFocus}
                  isDisabled={!!conditionId}
                />
                {this.state.concept && (
                  <span className="placeholder">{intl.formatMessage({ id: "manageCondition.condition" })}</span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap">
            <div className={this.state.active ? "col-12" : "col-12 col-sm-6"}>
              <div className="input-container">
                <DatePicker
                  placeholderText={intl.formatMessage({ id: "manageCondition.onsetDate" })}
                  selected={this.state.onsetDate}
                  className="form-control"
                  onChange={this.onOnsetDateChange}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat={DATE_FORMAT}
                  locale={this.getDatePickerLocaleConfig()}
                />
                {this.state.onsetDate && (
                  <span className="placeholder">{intl.formatMessage({ id: "manageCondition.onsetDate" })}</span>
                )}
              </div>
            </div>
            <div className="col-12 col-sm-6">
              {this.state.active === false && (
                <div className="input-container">
                  <DatePicker
                    placeholderText={intl.formatMessage({ id: "manageCondition.endDate" })}
                    selected={this.state.endDate}
                    className="form-control"
                    onChange={this.onEndDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat={DATE_FORMAT}
                    locale={this.getDatePickerLocaleConfig()}
                  />
                  {this.state.onsetDate && (
                    <span className="placeholder">{intl.formatMessage({ id: "manageCondition.endDate" })}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="col-12">
              <FormGroup check inline key="button-active" className="mb-2">
                <Button
                  onClick={this.onActiveChange(true)}
                  className={`select-button w-100 ${this.state.active === true ? "active" : ""}`}
                >
                  <span>{intl.formatMessage({ id: "conditions.active" })}</span>
                </Button>
              </FormGroup>
              <FormGroup check inline key="button-inactive" className="mb-2">
                <Button
                  onClick={this.onActiveChange(false)}
                  className={`select-button w-100 ${this.state.active === false ? "active" : ""}`}
                >
                  <span>{intl.formatMessage({ id: "conditions.inactive" })}</span>
                </Button>
              </FormGroup>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="d-inline">
            <Button className="cancel" onClick={this.cancel}>
              <span>{intl.formatMessage({ id: "common.cancel" })}</span>
            </Button>
          </div>
          <div className="d-inline pull-right confirm-button-container">
            <Button className="save" onClick={this.save} disabled={!this.state.concept}>
              <FormattedMessage id="common.confirm" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ concept, settings, condition, cflPatient, apps }) => ({
  concepts: concept.concepts,
  error: concept.errorMessage,
  conceptListClasses: settings.setting?.value,
  conceptQuery: concept.query,
  condition: condition.condition,
  conditionUpdated: condition.conditionUpdated,
  patient: cflPatient.patient,
  headerAppConfig: apps.headerAppConfig,
});

const mapDispatchToProps = {
  searchConcepts,
  reset,
  getSettingByQuery,
  getCondition,
  addBreadcrumbs,
  resetBreadcrumbs,
  getPatient,
  saveCondition,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(Condition)));
