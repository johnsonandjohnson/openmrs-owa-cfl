import React from "react";
import "./App.scss";
import Routes from "./Routes";
import { connect } from "react-redux";
import { getSession } from "../redux/reducers/session";
import { createSetting, getSettings } from "../redux/reducers/setttings";
import {
  DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
  DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
} from "../shared/constants/patient";
import { TinyButton as ScrollUpButton } from "react-scroll-up-button";
import _ from "lodash";
import {
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION,
  FIND_PATIENT_TABLE_COLUMNS_SETTING,
  FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION,
  getDefaultValue,
  REGISTRATION_SETTINGS,
} from "../shared/constants/setting";
import { getSetting } from "../shared/util/setting-util"; //Add this line Here
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/font-awesome-3.0.2.min.css";

export interface IAppProps extends StateProps, DispatchProps {}

class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getSettings();
  }

  componentDidUpdate(
    prevProps: Readonly<IAppProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
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
      _.each(Object.getOwnPropertyNames(REGISTRATION_SETTINGS), (s) => {
        const setting = REGISTRATION_SETTINGS[s];
        if (!getSetting(this.props.settings, setting.name)) {
          this.props.createSetting(
            setting.name,
            getDefaultValue(setting.name),
            setting.description
          );
        }
      });
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
});

const mapDispatchToProps = { getSession, getSettings, createSetting };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
