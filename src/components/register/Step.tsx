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

export interface IStepProps extends StateProps, DispatchProps {
  intl: any;
  patient: IPatient;
  onPatientChange: any;
  stepButtons: any;
  stepDefinition: any;
  setValidity: any;
  setStep: any;
  stepNumber: number;
}

export interface IStepState {
  invalidFields: any[];
  dirtyFields: any[];
}

export const LOCATIONS_OPTION_SOURCE = 'locations';
export const SEPARATOR_FIELD_TYPE = 'separator';
export const RELATIVES_FIELD_TYPE = 'relatives';
export const PHONE_FIELD_TYPE = 'phone';
export const BIRTHDATE_FIELD = 'birthdate';
export const ESTIMATED_BIRTHDATE_FIELDS = ['birthdateYears', 'birthdateMonths'];

class Step extends React.Component<IStepProps, IStepState> {
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
      this.props.searchLocations('');
    }
  };

  getOptions = field => {
    const { optionSource } = field;
    const { locations } = this.props;
    if (optionSource === LOCATIONS_OPTION_SOURCE && locations) {
      return locations.map(l => ({
        value: l.uuid,
        label: l.display
      }));
    }
    return field.options || [];
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
    }
    if (field.type === 'buttons') {
      return 'col-sm-12';
    }
    return 'col-sm-4';
  };

  // return true if invalid
  validateField = field => {
    const { patient } = this.props;
    const value = patient[field.name];
    let isInvalid = field.required && !value;
    if (field.type === PHONE_FIELD_TYPE && !!value) {
      isInvalid = !isPossiblePhoneNumber(getPhoneNumberWithPlusSign(value));
    }
    if (field.regex) {
      const re = new RegExp(field.regex);
      isInvalid = !re.test(value);
    }
    if (BIRTHDATE_FIELD === field.name || ESTIMATED_BIRTHDATE_FIELDS.includes(field.name)) {
      // if estimation was made, don't require exact birthdate
      const usesEstimate = ESTIMATED_BIRTHDATE_FIELDS.every(fieldName => !!this.props.patient[fieldName]);
      if (usesEstimate) {
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
        e.preventDefault();
        if (isValid) {
          this.props.setStep(this.props.stepNumber + 1);
        }
      }
    }
  };

  render() {
    const { stepDefinition, patient } = this.props;
    const { invalidFields, dirtyFields } = this.state;
    return (
      <>
        <div className="step-fields" key={stepDefinition.name}>
          <div className="step-title">
            <h2>{stepDefinition.title}</h2>
            <p>{stepDefinition.subtitle}</p>
          </div>
          <FormGroup className="d-flex flex-row flex-wrap">
            {_.map(stepDefinition.fields, (field, i) => {
              const selectOptions = this.getOptions(field);
              const additionalProps = {} as any;
              if (i === stepDefinition.fields.length - 1 || (field.name === BIRTHDATE_FIELD && !!patient[BIRTHDATE_FIELD])) {
                additionalProps.onKeyDown = this.handleLastFieldKeyDown;
              }
              return field.type === SEPARATOR_FIELD_TYPE ? (
                <p className={field.class || 'col-7 offset-5 col-sm-10 offset-sm-2 mb-5 mt-5'} key={`field-${i}`}>
                  {field.label}
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

const mapStateToProps = ({ settings, location }) => ({
  locations: location.locations
});

const mapDispatchToProps = {
  searchLocations
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Step));
