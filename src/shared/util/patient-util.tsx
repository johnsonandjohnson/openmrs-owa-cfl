import { FormattedDate } from "react-intl";
import React from "react";
import {
  BIRTHDATE,
  DEATH_DATE,
  DEFAULT_COLUMN_VALUE,
  DISPLAY,
  PATIENT_IDENTIFIER,
  PERSON_LANGUAGE,
  PERSON_LANGUAGE_ATTRIBUTE_TYPE,
  PHONE_NUMBER,
  TELEPHONE_NUMBER_ATTRIBUTE_TYPE,
} from "../constants/patient";

const extractAttribute = (person, type) => {
  if (!person) {
    return DEFAULT_COLUMN_VALUE;
  }
  const attr =
    person.attributes &&
    person.attributes.find(
      (attr) => attr.attributeType[DISPLAY].toLowerCase() === type.toLowerCase()
    );
  return (attr && attr.value) || DEFAULT_COLUMN_VALUE;
};

const extractValue = (obj) => {
  if (!obj) {
    return DEFAULT_COLUMN_VALUE;
  } else if (Array.isArray(obj)) {
    return obj[0][DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else if (typeof obj === "object") {
    return obj[DISPLAY] || DEFAULT_COLUMN_VALUE;
  } else {
    return obj;
  }
};

export const columnContent = (patient, column) => {
  switch (column) {
    case PATIENT_IDENTIFIER:
      return patient.identifiers && patient.identifiers[0].identifier;
    case BIRTHDATE:
      return (
        patient.person &&
        patient.person.birthdate && (
          <FormattedDate value={patient.person.birthdate} />
        )
      );
    case DEATH_DATE:
      return (
        patient.person &&
        patient.person.deathDate && (
          <FormattedDate value={patient.person.deathDate} />
        )
      );
    case PHONE_NUMBER:
      return extractAttribute(patient.person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE);
    case PERSON_LANGUAGE:
      return extractAttribute(patient.person, PERSON_LANGUAGE_ATTRIBUTE_TYPE);
    default:
      const obj = (patient.person && patient.person[column]) || patient[column];
      return extractValue(obj);
  }
};
