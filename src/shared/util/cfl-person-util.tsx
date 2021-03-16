import { FormattedDate } from "react-intl";
import React from "react";
import {
  BIRTHDATE,
  DEATH_DATE,
  DEFAULT_COLUMN_VALUE,
  DISPLAY,
  FAMILY_NAME,
  GIVEN_NAME,
  PATIENT_IDENTIFIER,
  PERSON_LANGUAGE,
  PERSON_LANGUAGE_ATTRIBUTE_TYPE,
  PHONE_NUMBER,
  TELEPHONE_NUMBER_ATTRIBUTE_TYPE,
} from "../constants/patient";
import { extractValue } from "./omrs-entity-util";

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

export const columnContent = (person, column) => {
  const names = person.personName && person.personName.split(" ");
  switch (column) {
    case BIRTHDATE:
      return (
        person && person.birthdate && <FormattedDate value={person.birthdate} />
      );
    case DEATH_DATE:
      return (
        person && person.deathDate && <FormattedDate value={person.deathDate} />
      );
    case GIVEN_NAME:
      return names && names[0];
    case FAMILY_NAME:
      return names && (names.length > 1 ? names[1] : DEFAULT_COLUMN_VALUE);
    case DISPLAY:
      return person.personName;
    case PATIENT_IDENTIFIER:
      return person && (person.patientIdentifier || person.personIdentifier);
    case PHONE_NUMBER:
      return extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    default:
      return extractValue(person && person[column]);
  }
};
