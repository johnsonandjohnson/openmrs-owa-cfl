/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { TELEPHONE_NUMBER_ATTRIBUTE_TYPE } from '../constants/patient';
import { extractAttribute, extractIdentifier } from './omrs-entity-util';
import { getPhoneNumberWithPlusSign } from './person-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import moment from 'moment';

export const getPatientHeaderFieldValue = (patient, field) => {
  const fieldName = field.name;

  const { person } = patient;
  const { preferredAddress, preferredName } = person;
  const attributesValue = extractAttribute(person, fieldName);
  const personValue = person[fieldName];
  let value = '';

  if (attributesValue) {
    value = fieldName === TELEPHONE_NUMBER_ATTRIBUTE_TYPE
      ? formatPhoneNumberIntl(attributesValue)
        ? getPhoneNumberWithPlusSign(attributesValue)
        : attributesValue
      : attributesValue;
  } else if (personValue != null) {
    if (field.type === 'date') {
      value = moment.utc(personValue).local().format(field.format);
    } else {
      value = personValue;
    }
  } else if (field.type === 'static') {
    value = field.value;
  } else {
    value = preferredName?.[fieldName] || preferredAddress?.[fieldName] || extractIdentifier(patient, fieldName);
  }

  return value;
};