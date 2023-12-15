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
import { injectIntl } from 'react-intl';
import { FormGroup } from 'reactstrap';
import { IPatient } from '../../shared/models/patient';
import _ from 'lodash';
import Field from './inputs/Field';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { searchLocations } from '../../redux/reducers/location';
import { getPhoneNumberWithPlusSign } from '../../shared/util/person-util';
import { EMPTY_STRING, INPUT_ADDRESS_FIELDS_TYPE } from '../../shared/constants/input';
import { GLOBAL_PROPERTY } from '../../shared/constants/concept';
import { getDateFromModel } from "./inputs/DateInput";

export interface IPatientIdentifierType {
  format: string;
  formatDescription: string;
  required: boolean;
  name: string;
}

export interface IStepProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  stepDefinition: any;
  setValidity: any;
  setStep: any;
  stepNumber: number;
  patientIdentifierTypes: IPatientIdentifierType[];
  isEdit: boolean;
}

export interface IStepState {
  invalidFields: any[];
  dirtyFields: any[];
}

export const LOCATIONS_OPTION_SOURCE = 'locations';
export const SEPARATOR_FIELD_TYPE = 'separator';
export const RELATIVES_FIELD_TYPE = 'relatives';
export const PHONE_FIELD_TYPE = 'phone';
export const DATE_FIELD_TYPE = 'date';
export const STATIC_FIELD_TYPE = 'static';
export const BIRTHDATE_FIELD = 'birthdate';
export const ESTIMATED_BIRTHDATE_FIELDS = ['birthdateYears', 'birthdateMonths'];

export class Step extends React.Component<IStepProps, IStepState> {
  state = {
    invalidFields: [] as any[],
    dirtyFields: [] as any[]
  };

  componentDidMount() {
    this.fetchOptionSources();
    this.validate();
  }

  componentDidUpdate(prevProps: Readonly<IStepProps>, prevState: Readonly<IStepState>, snapshot?: any) {
    if (prevProps.stepDefinition !== this.props.stepDefinition) {
      this.fetchOptionSources();
    }
    // re-validate fields
    if (prevProps.patient !== this.props.patient) {
      this.validate();
    }
  }

  fetchOptionSources = () => {
    const { stepDefinition } = this.props;
    const optionSources = stepDefinition.fields ? stepDefinition.fields.map(field => field.optionSource).filter(os => !!os) : [];
    if (optionSources.includes(LOCATIONS_OPTION_SOURCE)) {
      this.props.searchLocations();
    }
  };

  getOptions = field => {
    const { optionSource = EMPTY_STRING, options = [] } = field;
    const { locations } = this.props;

    if (optionSource === LOCATIONS_OPTION_SOURCE && locations) {
      return locations.map(l => ({
        value: l.uuid,
        label: l.display
      }));
    }

    return options;
  };

  getClassName = field => {
    const { stepDefinition } = this.props;
    const columns = stepDefinition.columns && stepDefinition.columns.toString();
    if (columns === '1') {
      return 'col-sm-12';
    } else if (columns === '2') {
      return 'col-sm-6';
    } else if (columns === '3') {
      return 'col-sm-4';
    } else if (columns === '4') {
      return 'col-sm-3';
    } else {
      if (field.type === 'buttons') {
        return 'col-sm-12';
      }

      return 'col-sm-4';
    }
  };

  // return true if invalid
  validateField = field => {
    const { patient } = this.props;
    const value = patient[field.name];
    const patientIdentifierType = this.getPatientIdentifierType(field);
    const regex = field.regex || patientIdentifierType?.format;
    let isInvalid = field.required && !value;

    if (regex) {
      const re = new RegExp(regex);
      const isRequired = field.required || patientIdentifierType?.required;
      isInvalid = !isRequired && !value ? false : !re.test(value);
    }

    if (field.type === DATE_FIELD_TYPE && !!patient[field.name]) {
      const fieldDate = getDateFromModel(patient, field.name);

      if (this.isPastDateNotAllowed(field) && fieldDate > new Date()) {
        isInvalid = true;
      }

      if (this.isFutureDateNotAllowed(field) && fieldDate < new Date()) {
        isInvalid = true;
      }
    }

    if (field.type === PHONE_FIELD_TYPE && !!value) {
      isInvalid = !isPossiblePhoneNumber(getPhoneNumberWithPlusSign(value));
    }

    const isGlobalPropertyOptionSource = field.optionSource === GLOBAL_PROPERTY;
    const foundGlobalProperty = this.props.settings?.settings.find(({ property }) => property === field.optionUuid);

    if (isGlobalPropertyOptionSource && foundGlobalProperty?.value) {
      const configParsed = JSON.parse(foundGlobalProperty.value);

      if (field.type === INPUT_ADDRESS_FIELDS_TYPE) {
        const addressFields = configParsed[field.optionKey][this.props.patient.country]?.map(({ field }) => field);

        return field?.allAddressFieldsRequired ? !addressFields?.every(field => this.props.patient[field]) : false;
      }
    }

    return this.handleBirthdayFields(field, isInvalid);
  };

  isPastDateNotAllowed = field => field.allowFutureDates != undefined && !field.allowFutureDates;

  isFutureDateNotAllowed = field => field.allowPastDates != undefined && !field.allowPastDates;

  handleBirthdayFields = (field, isInvalid) => {
    // Handle only when empty
    if (this.props.patient[field.name]) {
      return isInvalid;
    }

    if (BIRTHDATE_FIELD === field.name) {
      // if estimation was made, don't require exact birthday
      const usesEstimate = ESTIMATED_BIRTHDATE_FIELDS.some(fieldName => !!this.props.patient[fieldName]);

      if (usesEstimate) {
        return false;
      }
    }

    if (ESTIMATED_BIRTHDATE_FIELDS.includes(field.name)) {
      // if birthday was made, don't require exact estimation
      const usesExact = !!this.props.patient[BIRTHDATE_FIELD];

      if (usesExact) {
        return false;
      }
    }

    return isInvalid;
  };

  isFieldNonEmpty = field => {
    const { patient } = this.props;
    return !!patient[field.name];
  };

  validate = (fields = this.props.stepDefinition.fields, nonEmptyFields = _.filter(fields, this.isFieldNonEmpty)) => {
    const invalidFields = _.filter(fields, this.validateField);
    const dirtyFields = [...this.state.dirtyFields, ...nonEmptyFields];
    this.setState({
      invalidFields,
      dirtyFields
    });
    const isStepValid = invalidFields.length === 0;
    const isStepDirty = dirtyFields.length > 0;
    this.props.setValidity(isStepValid, isStepDirty);

    return isStepValid;
  };

  handleLastFieldKeyDown = e => {
    const { fields } = this.props.stepDefinition;
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (this.props.stepNumber > 0) {
          this.props.setStep(this.props.stepNumber - 1);
        }
      } else {
        const isValid = this.validate(fields, fields);
        if (isValid) {
          e.preventDefault();
          this.props.setStep(this.props.stepNumber + 1);
        }
      }
    }
  };

  getPatientIdentifierType = field => this.props.patientIdentifierTypes.find(type => type.name === field.name && type.format);

  render() {
    const { stepDefinition, patient } = this.props;
    const { invalidFields, dirtyFields } = this.state;

    return (
      <>
        <div className="step-fields" key={stepDefinition.name}>
          <div className="step-title">
            <h2>{stepDefinition.title ? this.props.intl.formatMessage({ id: `${stepDefinition.title}` }) : ''}</h2>
            <p>{stepDefinition.subtitle ? this.props.intl.formatMessage({ id: `${stepDefinition.subtitle}` }) : ''}</p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap">
            {_.map(stepDefinition.fields, (field, i) => {
              const selectOptions = this.getOptions(field);
              const additionalProps = {} as any;
              const patientIdentifierType = this.getPatientIdentifierType(field);

              if (i === stepDefinition.fields.filter(field => field.type !== STATIC_FIELD_TYPE).length - 1 ||
                (field.name === BIRTHDATE_FIELD && !!patient[BIRTHDATE_FIELD])) {
                additionalProps.onKeyDown = this.handleLastFieldKeyDown;
              }

              if (patientIdentifierType) {
                additionalProps.message = patientIdentifierType.formatDescription;
              }

              return field.type === SEPARATOR_FIELD_TYPE ? (
                <p className={field.class || 'col-7 offset-5 col-sm-10 offset-sm-2 mb-5 mt-5'} key={`field-${i}`}>
                  {field.label ? this.props.intl.formatMessage({ id: `${field.label}` }) : ''}
                </p>
              ) : (
                <Field
                  {...this.props}
                  field={field}
                  isInvalid={!!invalidFields.find(f => f['name'] === field.name)}
                  isDirty={!!dirtyFields.find(f => f['name'] === field.name)}
                  className={this.getClassName(field)}
                  selectOptions={selectOptions}
                  key={`field-${i}`}
                  data-testid={field.name}
                  {...additionalProps}
                />
              );
            })}
          </FormGroup>
        </div>
        {this.props.stepButtons(invalidFields.length === 0)}
      </>
    );
  }
}

const mapStateToProps = ({ location, settings, concept }) => ({
  locations: location.locations,
  settings,
  concept
});

const mapDispatchToProps = {
  searchLocations
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Step));
