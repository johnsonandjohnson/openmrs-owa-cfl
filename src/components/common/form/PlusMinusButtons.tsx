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
import Plus from '../../../assets/img/plus.png';
import Minus from '../../../assets/img/minus.png';

export function PlusMinusButtons({ intl, onPlusClick, onMinusClick, isPlusButtonVisible = true }) {
  return (
    <div className="align-items-center justify-content-center d-flex action-icons">
      <div className="action-icons-inner">
        <img
          src={Minus}
          title={intl.formatMessage({ id: 'plusMinusButtons.delete' })}
          alt="remove"
          className="remove-item"
          onClick={onMinusClick}
          data-testid="removeItem"
        />
        {isPlusButtonVisible && (
          <img
            src={Plus}
            title={intl.formatMessage({ id: 'plusMinusButtons.addNew' })}
            alt="add"
            className="mx-2 add-item"
            onClick={onPlusClick}
            data-testid="addItem"
          />
        )}
      </div>
    </div>
  );
}
