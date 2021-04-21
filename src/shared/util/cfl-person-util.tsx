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
} from "../constants/patient";
import { extractValue } from "./omrs-entity-util";
import { formatDate } from "./date-util";
import { formatPhoneNumberIntl } from "react-phone-number-input";

export const extractAttribute = (entity, type) => {
  if (!entity) {
    return DEFAULT_COLUMN_VALUE;
  }
  const attr =
    entity.attributes &&
    entity.attributes.find(
      (attr) => attr.name.toLowerCase() === type.toLowerCase()
    );
  return (attr && attr.value) || DEFAULT_COLUMN_VALUE;
};

export const columnContent = (person, column, intl) => {
  const names = person.personName && person.personName.split(" ");
  switch (column) {
    case BIRTHDATE:
      return (
        person &&
        person.birthdate &&
        formatDate(intl, new Date(person.birthdate))
      );
    case DEATH_DATE:
      return (
        person &&
        person.deathDate &&
        formatDate(intl, new Date(person.deathDate))
      );
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
      const phoneNumber = extractAttribute(
        person,
        TELEPHONE_NUMBER_ATTRIBUTE_TYPE
      );
      return formatPhoneNumberIntl(phoneNumber) || phoneNumber;
    }
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    default:
      return extractValue(person && person[column]);
  }
};
