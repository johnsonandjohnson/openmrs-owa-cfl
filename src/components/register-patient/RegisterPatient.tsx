import React from "react";
import { connect } from "react-redux";
import "./RegisterPatient.scss";
import { FormattedMessage } from "react-intl";

export interface IPatientsProps extends StateProps, DispatchProps {}

export interface IPatientsState {}

class RegisterPatient extends React.Component<IPatientsProps, IPatientsState> {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="register-patient">
        <h1>
          <FormattedMessage id="registerPatient.title" />
        </h1>
        <div className="helper-text">
          <FormattedMessage id="registerPatient.subtitle" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (rootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPatient);
