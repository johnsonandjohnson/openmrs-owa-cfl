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
import {connect} from 'react-redux';
import './RegisterPatient.scss';
import '../Inputs.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Button, Col, Form, ListGroup, ListGroupItem, Row, Spinner} from 'reactstrap';
import _ from 'lodash';
import {IPatient} from '../../shared/models/patient';
import {extractPatientOrPersonData, extractPersonRelationships} from '../../shared/util/patient-util';
import Check from '../../assets/img/check.svg';
import CheckCircle from '../../assets/img/check-circle.svg';
import {
  editPatient,
  editPerson,
  getPatientIdentifierTypes,
  register,
  registerPerson,
  updateRelationships
} from '../../redux/reducers/registration';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {getPatient} from '../../redux/reducers/patient';
import {getPerson, getPersonRelationships} from '../../redux/reducers/person';
import defaultSteps from './patientDefaultSteps.json';
import caregiverDefaultSteps from './caregiverDefaultSteps.json';
import Step from './Step';
import Confirm from './Confirm';
import queryString from 'query-string';
import {redirectUrl} from '../../shared/util/url-util';
import {DEFAULT_REGISTRATION_FORM_REDIRECT} from '../../shared/constants/openmrs';
import { CONCEPT_CUSTOM_REPRESENTATION } from '../../shared/constants/manage-regimens';
import { getConcept } from '../../redux/reducers/concept';
import { getSettingByQuery } from '../../redux/reducers/settings';
import { CONCEPT, GLOBAL_PROPERTY, OPTION_UUID } from '../../shared/constants/concept';

export interface IRegistrationProps extends StateProps, DispatchProps, RouteComponentProps<{ id?: string }> {
  intl: any;
  isCaregiver: boolean;
}

export interface IRegistrationState {
  step: number;
  patient: IPatient;
  stepValidity: object;
  visitedSteps: number[];
  success: boolean;
  requiredCustomElementsChecked: boolean;
}

class RegistrationForm extends React.Component<IRegistrationProps, IRegistrationState> {
  state = {
    step: 0,
    patient: {} as IPatient,
    stepValidity: {},
    visitedSteps: [0] as number[],
    success: false,
    requiredCustomElementsChecked: false
  };
  entityName = this.props.isCaregiver ? 'Caregiver' : 'Patient';
  steps = () => (this.props.isCaregiver ? this.props.caregiverSteps : this.props.patientSteps);
  patient = () => (this.props.isCaregiver ? this.props.person : this.props.patient);

  componentDidMount() {
    this.props.getPatientIdentifierTypes();

    if (this.isEdit()) {
      this.props.getPersonRelationships(this.props.match.params.id);
      if (this.props.isCaregiver) {
        this.props.getPerson(this.props.match.params.id);
      } else {
        this.props.getPatient(this.props.match.params.id);
      }
    }

    this.getConceptsAndSetings();
  }

  componentDidUpdate(prevProps: Readonly<IRegistrationProps>, prevState: Readonly<IRegistrationState>, snapshot?: any) {
    if (this.isEdit()) {
      const prevPatient = this.props.isCaregiver ? prevProps.person : prevProps.patient;
      if (prevPatient !== this.patient() && !!this.patient()) {
        const patient = {
          relatives: this.state.patient?.relatives || [],
          ...extractPatientOrPersonData(this.patient())
        };
        this.setState({
          patient,
          stepValidity: {},
          visitedSteps: _.map(this.steps(), (stepDefinition, i) => i)
        });
      } else if (prevProps.personRelationships !== this.props.personRelationships && this.props.personRelationships != null) {
        const patient = {
          ...this.state.patient,
          relatives: extractPersonRelationships(this.props.match.params.id, this.props.personRelationships)
        };
        this.setState({
          patient
        });
      } else {
        // Do nothing
      }
    } else {
      // Handle default values for Patient
      if(prevState.patient.LocationAttribute !== this.props.sessionLocation?.uuid) {
        this.setState({patient: {...this.state.patient, LocationAttribute: this.props.sessionLocation.uuid}});
      }
    }

    if (!prevProps.success && this.props.success) {
      this.setState({
        success: true
      });
    }

    if (_.differenceWith(prevProps.patientSteps, this.props.patientSteps, _.isEqual).length) {
      this.getConceptsAndSetings();
    }
  }

  getConceptsAndSetings() {
    const fieldOptionUuids = [];
    this.steps().forEach(({ fields }) => fields.forEach(({ optionSource, optionUuid }) => optionSource && optionUuid ? fieldOptionUuids.push({optionSource, optionUuid}) : null));

    _.uniqBy(fieldOptionUuids, OPTION_UUID).forEach(({ optionSource, optionUuid }) => {
      if (optionSource === CONCEPT) {
        this.props.getConcept(optionUuid, CONCEPT_CUSTOM_REPRESENTATION);
      } else if (optionSource === GLOBAL_PROPERTY) {
        this.props.getSettingByQuery(optionUuid);
      } else {
        // Do nothing
      }
    });
  }

  isEdit() {
    const { match } = this.props;
    return match && match.params.id;
  }

  formName = () => (this.isEdit() ? `edit${this.entityName}` : `register${this.entityName}`);

  setStep = step => {
    const highestVisitedStep = Math.max(step, Math.max.apply(Math, this.state.visitedSteps));
    this.setState({
      step,
      // tslint:disable-next-line:no-shadowed-variable
      visitedSteps: [...Array(highestVisitedStep + 1)].map((ignore, stepNumber) => stepNumber)
    });
  };

  canVisitStep = step => {
    const highestVisitedStep = Math.max.apply(Math, this.state.visitedSteps);
    if (highestVisitedStep >= step) {
      // if a step (or any of the following steps) has already been visited, return true regardless of validation errors
      return true;
    }
    // tslint:disable-next-line:no-shadowed-variable
    if ([...Array(step)].every((ignore, stepNumber) => this.state.stepValidity[stepNumber]?.isValid)) {
      // if every preceding step is valid (or non-required), return true
      return true;
    }
    return false;
  };

  onStepClick = step => e => {
    if (this.canVisitStep(step)) {
      this.setStep(step);
    }
  };

  stepList = () => {
    const { stepValidity, visitedSteps } = this.state;
    const isConfirmActive = this.steps().length === this.state.step;
    return (
      <ListGroup>
        {_.map(this.steps(), (stepDefinition, i) => {
          const isValid = stepValidity[i]?.isValid;
          const isVisited = visitedSteps.indexOf(i) >= 0;
          const isActive = i === this.state.step;
          const icon = isValid ? (isActive ? CheckCircle : Check) : null;
          return (
            <ListGroupItem
              active={i === this.state.step}
              onClick={this.onStepClick(i)}
              key={`step-${i}`}
              className={isValid && isVisited ? 'valid' : ''}
            >
              {icon && <img src={icon} alt="step" className="step-icon" />}
              {stepDefinition.label ? <FormattedMessage id={`${stepDefinition.label}`} /> : ''}
            </ListGroupItem>
          );
        })}
        <ListGroupItem active={isConfirmActive} onClick={this.onStepClick(this.steps().length)} key={`step-${this.steps().length}`}>
          <FormattedMessage id={`registerPatient.steps.confirm.label`} />
        </ListGroupItem>
      </ListGroup>
    );
  };

  stepForm = () => (
    <Form className="h-100 w-100">
      {_.map(this.steps(), (stepDefinition, i) => (
        <div className={`step-content ${i === this.state.step ? '' : 'd-none'}`} key={`step-${i}`}>
          <Step
            patient={this.state.patient}
            onPatientChange={this.onPatientChange}
            stepButtons={this.stepButtons(i)}
            stepDefinition={stepDefinition}
            patientIdentifierTypes={this.props.patientIdentifierTypes}
            setValidity={this.setValidity(i)}
            setStep={this.setStep}
            stepNumber={i}
            isEdit={!!this.isEdit()}
          />
        </div>
      ))}
      <div className={`step-content ${this.steps().length === this.state.step ? '' : 'd-none'}`} key={`step-${this.steps().length}`}>
        <Confirm
          patient={this.state.patient}
          onPatientChange={this.onPatientChange}
          stepButtons={this.stepButtons(this.steps().length)}
          steps={this.steps()}
          isCaregiver={this.props.isCaregiver}
          customElements={this.confirmPageCustomElements}
        />
      </div>
    </Form>
  );

  onNextClick = isValid => e => {
    if (isValid) {
      this.setStep(this.state.step + 1);
    }
  };

  isFormValid = () => _.isEmpty(_.pickBy(this.state.stepValidity, step => !step.isValid)) && this.customRequiredElementsChecked();

  customRequiredElementsChecked = () => {
    const { patient } = this.state;
    const { confirmPageCustomElements } = this.props;
    const requiredFields = confirmPageCustomElements.filter(obj => obj.required);
    let requiredElementsChecked = true;
    requiredFields.forEach(field => {
      const fieldValue = patient[field.name];
      if (!fieldValue) {
        requiredElementsChecked = false;
      }
    });

    return requiredElementsChecked;
  }

  onConfirmClick = e => {
    if (!this.props.loading && this.isFormValid()) {
      if (this.isEdit()) {
        if (this.props.isCaregiver) {
          this.props.updateRelationships(this.state.patient);
          this.props.editPerson(this.state.patient);
        } else {
          this.props.editPatient(this.state.patient);
        }
      } else {
        if (this.props.isCaregiver) {
          this.props.registerPerson(this.state.patient);
        } else {
          this.props.register(this.state.patient);
        }
      }
    }
  };

  handleCustomElementsOnChange = (event, customElementName) => {
    const { patient } = this.state;
    const value = event.target?.checked;
    patient[customElementName] = value;

    this.setState({ patient });
  };

  confirmPageCustomElements = () => {
    const { confirmPageCustomElements } = this.props;
    return (
      <>
        <div className='custom-elements-section'>
          {!this.isEdit() && _.map(confirmPageCustomElements, element => (
            <div className="row">
              <input type='checkbox' onClick={event => this.handleCustomElementsOnChange(event, element.name)} />
              <span style={{color: '#333333'}}><FormattedMessage id={`${element.label}`} /></span>
              {element.required && <span style={{color: 'red'}}>*</span>}
            </div>
          ))}
        </div>
      </>
    )
  };

  stepButtons = stepNumber => isValid => {
    const person = this.props.isCaregiver ? 'caregiver' : 'patient';
    const stepCount = this.steps().length;
    return (
      <div className="step-buttons">
        {stepNumber > 0 ? (
          <Button id={`${person}-previous-button`} onClick={() => this.setStep(stepNumber - 1)}>
            <FormattedMessage id="registerPatient.previous" />
          </Button>
        ) : (
          <div />
        )}
        {stepNumber < stepCount ? (
          <Button
            id={`${person}-next-button`}
            onClick={this.onNextClick(isValid)}
            disabled={!isValid || stepNumber >= stepCount + 1}
            className="next"
          >
            <FormattedMessage id="registerPatient.next" />
          </Button>
        ) : (
          <Button
            id={`${person}-confirm-button`}
            onClick={this.onConfirmClick}
            className="next"
            disabled={this.props.loading || !this.isFormValid()}
          >
            <FormattedMessage id="registerPatient.confirm" />
          </Button>
        )}
      </div>
    );
  };

  onPatientChange = patient =>
    this.setState({
      patient: { ...patient }
    });

  setValidity = step => (isValid, isDirty) => {
    const { stepValidity } = this.state;
    stepValidity[step] = {
      isValid,
      isDirty
    };
    this.setState({
      stepValidity
    });
  };

  success = () => {
    const { location, id } = this.props;
    window.location.href = id
      ? this.createRedirectURL()
      : queryString.stringifyUrl({
          url: redirectUrl(location.search)
        });
    return <Spinner />;
  };

  createRedirectURL = () => {
    const replacements = {
      "%PATIENT_ID%": this.props.id,
      "%PERSON_TYPE%": this.props.isCaregiver ? "person" : "patient"
    };
    return this.props.registrationRedirectUrl.replace(/%\w+%/g, placeholder => replacements[placeholder] || placeholder);
  };

  render() {
    if (this.props.settingsLoading) {
      return <Spinner />;
    }
    const formName = this.formName();
    return (
      <div className="register-patient">
        {this.state.success ? (
          this.success()
        ) : (
          <>
            <h1>
              <FormattedMessage id={`${formName}.title`} />
            </h1>
            <div className="helper-text">
              <FormattedMessage id={`${formName}.subtitle`} />
            </div>
            <Row className="mt-2">
              <Col xs={4} sm={3} className="step-list">
                {this.stepList()}
              </Col>
              <Col xs={8} sm={9} className="step">
                {this.stepForm()}
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ registration, cflPatient, cflPerson, apps, settings, concept, openmrs: { session: { sessionLocation }} }) => ({
  loading: registration.loading,
  success: registration.success,
  message: registration.message,
  id: registration.id,
  patientIdentifierTypes: registration.patientIdentifierTypes,
  patient: cflPatient.patient,
  person: cflPerson.person,
  personRelationships: cflPerson.personRelationships,
  patientSteps: apps.patientRegistrationSteps || defaultSteps,
  caregiverSteps: apps.caregiverRegistrationSteps || caregiverDefaultSteps,
  registrationRedirectUrl: apps.registrationRedirectUrl || DEFAULT_REGISTRATION_FORM_REDIRECT,
  settingsLoading: apps.loading || registration.loading || settings.loading || concept.loading.concept,
  confirmPageCustomElements: apps.confirmPageCustomElements || [],
  sessionLocation
});

const mapDispatchToProps = {
  register,
  registerPerson,
  getPatient,
  getPerson,
  editPatient,
  editPerson,
  updateRelationships,
  getPersonRelationships,
  getPatientIdentifierTypes,
  getConcept,
  getSettingByQuery
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(RegistrationForm)));
