import React from "react";
import "./App.scss";
import Routes from "./Routes";
import { connect } from "react-redux";
import { getSession } from "../redux/reducers/session";
import {
  createSetting,
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
  FIND_PATIENT_TABLE_COLUMNS_SETTING,
  getSettings,
} from "../redux/reducers/setttings";
import {
  DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS,
  DEFAULT_FIND_PATIENT_TABLE_COLUMNS,
} from "../shared/constants/patient";

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
          DEFAULT_FIND_PATIENT_TABLE_COLUMNS
        );
      }
      if (!this.props.findCaregiverTableColumnsSetting) {
        this.props.createSetting(
          FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
          DEFAULT_FIND_CAREGIVER_TABLE_COLUMNS
        );
      }
    }
  }

  render() {
    return (
      <div className="app">
        <Routes />
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
