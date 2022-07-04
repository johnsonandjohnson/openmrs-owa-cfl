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
import { render } from '@testing-library/react';
import { TimePicker } from './TimePicker';
import moment from 'moment';
import { DEFAULT_TIME_FORMAT } from '../../../shared/constants/input';

test('should render match snapshot', () => {
  const value = moment('10:00', DEFAULT_TIME_FORMAT);
  const input = render(<TimePicker value={value} onChange={() => null} />);
  expect(input).toMatchSnapshot();
});
