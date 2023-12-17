/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import queryString from 'query-string';
import { ROOT_URL } from '../constants/openmrs';

export const redirectUrl = search => {
  const params = queryString.parse(search);
  const { redirect, dashboard = '' } = params;
  const redirectUrlRaw = dashboard ? `${redirect}&dashboard=${dashboard}` : `${redirect}`;

  return (redirectUrlRaw || ROOT_URL).toString();
};

