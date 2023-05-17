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
import { TimePicker as ReactTimePicker } from 'antd';
import { DEFAULT_TIME_FORMAT, EMPTY_STRING } from '../../../shared/constants/input';
import 'antd/dist/antd.css';
import './TimePicker.scss';
import '../../Inputs.scss';

export const TimePicker = ({
  format = DEFAULT_TIME_FORMAT,
  placeholder = null,
  showPlaceholder = false,
  value,
  onChange,
  onKeyDown = undefined
}) => (
  <div className="input-container"
    onKeyDown={!!onKeyDown && onKeyDown}>
    <ReactTimePicker
      format={format}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="default-time-picker"
    />
    {!!showPlaceholder && <span className="placeholder">{placeholder || EMPTY_STRING}</span>}
  </div>
);