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

export const ordinalIndicator = number => {
  const i = number % 10;
  const j = number % 100;
  if (i === 1 && j !== 11) {
    return 'common.ordinalSuffix.st';
  } else if (i === 2 && j !== 12) {
    return 'common.ordinalSuffix.nd';
  } else if (i === 3 && j !== 13) {
    return 'common.ordinalSuffix.rd';
  }
  return 'common.ordinalSuffix.th';
};

export const selectDefaultTheme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#00455c',
    primary25: '#e4e7e7',
    primary50: '#e4e7e7'
  }
});
