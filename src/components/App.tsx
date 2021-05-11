import React from 'react';
import './App.scss';
import Routes from './Routes';
import { connect } from 'react-redux';
import { getSession } from '../redux/reducers/session';
import { createSetting, getSettings } from '../redux/reducers/setttings';
import {
  DEFAULT_CAREGIVER_REGISTRATION_APP,
  DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
  DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
  DEFAULT_PATIENT_REGISTRATION_APP
} from '../shared/constants/patient';
import { TinyButton as ScrollUpButton } from 'react-scroll-up-button';
import {
  CAREGIVER_REGISTRATION_APP_SETTING,
  CAREGIVER_REGISTRATION_APP_SETTING_DESCRIPTION,
  CAREGIVER_REGISTRATION_STEPS_SETTING,
  CAREGIVER_REGISTRATION_STEPS_SETTING_DESCRIPTION,
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION,
  FIND_PATIENT_TABLE_COLUMNS_SETTING,
  FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION,
  PATIENT_REGISTRATION_APP_SETTING,
  PATIENT_REGISTRATION_APP_SETTING_DESCRIPTION,
  PATIENT_REGISTRATION_STEPS_SETTING,
  PATIENT_REGISTRATION_STEPS_SETTING_DESCRIPTION
} from '../shared/constants/setting';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/font-awesome-3.0.2.min.css';
import patientDefaultSteps from './register/patientDefaultSteps.json';
import caregiverDefaultSteps from './register/caregiverDefaultSteps.json';

export interface IAppProps extends StateProps, DispatchProps {}

class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getSettings();
  }

  componentDidUpdate(prevProps: Readonly<IAppProps>, prevState: Readonly<{}>, snapshot?: any) {
    if (prevProps.settings !== this.props.settings) {
      // initialize the non-existent settings
      if (!this.props.findPatientTableColumnsSetting) {
        this.props.createSetting(
          FIND_PATIENT_TABLE_COLUMNS_SETTING,
          DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
          FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION
        );
      }
      if (!this.props.findCaregiverTableColumnsSetting) {
        this.props.createSetting(
          FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
          DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
          FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION
        );
      }
      if (!this.props.patientRegistrationSteps) {
        this.props.createSetting(
          PATIENT_REGISTRATION_STEPS_SETTING,
          JSON.stringify(patientDefaultSteps, null, 2),
          PATIENT_REGISTRATION_STEPS_SETTING_DESCRIPTION
        );
      }
      if (!this.props.patientRegistrationAppSetting) {
        this.props.createSetting(
          PATIENT_REGISTRATION_APP_SETTING,
          DEFAULT_PATIENT_REGISTRATION_APP,
          PATIENT_REGISTRATION_APP_SETTING_DESCRIPTION
        );
      }
      if (!this.props.caregiverRegistrationSteps) {
        this.props.createSetting(
          CAREGIVER_REGISTRATION_STEPS_SETTING,
          JSON.stringify(caregiverDefaultSteps, null, 2),
          CAREGIVER_REGISTRATION_STEPS_SETTING_DESCRIPTION
        );
      }
      if (!this.props.caregiverRegistrationAppSetting) {
        this.props.createSetting(
          CAREGIVER_REGISTRATION_APP_SETTING,
          DEFAULT_CAREGIVER_REGISTRATION_APP,
          CAREGIVER_REGISTRATION_APP_SETTING_DESCRIPTION
        );
      }
    }
  }

  render() {
    return (
      <div id="app" className="app">
        <Routes />
        <ScrollUpButton />
      </div>
    );
  }
}

const mapStateToProps = ({ session, settings }) => ({
  session: session.session,
  settings: settings.settings,
  findPatientTableColumnsSetting: settings.findPatientTableColumnsSetting,
  findCaregiverTableColumnsSetting: settings.findCaregiverTableColumnsSetting,
  patientRegistrationSteps: settings.patientRegistrationSteps,
  patientRegistrationAppSetting: settings.patientRegistrationAppSetting,
  caregiverRegistrationSteps: settings.caregiverRegistrationSteps,
  caregiverRegistrationAppSetting: settings.caregiverRegistrationAppSetting
});

const mapDispatchToProps = { getSession, getSettings, createSetting };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
