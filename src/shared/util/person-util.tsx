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

export const columnContent = (person, column, intl) => {
  switch (column) {
    case BIRTHDATE:
      return person && person.birthdate && formatDate(intl, new Date(person.birthdate));
    case DEATH_DATE:
      return person && person.deathDate && formatDate(intl, new Date(person.deathDate));
    case GIVEN_NAME:
      return person.preferredName && person.preferredName.givenName;
    case MIDDLE_NAME:
      return person.preferredName && person.preferredName.middleName;
    case FAMILY_NAME:
      return person.preferredName && person.preferredName.familyName;
    case PERSON_IDENTIFIER:
      return extractAttribute(person, PERSON_IDENTIFIER_ATTRIBUTE_TYPE);
    case PHONE_NUMBER: {
      const phoneNumber = extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
      return formatPhoneNumberIntl(phoneNumber) || phoneNumber;
    }
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    case GENDER:
      return person && (GENDER_DICT[person.gender] || person.gender);
    default:
      return extractValue(person && person[column]);
  }
};
