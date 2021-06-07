import { FormattedMessage } from 'react-intl';
import React from 'react';

export const getSelectOptions = (selectOptions, placeholderId) => (
  <>
    {placeholderId && (
      <option value="" disabled selected hidden>
        <FormattedMessage id={placeholderId} />
      </option>
    )}
    {selectOptions.map(option => (
      <option value={option.value || option} key={`option-${option.value || option}`}>
        {option.label || option}
      </option>
    ))}
  </>
);

export const extractEventValue = e => (!!e?.target ? (e?.target?.type === 'checkbox' ? e.target.checked : e?.target?.value) : e);

export const validateRegex = expr => {
  if (!!expr) {
    try {
      // tslint:disable-next-line:no-unused-expression
      new RegExp(expr);
      return true;
    } catch {
      return false;
    }
  }
  return true;
};
