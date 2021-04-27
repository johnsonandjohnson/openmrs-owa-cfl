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
