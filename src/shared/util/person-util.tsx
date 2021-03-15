import { FormattedDate } from "react-intl";
import React from "react";
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
} from "../constants/patient";
import { extractAttribute, extractValue } from "./omrs-entity-util";

export const columnContent = (person, column) => {
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
      return person.preferredName && person.preferredName.givenName;
    case MIDDLE_NAME:
      return person.preferredName && person.preferredName.middleName;
    case FAMILY_NAME:
      return person.preferredName && person.preferredName.familyName;
    case PERSON_IDENTIFIER:
      return extractAttribute(person, PERSON_IDENTIFIER_ATTRIBUTE_TYPE);
    case PHONE_NUMBER:
      return extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
    case PERSON_LANGUAGE:
      return extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    default:
      return extractValue(person && person[column]);
  }
};
