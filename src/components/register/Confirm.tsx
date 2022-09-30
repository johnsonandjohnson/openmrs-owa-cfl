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
import './Confirm.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IPatient } from '../../shared/models/patient';
import { Alert } from 'reactstrap';
import _ from 'lodash';
import { BIRTHDATE_FIELD, ESTIMATED_BIRTHDATE_FIELDS, LOCATIONS_OPTION_SOURCE, RELATIVES_FIELD_TYPE } from './Step';
import { formatDate } from '../../shared/util/date-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { getPhoneNumberWithPlusSign } from '../../shared/util/person-util';

export interface IConfirmProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  steps: any[];
  isCaregiver: boolean;
}

class Confirm extends React.Component<IConfirmProps> {
  state = {};

  componentDidMount() {
    // Do nothing
  }

  validate = () => true;

  birthdate = patient => {
    const { intl } = this.props;
    if (!!patient.birthdate) {
      return formatDate(intl, new Date(patient.birthdate));
    } else if (!!patient.birthdateYears || !!patient.birthdateMonths) {
      const yearPart =
        !!patient.birthdateYears && patient.birthdateYears + ' ' + intl.formatMessage({ id: 'registerPatient.steps.confirm.years' });
      const monthPart =
        !!patient.birthdateMonths && patient.birthdateMonths + ' ' + intl.formatMessage({ id: 'registerPatient.steps.confirm.months' });
      return [intl.formatMessage({ id: 'registerPatient.steps.confirm.estimated' }), yearPart, monthPart].filter(Boolean).join(' ');
    } else {
      // Do nothing
    }
  };

  location = (patient, fieldName) => {
    const id = patient[fieldName];
    if (!!id) {
      return this.props.locations.find(loc => loc.uuid === id)?.display;
    }
  };

  relationshipType = relationshipTypeId => {
    const relationshipType = this.props.relationshipTypes.find(type => relationshipTypeId.indexOf(type.uuid) >= 0);
    return relationshipType && (relationshipTypeId.endsWith('-A') ? relationshipType.displayAIsToB : relationshipType.displayBIsToA);
  };

  relatives = patient =>
    patient.relatives &&
    patient.relatives
      .filter(relative => !!relative.relationshipType && !!relative.otherPerson)
      .map(relative => [this.relationshipType(relative.relationshipType), relative.otherPerson.label].join(' - '))
      .join(', ');

  getFieldLabel = field =>
    !!field.label
      ? field.label
      : this.props.intl.formatMessage({
          id: 'registerPatient.fields.' + field.name,
          defaultMessage: field.name
        });

  getFieldValue = (patient, field) => {
    const modelValue = patient[field.name];

    if (!!field.options) {
      const option = field.options.find(opt => opt.value === modelValue || opt === modelValue);
      if (!!option) {
        return option.label || option;
      }
    }

    if (field.type === 'phone' && !!modelValue) {
      return formatPhoneNumberIntl(getPhoneNumberWithPlusSign(modelValue));
    }

    if (field.type === 'date' && !!modelValue) {
      const { intl } = this.props;
      return formatDate(intl, new Date(modelValue));
    }

    return modelValue;
  };

  sections = patient => {
    const { steps, settings: { settings } } = this.props;
    const sections = [] as any[];

    steps.forEach(step => {
      const locField = step.fields.find(field => field.optionSource === LOCATIONS_OPTION_SOURCE);
      const addressFields = step.fields.find(({ type }) => type === 'addressFields');
      const foundSetting = settings.find(({ property }) => property === addressFields?.optionUuid);

      if (step.fields.find(field => BIRTHDATE_FIELD === field.name || ESTIMATED_BIRTHDATE_FIELDS.includes(field.name))) {
        sections.push({
          label: step.label,
          value: this.birthdate(patient)
        });
      } else if (step.fields.find(field => field.type === RELATIVES_FIELD_TYPE)) {
        sections.push({
          label: step.label,
          value: this.relatives(patient)
        });
      } else if (locField) {
        sections.push({
          label: step.label,
          value: this.location(patient, locField.name)
        });
      } else {
        step.fields
          .filter(field => !!field.name && !!this.getFieldValue(patient, field))
          .forEach(field => {
            sections.push({
              label: this.getFieldLabel(field),
              value: this.getFieldValue(patient, field)
            });
          });
      }

      if (addressFields && foundSetting) {
        const configParsed = JSON.parse(foundSetting?.value);
        const selectedCountryFields = configParsed[addressFields.optionKey][patient.country];

        selectedCountryFields?.forEach(field => {
          sections.push({
            label: this.getFieldLabel(field),
            value: patient[field.field]
          });
        })
      }
    });

    return sections;
  };

  renderField = field => {
    const COLON = ':';
    return (
      <div className="mb-3 col-confirm" key={`field-${field.label}`}>
        <div className="col-sm-4 col-confirm-label">
          <span className="helper-text">
            {field.label}
            {COLON}
          </span>
        </div>
        <div className="col-sm-8">
          <span>{field.value}</span>
        </div>
      </div>
    );
  };

  errors = errors => errors && _.map(errors, err => <Alert color="danger">{err && err.replace(/<\/?[^>]+(>|$)/g, '')}</Alert>);

  render() {
    const fields = this.sections(this.props.patient);
    const itemsPerColumn = Math.floor(fields.length / 2);
    const { errors } = this.props;

    return (
      <>
        <div className="step-fields">
          {this.errors(errors)}
          <div className="step-title">
            <h2>
              <FormattedMessage id={(this.props.isCaregiver ? 'registerCaregiver' : 'registerPatient') + '.steps.confirm.title'} />
            </h2>
            <p>
              <FormattedMessage id={(this.props.isCaregiver ? 'registerCaregiver' : 'registerPatient') + '.steps.confirm.subtitle'} />
            </p>
          </div>
          <div className="row">
            <div className="col-sm-6">{fields.slice(0, itemsPerColumn).map(field => this.renderField(field))}</div>
            <div className="col-sm-6">{fields.slice(itemsPerColumn).map(field => this.renderField(field))}</div>
          </div>
        </div>
        {this.props.stepButtons(this.validate)}
      </>
    );
  }
}

const mapStateToProps = ({ relationshipType, location, registration, settings }) => ({
  relationshipTypes: relationshipType.relationshipTypes,
  locations: location.locations,
  errors: registration.errors,
  settings
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Confirm));
