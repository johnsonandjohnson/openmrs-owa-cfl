import {
  LOCATION_ATTRIBUTE_TYPE,
  PATIENT_IDENTIFIER,
  PERSON_LANGUAGE_ATTRIBUTE_TYPE,
  TELEPHONE_NUMBER_ATTRIBUTE_TYPE,
} from "../constants/patient";
import {
  extractAttribute,
  extractAttributes,
  extractIdentifiers,
  extractValue,
} from "./omrs-entity-util";
import { columnContent as personColumnContent } from "./person-util";
import { IPatient } from "../models/patient";

export const columnContent = (patient, column, intl) => {
  // extract the value from person first
  const content =
    patient.person && personColumnContent(patient.person, column, intl);
  if (!!content) {
    return content;
  } else {
    // extract the value from patient otherwise
    switch (column) {
      case PATIENT_IDENTIFIER:
        return patient.identifiers && patient.identifiers[0].identifier;
      default:
        return extractValue(patient[column]);
    }
  }
};

export const setValue = (patient, prop, callback, value) => {
  patient[prop] = value;
  callback(patient);
};

export const setValueOnChange = (patient, prop, callback) => (event) => {
  setValue(
    patient,
    prop,
    callback,
    event && event.target ? event.target.value : event
  );
};

const extractBirthdate = (person) => {
  if (person.birthdate) {
    const bd = new Date(person.birthdate);
    const birthdateMonth = bd.getUTCMonth() + 1;
    const birthdateDay = bd.getUTCDate();
    const birthdateYear = bd.getUTCFullYear();
    return { birthdateDay, birthdateMonth, birthdateYear };
  }
  return {};
};

export const extractPatientData = (patient) => {
  const { person } = patient;
  const { preferredName, preferredAddress, gender } = person;
  const { givenName, middleName, familyName } = preferredName;
  const {
    address1,
    address2,
    cityVillage,
    stateProvince,
    country,
    postalCode,
  } = preferredAddress || {};
  const patientData = {
    patientId: patient.patientId,
    givenName,
    middleName,
    familyName,
    gender,
    ...extractBirthdate(person),
    address1,
    address2,
    cityVillage,
    stateProvince,
    country,
    postalCode,
    personLanguage: extractAttribute(person, PERSON_LANGUAGE_ATTRIBUTE_TYPE),
    phoneNumber: extractAttribute(person, TELEPHONE_NUMBER_ATTRIBUTE_TYPE),
    locationId: extractAttribute(person, LOCATION_ATTRIBUTE_TYPE),
    ...extractAttributes(person),
    ...extractIdentifiers(person),
  } as IPatient;
  // patientData[AADHAR_NUMBER_IDENTIFIER] = extractIdentifier(patient, AADHAR_NUMBER_IDENTIFIER);
  // patientData[ART_NUMBER_IDENTIFIER] = extractIdentifier(patient, ART_NUMBER_IDENTIFIER);
  return patientData;
};

export const extractPatientRelationships = (
  patientId,
  patientRelationships
) => {
  return patientRelationships.map((relationship) => {
    const { personA, personB, relationshipType } = relationship;
    const isPersonA = personA.uuid === patientId;
    return {
      relationshipType: isPersonA
        ? relationshipType.uuid + "-B"
        : relationshipType.uuid + "-A",
      otherPerson: {
        label: isPersonA ? personB.display : personA.display,
        value: isPersonA ? personB.uuid : personA.uuid,
      },
    };
  });
};
