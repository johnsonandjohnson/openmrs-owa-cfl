/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import './Dashboard.scss';
import findPatient from '../../assets/img/find-patient.png';
import findCaregiver from '../../assets/img/find-caregiver.png';
import registerPatient from '../../assets/img/register-patient.png';

import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Dashboard = () => (
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

export default Dashboard;
