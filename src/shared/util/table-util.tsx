/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { FormattedMessage } from 'react-intl';
import React from 'react';

export const helperText = (query, loading, totalCount) => {
  if (totalCount > 0) {
    return (
      <span>
        {totalCount} <FormattedMessage id="table.recordsFound" />
      </span>
    );
  } else if (query.length < 3) {
    return <FormattedMessage id="table.enterSearch" />;
  } else if (!loading && totalCount === 0) {
    return <FormattedMessage id="table.noRecords" />;
  }
};
