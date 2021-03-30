import "./Dashboard.scss";
import findPatient from "../../img/find-patient.png";
import findCaregiver from "../../img/find-caregiver.png";
import registerPatient from "../../img/register-patient.png";

import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2 className="title">
        <FormattedMessage id="home.title" />
      </h2>
      <div className="items">
        <Link to="/find-patient" className="item">
          <div className="item-content">
            <div className="item-icon">
              <img src={findPatient} alt="icon" />
            </div>
            <div className="item-label">
              <FormattedMessage id="dashboard.findPatient" />
            </div>
          </div>
        </Link>
        <Link to="/find-caregiver" className="item">
          <div className="item-content">
            <div className="item-icon">
              <img src={findCaregiver} alt="icon" />
            </div>
            <div className="item-label">
              <FormattedMessage id="dashboard.findCaregiver" />
            </div>
          </div>
        </Link>
        <Link to="/register-patient" className="item">
          <div className="item-content">
            <div className="item-icon">
              <img src={registerPatient} alt="icon" />
            </div>
            <div className="item-label">
              <FormattedMessage id="dashboard.registerPatient" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
