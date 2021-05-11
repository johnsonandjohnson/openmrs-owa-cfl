import React from 'react';
import { connect } from 'react-redux';
import './Confirm.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { IPatient } from '../../shared/models/patient';
import { Alert } from 'reactstrap';
import _ from 'lodash';
import { BIRTHDATE_FIELD, ESTIMATED_BIRTHDATE_FIELDS, LOCATIONS_OPTION_SOURCE, NAME_FIELDS, RELATIVES_FIELD_TYPE } from './Step';
import { formatDate } from '../../shared/util/date-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

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

  componentDidMount() {}

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
    }
  };

  location = patient => {
    if (patient.locationId) {
      return this.props.locations.find(loc => loc.uuid === patient.locationId)?.display;
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

  getFieldValue = (patient, field) => {
    const val = patient[field.name];
    if (!!field.options) {
      const option = field.options.find(opt => opt.value === val || opt === val);
      if (!!option) {
        return option.label || option;
      }
    }
    if (field.type === 'phone' && !!val) {
      return formatPhoneNumberIntl(val);
    }
    return val;
  };

  getSeparator = step => {
    if (step.fields.find(field => NAME_FIELDS.includes(field.name))) {
      return ' ';
    }
    return ', ';
  };

  sections = patient => {
    const { steps } = this.props;
    const sections = [] as any[];
    steps.forEach(step => {
      let value;
      const separator = this.getSeparator(step);
      if (step.fields.find(field => BIRTHDATE_FIELD === field.name || ESTIMATED_BIRTHDATE_FIELDS.includes(field.name))) {
        value = this.birthdate(patient);
      } else if (step.fields.find(field => field.type === RELATIVES_FIELD_TYPE)) {
        value = this.relatives(patient);
      } else if (step.fields.find(field => field.optionSource === LOCATIONS_OPTION_SOURCE)) {
        value = this.location(patient);
      } else {
        value = step.fields
          .filter(field => !!field.name)
          .map(field => this.getFieldValue(patient, field))
          .filter(Boolean)
          .join(separator);
      }
      sections.push({
        label: step.label,
        value
      });
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

const mapStateToProps = ({ relationshipType, location, registration }) => ({
  relationshipTypes: relationshipType.relationshipTypes,
  locations: location.locations,
  errors: registration.errors
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Confirm));
