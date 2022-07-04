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
  } else {
    return 'common.ordinalSuffix.th';
  }
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

export const getPlaceholder = (intl, translationId, required) => {
  let placeholder = intl.formatMessage({ id: translationId });
  if (required) {
    placeholder = [
      placeholder,
      intl.formatMessage({
        id: 'common.required'
      })
    ].join(' ');
  }
  return placeholder;
};

export const yesNoOptions = intl => [
  {
    label: intl.formatMessage({ id: 'common.yes' }),
    value: true
  },
  {
    label: intl.formatMessage({ id: 'common.no' }),
    value: false
  }
];
