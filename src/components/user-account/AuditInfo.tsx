import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Label } from 'reactstrap';
import moment from 'moment';
import { IAudit } from '../../shared/models/user-account';
import { DEFAULT_AUDIT_DATE_FORMAT } from '../../shared/constants/user-account';

interface IAuditInfo {
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
      <p className="pb-3">
        {intl.formatMessage(
          { id: 'userAccount.auditInfo.created' },
          {
            creator: audit?.creator?.display,
            date: formatDate(audit?.dateCreated)
          }
        )}
      </p>
      <p className="pb-3">
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
