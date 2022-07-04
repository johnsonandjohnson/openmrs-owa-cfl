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
import { FormattedMessage, IntlShape } from 'react-intl';
import { Label } from 'reactstrap';
import moment from 'moment';
import { IAudit } from '../../shared/models/user-account';
import { DEFAULT_AUDIT_DATE_FORMAT } from '../../shared/constants/user-account';

export interface IAuditInfo {
  intl: IntlShape;
  audit: IAudit;
}

const AuditInfo = ({ intl, audit }: IAuditInfo) => {
  const formatDate = (date: string) => moment(date).format(DEFAULT_AUDIT_DATE_FORMAT);

  return (
    <>
      <Label className="mb-5">
        <FormattedMessage id="userAccount.auditInfo.title" tagName="span" />
      </Label>
      <p className="pb-3" data-testid="userAccountCreatedBy">
        {intl.formatMessage(
          { id: 'userAccount.auditInfo.created' },
          {
            creator: audit?.creator?.display,
            date: formatDate(audit?.dateCreated)
          }
        )}
      </p>
      <p className="pb-3" data-testid="userAccountChangedBy">
        {intl.formatMessage(
          { id: 'userAccount.auditInfo.changedBy' },
          {
            changedBy: audit?.changedBy?.display,
            date: formatDate(audit?.dateChanged)
          }
        )}
      </p>
    </>
  );
};

export default AuditInfo;
