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
  FAMILY_NAME,
  GIVEN_NAME,
  MIDDLE_NAME,
  PERSON_IDENTIFIER,
  PERSON_IDENTIFIER_ATTRIBUTE_TYPE,
  PERSON_LANGUAGE,
  PERSON_LANGUAGE_ATTRIBUTE_TYPE,
  PHONE_NUMBER,
  TELEPHONE_NUMBER_ATTRIBUTE_TYPE,
  GENDER,
  GENDER_DICT
} from '../constants/patient';
import { extractAttribute, extractValue } from './omrs-entity-util';
import { formatDate } from './date-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

export const PLUS_SIGN = '+';

export const columnContent = (person, column, intl) => {
  switch (column) {
    case BIRTHDATE:
      return person?.birthdate && formatDate(intl, new Date(person.birthdate));
    case DEATH_DATE:
      return person?.deathDate && formatDate(intl, new Date(person.deathDate));
    case GIVEN_NAME:
      return person?.preferredName?.givenName;
    case MIDDLE_NAME:
      return person?.preferredName?.middleName;
    case FAMILY_NAME:
      return person?.preferredName?.familyName;
    case PERSON_IDENTIFIER:
      return extractAttribute(person, PERSON_IDENTIFIER_ATTRIBUTE_TYPE);
    case PHONE_NUMBER: {
      const phoneNumber = extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
      return formatPhoneNumberIntl(getPhoneNumberWithPlusSign(phoneNumber)) || phoneNumber;
    }
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    case GENDER:
      return GENDER_DICT?.[person.gender] || person?.gender;
    default:
      return extractValue(person?.[column]);
  }
};

export const getPhoneNumberWithPlusSign = phoneNumber => phoneNumber && PLUS_SIGN + phoneNumber;
