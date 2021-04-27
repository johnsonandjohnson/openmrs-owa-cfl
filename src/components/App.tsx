import React from 'react';
import './App.scss';
import Routes from './Routes';
import { connect } from 'react-redux';
import { getSession } from '../redux/reducers/session';
import { createSetting, getSettings } from '../redux/reducers/setttings';
import {
  DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
  DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
  DEFAULT_REGISTRATION_APP
} from '../shared/constants/patient';
import { TinyButton as ScrollUpButton } from 'react-scroll-up-button';
import {
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION,
  FIND_PATIENT_TABLE_COLUMNS_SETTING,
  FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION,
  REGISTRATION_APP_SETTING,
  REGISTRATION_APP_SETTING_DESCRIPTION,
  REGISTRATION_STEPS_SETTING,
  REGISTRATION_STEPS_SETTING_DESCRIPTION
} from '../shared/constants/setting';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/font-awesome-3.0.2.min.css';
import defaultSteps from './register-patient/defaultSteps.json';

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
      if (!this.props.registrationSteps) {
        this.props.createSetting(REGISTRATION_STEPS_SETTING, JSON.stringify(defaultSteps, null, 2), REGISTRATION_STEPS_SETTING_DESCRIPTION);
      }
      if (!this.props.registrationAppSetting) {
        this.props.createSetting(REGISTRATION_APP_SETTING, DEFAULT_REGISTRATION_APP, REGISTRATION_APP_SETTING_DESCRIPTION);
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
  registrationSteps: settings.registrationSteps,
  registrationAppSetting: settings.registrationAppSetting
});

const mapDispatchToProps = { getSession, getSettings, createSetting };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
