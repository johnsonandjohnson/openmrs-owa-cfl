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
import './Unauthorized.scss';

const Unauthorized = () => (
  <div className="page-container unauthorized">
    <div className="page danger">
      <div className="page-content">
        <span className="toast-item-image toast-item-image-alert" />
        <div className="message">
          <span>You are not authorized to see this page.</span>
        </div>
      </div>
    </div>
  </div>
);

export default Unauthorized;
