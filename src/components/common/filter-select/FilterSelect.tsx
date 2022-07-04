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
import Select from 'react-select';
import { selectDefaultTheme } from '../../../shared/util/form-util';
import './FilterSelect.scss';

export const FilterSelect = ({ intl, value, options, placeholderId, onChange }) => (
  <Select
    placeholder={intl.formatMessage({ id: placeholderId })}
    value={value}
    onChange={onChange}
    options={options}
    classNamePrefix="filter-select"
    className="filter-select"
    theme={selectDefaultTheme}
  />
);
