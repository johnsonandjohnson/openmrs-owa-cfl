import React from "react";
import { connect } from "react-redux";
import "./RegisterPatient.scss";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Button,
  Col,
  Form,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import _ from "lodash";
import { getStepCount, steps } from "./steps";
import { IPatient } from "../../shared/models/patient";
import {
  extractPatientData,
  extractPatientRelationships,
  setValueOnChange,
} from "../../shared/util/patient-util";
import Check from "../../assets/img/check.svg";
import CheckCircle from "../../assets/img/check-circle.svg";
import PhoneInput from "react-phone-number-input/input";
import {
  editPatient,
  register,
  updateRelationships,
} from "../../redux/reducers/registration";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  getPatient,
  getPatientRelationships,
} from "../../redux/reducers/patient";
import { ROOT_URL } from "../../shared/constants/openmrs";

export interface IPatientsProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id?: string }> {
  intl: any;
}

export interface IPatientsState {
  step: number;
  patient: IPatient;
  validSteps: number[];
  success: boolean;
}

class RegisterPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {
    step: 0,
    patient: {} as IPatient,
    validSteps: [] as number[],
    success: false,
  };

  componentDidMount() {
    if (this.isEdit()) {
      this.props.getPatient(this.props.match.params.id);
      this.props.getPatientRelationships(this.props.match.params.id);
    }
  }

  componentDidUpdate(
    prevProps: Readonly<IPatientsProps>,
    prevState: Readonly<IPatientsState>,
    snapshot?: any
  ) {
    if (this.isEdit()) {
      if (prevProps.patient !== this.props.patient && !!this.props.patient) {
        const patient = {
          relatives: this.state.patient?.relatives || [],
          ...extractPatientData(this.props.patient),
        };
        this.setState({
          patient,
          validSteps: _.map(Object.getOwnPropertyNames(steps), (stepName, i) =>
            steps[stepName] !== steps.confirm ? i : null
          ),
        });
      } else if (
        prevProps.patientRelationships !== this.props.patientRelationships &&
        this.props.patientRelationships != null
      ) {
        const patient = {
          ...this.state.patient,
          relatives: extractPatientRelationships(
            this.props.match.params.id,
            this.props.patientRelationships
          ),
        };
        this.setState({
          patient,
        });
      }
    }
    if (!prevProps.success && this.props.success) {
      this.setState({
        success: true,
      });
    }
  }

  isEdit() {
    const { match } = this.props;
    return match && match.params.id;
  }

  setStep = (step) => {
    this.setState({
      step,
    });
  };

  onStepClick = (step) => (e) => {
    if (
      this.state.validSteps.includes(step) ||
      this.state.validSteps.includes(step - 1)
    ) {
      this.setStep(step);
    }
  };

  stepList = () => {
    const { validSteps } = this.state;
    return (
      <ListGroup>
        {_.map(Object.getOwnPropertyNames(steps), (stepName, i) => {
          const isValid = validSteps.findIndex((s) => s === i) >= 0;
          const isActive = i === this.state.step;
          const icon = isValid ? (isActive ? CheckCircle : Check) : null;
          return (
            <ListGroupItem
              active={i === this.state.step}
              onClick={this.onStepClick(i)}
              key={`step-${i}`}
              className={isValid ? "valid" : ""}
            >
              {icon && <img src={icon} alt="step" className="step-icon" />}
              {this.props.intl.formatMessage({
                id: `registerPatient.steps.${stepName}.label`,
              })}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  renderField = (
    field,
    invalidFields,
    selectOptions = null,
    className = "",
    value = null,
    onChange = null
  ) => {
    const { intl } = this.props;
    const { patient } = this.state;
    const { name, required, type } = field;
    const InputElement = type === "phone" ? PhoneInput : Input;
    const isInvalid =
      invalidFields.filter((field) => field["name"] === name).length > 0;
    const hasValue = !!patient[field.name];
    return (
      <div className={`${className}`}>
        <InputElement
          name={name}
          id={name}
          placeholder={`${intl.formatMessage({
            id: "registerPatient.fields." + name,
          })} ${
            required
              ? intl.formatMessage({
                  id: "registerPatient.fields.required",
                })
              : ""
          }`}
          value={value != null ? value : patient[name]}
          onChange={
            onChange || setValueOnChange(patient, name, this.onPatientChange)
          }
          required={required}
          className={
            "form-control " +
            (isInvalid ? "invalid " : " ") +
            (type === "select" && !value && !patient[name] ? "placeholder" : "")
          }
          type={type || "text"}
        >
          {selectOptions}
        </InputElement>
        {isInvalid && (
          <span className="error field-error">
            {intl.formatMessage({
              id: hasValue
                ? `registerPatient.invalid`
                : `registerPatient.required`,
            })}
          </span>
        )}
      </div>
    );
  };

  stepForm = () => {
    return (
      <Form className="h-100 w-100">
        {_.map(Object.getOwnPropertyNames(steps), (stepName, i) => {
          const Component = steps[stepName];
          return (
            <div
              className={`step-content ${
                i === this.state.step ? "" : "d-none"
              }`}
              key={`step-${i}`}
            >
              <Component
                patient={this.state.patient}
                intl={this.props.intl}
                onPatientChange={this.onPatientChange}
                stepButtons={this.stepButtons(i)}
                renderField={this.renderField}
              />
            </div>
          );
        })}
      </Form>
    );
  };

  onNextClick = (validate) => (e) => {
    const valid = validate();
    if (valid) {
      this.setStep(this.state.step + 1);
    }
    this.setValidity(this.state.step, valid);
  };

  onConfirmClick = (e) => {
    if (
      !this.props.loading &&
      this.state.validSteps.length >=
        Object.getOwnPropertyNames(steps).length - 1
    ) {
      if (this.isEdit()) {
        this.props.editPatient(this.state.patient);
      } else {
        this.props.register(this.state.patient);
      }
    }
  };

  stepButtons = (stepNumber) => (validate) => {
    const stepCount = getStepCount();
    return (
      <div className="step-buttons">
        {stepNumber > 0 ? (
          <Button onClick={(e) => this.setStep(stepNumber - 1)}>
            <FormattedMessage id="registerPatient.previous" />
          </Button>
        ) : (
          <div />
        )}
        {stepNumber + 1 < stepCount ? (
          <Button
            onClick={this.onNextClick(validate)}
            disabled={stepNumber >= stepCount + 1}
            className="next"
          >
            <FormattedMessage id="registerPatient.next" />
          </Button>
        ) : (
          <Button
            onClick={this.onConfirmClick}
            className="next"
            disabled={
              this.props.loading ||
              this.state.validSteps.length <
                Object.getOwnPropertyNames(steps).length - 1
            }
          >
            <FormattedMessage id="registerPatient.confirm" />
          </Button>
        )}
      </div>
    );
  };

  onPatientChange = (patient) => {
    this.setState({
      patient: { ...patient },
    });
  };

  setValidity = (step, isValid) => {
    const { validSteps } = this.state;
    const existingStepIdx = validSteps.findIndex((s) => s === step);
    if (isValid) {
      if (existingStepIdx < 0) {
        validSteps.push(step);
      }
    } else {
      if (existingStepIdx >= 0) {
        validSteps.splice(existingStepIdx, 1);
      }
    }
    this.setState({
      validSteps,
    });
  };

  success = () => {
    const isEdit = this.isEdit();
    return (
      <div className="ml-3 mt-2">
        <h1 className="text-success">
          <FormattedMessage id="registerPatient.success.title" />
        </h1>
        <div className="helper-text">
          <FormattedMessage
            id={`${
              isEdit ? "editPatient" : "registerPatient"
            }.success.subtitle`}
          />
        </div>
        <p>
          <a href={ROOT_URL}>
            <FormattedMessage id="registerPatient.success.goBack" />
          </a>
        </p>
      </div>
    );
  };

  render() {
    return (
      <div className="register-patient">
        {this.state.success ? (
          this.success()
        ) : (
          <>
            <h1>
              <FormattedMessage id="registerPatient.title" />
            </h1>
            <div className="helper-text">
              <FormattedMessage id="registerPatient.subtitle" />
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

const mapStateToProps = ({ registration, patient }) => ({
  loading: registration.loading,
  success: registration.success,
  patient: patient.patient,
  patientRelationships: patient.patientRelationships,
});

const mapDispatchToProps = {
  register,
  getPatient,
  editPatient,
  updateRelationships,
  getPatientRelationships,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withRouter(RegisterPatient)));
