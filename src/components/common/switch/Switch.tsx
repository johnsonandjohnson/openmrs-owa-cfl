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
import { default as ReactSwitch } from 'rc-switch';
import { FormattedMessage } from 'react-intl';
import './Switch.scss';
import 'rc-switch/assets/index.css';

export const Switch = ({
  id,
  intl,
  onChange,
  checkedTranslationId,
  uncheckedTranslationId,
  labelTranslationId,
  checked = false,
  disabled = false
}) => (
  <div className="inline-fields switch-with-label">
    <label htmlFor={id}>
      <FormattedMessage id={labelTranslationId} />
    </label>
    <ReactSwitch
      id={id}
      onChange={onChange}
      onClick={onChange}
      disabled={disabled}
      checked={checked}
      checkedChildren={intl.formatMessage({ id: checkedTranslationId })}
      unCheckedChildren={intl.formatMessage({ id: uncheckedTranslationId })}
    />
  </div>
);
