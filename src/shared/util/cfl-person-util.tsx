/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import {
  BIRTHDATE,
  DEATH_DATE,
  DEFAULT_COLUMN_VALUE,
  DISPLAY,
  FAMILY_NAME,
  GIVEN_NAME,
  PATIENT_IDENTIFIER,
  PERSON_IDENTIFIER,
  PERSON_LANGUAGE,
  PERSON_LANGUAGE_ATTRIBUTE_TYPE,
  PHONE_NUMBER,
  TELEPHONE_NUMBER_ATTRIBUTE_TYPE,
  GENDER,
  GENDER_DICT
} from '../constants/patient';
import { extractValue } from './omrs-entity-util';
import { formatDate } from './date-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { getPhoneNumberWithPlusSign } from '../../shared/util/person-util';

export const extractAttribute = (entity, type) => {
  if (!entity) {
    return DEFAULT_COLUMN_VALUE;
  }
  const attr = entity.attributes && entity.attributes.find(a => a.name.toLowerCase() === type.toLowerCase());
  return (attr && attr.value) || DEFAULT_COLUMN_VALUE;
};

export const columnContent = (person, column, intl) => {
  const names = person.personName && person.personName.split(' ');
  switch (column) {
    case BIRTHDATE:
      return person && person.birthdate && formatDate(intl, new Date(person.birthdate));
    case DEATH_DATE:
      return person && person.deathDate && formatDate(intl, new Date(person.deathDate));
    case GIVEN_NAME:
      return names && names[0];
    case FAMILY_NAME:
      return names && (names.length > 1 ? names[1] : DEFAULT_COLUMN_VALUE);
    case DISPLAY:
      return person.personName;
    case PERSON_IDENTIFIER:
    case PATIENT_IDENTIFIER:
      return person && (person.patientIdentifier || person.personIdentifier);
    case PHONE_NUMBER: {
      const phoneNumber = extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
      return formatPhoneNumberIntl(getPhoneNumberWithPlusSign(phoneNumber)) || phoneNumber;
    }
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    case GENDER:
      return person && (GENDER_DICT[person.gender] || person.gender);
    default:
      return extractValue(person && person[column]);
  }
};
