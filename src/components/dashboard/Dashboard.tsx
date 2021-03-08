import "./Dashboard.scss";
import findPatient from "../../img/find-patient.png";

import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2 className="title">
        <FormattedMessage id="common.home" />
      </h2>
      <Link to="/find-patient" className="item">
        <div className="item-content">
          <img src={findPatient} className="item-icon" alt="icon" />
          <div className="item-label">
            <FormattedMessage id="findPatient.title" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Dashboard;
