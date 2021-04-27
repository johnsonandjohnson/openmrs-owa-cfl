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
import { DEFAULT_REGISTRATION_APP } from "../../shared/constants/patient";

export interface IPatientsProps
  extends StateProps,
    DispatchProps,
    RouteComponentProps<{ id?: string }> {
  intl: any;
}

export interface IPatientsState {
  step: number;
  patient: IPatient;
  stepValidity: object;
  visitedSteps: number[];
  success: boolean;
}

class RegisterPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {
    step: 0,
    patient: {} as IPatient,
    stepValidity: {},
    visitedSteps: [0] as number[],
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
          stepValidity: {},
          visitedSteps: _.map(this.props.steps, (stepDefinition, i) => i),
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
    const highestVisitedStep = Math.max(
      step,
      Math.max.apply(Math, this.state.visitedSteps)
    );
    this.setState({
      step,
      visitedSteps: [...Array(highestVisitedStep + 1)].map(
        (_, stepNumber) => stepNumber
      ),
    });
  };

  canVisitStep = (step) => {
    const highestVisitedStep = Math.max.apply(Math, this.state.visitedSteps);
    if (highestVisitedStep >= step) {
      // if a step (or any of the following steps) has already been visited, return true regardless of validation errors
      return true;
    }
    if (
      [...Array(step)].every(
        (_, stepNumber) => this.state.stepValidity[stepNumber]?.isValid
      )
    ) {
      // if every preceding step is valid (or non-required), return true
      return true;
    }
    return false;
  };

  onStepClick = (step) => (e) => {
    if (this.canVisitStep(step)) {
      this.setStep(step);
    }
  };

  stepList = () => {
    const { stepValidity, visitedSteps } = this.state;
    const isConfirmActive = this.props.steps.length === this.state.step;
    return (
      <ListGroup>
        {_.map(this.props.steps, (stepDefinition, i) => {
          const isValid = stepValidity[i]?.isValid;
          const isVisited = visitedSteps.indexOf(i) >= 0;
          const isActive = i === this.state.step;
          const icon = isValid ? (isActive ? CheckCircle : Check) : null;
          return (
            <ListGroupItem
              active={i === this.state.step}
              onClick={this.onStepClick(i)}
              key={`step-${i}`}
              className={isValid && isVisited ? "valid" : ""}
            >
              {icon && <img src={icon} alt="step" className="step-icon" />}
              {stepDefinition.label}
            </ListGroupItem>
          );
        })}
        <ListGroupItem
          active={isConfirmActive}
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
                setValidity={this.setValidity(i)}
                setStep={this.setStep}
                stepNumber={i}
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

  onNextClick = (isValid) => (e) => {
    if (isValid) {
      this.setStep(this.state.step + 1);
    }
  };

  isFormValid = () =>
    _.isEmpty(_.pickBy(this.state.stepValidity, (step) => !step.isValid));

  onConfirmClick = (e) => {
    if (!this.props.loading && this.isFormValid()) {
      if (this.isEdit()) {
        this.props.editPatient(this.state.patient, this.props.registrationApp);
      } else {
        this.props.register(this.state.patient, this.props.registrationApp);
      }
    }
  };

  stepButtons = (stepNumber) => (isValid) => {
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
            onClick={this.onNextClick(isValid)}
            disabled={!isValid || stepNumber >= stepCount + 1}
            className="next"
          >
            <FormattedMessage id="registerPatient.next" />
          </Button>
        ) : (
          <Button
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

  onPatientChange = (patient) => {
    this.setState({
      patient: { ...patient },
    });
  };

  setValidity = (step) => (isValid, isDirty) => {
    const { stepValidity } = this.state;
    stepValidity[step] = {
      isValid,
      isDirty,
    };
    this.setState({
      stepValidity,
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
  registrationApp:
    (settings.registrationAppSetting &&
      settings.registrationAppSetting.value) ||
    DEFAULT_REGISTRATION_APP,
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
