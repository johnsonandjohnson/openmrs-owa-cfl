import React from "react";
import { connect } from "react-redux";
import "./RegisterPatient.scss";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Button,
  Col,
  Form,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
} from "reactstrap";
import _ from "lodash";
import { IPatient } from "../../shared/models/patient";
import {
  extractPatientData,
  extractPatientRelationships,
} from "../../shared/util/patient-util";
import Check from "../../assets/img/check.svg";
import CheckCircle from "../../assets/img/check-circle.svg";
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
import defaultSteps from "./defaultSteps.json";
import Step from "./Step";
import Confirm from "./Confirm";
import queryString from "query-string";
import { redirectUrl } from "../../shared/util/url-util";

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
          validSteps: _.map(this.props.steps, (stepDefinition, i) => i),
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
        {_.map(this.props.steps, (stepDefinition, i) => {
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
              {stepDefinition.label}
            </ListGroupItem>
          );
        })}
        <ListGroupItem
          active={this.props.steps.length === this.state.step}
          onClick={this.onStepClick(this.props.steps.length)}
          key={`step-${this.props.steps.length}`}
        >
          <FormattedMessage id={`registerPatient.steps.confirm.label`} />
        </ListGroupItem>
      </ListGroup>
    );
  };

  stepForm = () => {
    return (
      <Form className="h-100 w-100">
        {_.map(this.props.steps, (stepDefinition, i) => {
          return (
            <div
              className={`step-content ${
                i === this.state.step ? "" : "d-none"
              }`}
              key={`step-${i}`}
            >
              <Step
                patient={this.state.patient}
                onPatientChange={this.onPatientChange}
                stepButtons={this.stepButtons(i)}
                stepDefinition={stepDefinition}
              />
            </div>
          );
        })}
        <div
          className={`step-content ${
            this.props.steps.length === this.state.step ? "" : "d-none"
          }`}
          key={`step-${this.props.steps.length}`}
        >
          <Confirm
            patient={this.state.patient}
            onPatientChange={this.onPatientChange}
            stepButtons={this.stepButtons(this.props.steps.length)}
            steps={this.props.steps}
          />
        </div>
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
      this.state.validSteps.length >= this.props.steps.length
    ) {
      if (this.isEdit()) {
        this.props.editPatient(this.state.patient);
      } else {
        this.props.register(this.state.patient);
      }
    }
  };

  stepButtons = (stepNumber) => (validate) => {
    const stepCount = this.props.steps.length;
    return (
      <div className="step-buttons">
        {stepNumber > 0 ? (
          <Button onClick={(e) => this.setStep(stepNumber - 1)}>
            <FormattedMessage id="registerPatient.previous" />
          </Button>
        ) : (
          <div />
        )}
        {stepNumber < stepCount ? (
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
              this.state.validSteps.length < this.props.steps.length
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
          <a
            href={queryString.stringifyUrl({
              url: redirectUrl(this.props.location.search),
            })}
          >
            <FormattedMessage id="registerPatient.success.goBack" />
          </a>
        </p>
      </div>
    );
  };

  render() {
    if (this.props.settingsLoading) {
      return <Spinner />;
    }
    const isEdit = this.isEdit();
    return (
      <div className="register-patient">
        {this.state.success ? (
          this.success()
        ) : (
          <>
            <h1>
              <FormattedMessage
                id={`${isEdit ? "editPatient" : "registerPatient"}.title`}
              />
            </h1>
            <div className="helper-text">
              <FormattedMessage
                id={`${isEdit ? "editPatient" : "registerPatient"}.subtitle`}
              />
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

const mapStateToProps = ({ registration, patient, settings }) => ({
  loading: registration.loading,
  success: registration.success,
  patient: patient.patient,
  patientRelationships: patient.patientRelationships,
  steps: settings.registrationSteps || defaultSteps,
  settingsLoading: settings.loading,
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
