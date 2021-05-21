import { PATIENT_IDENTIFIER } from '../constants/patient';
import { extractAttributes, extractIdentifiers, extractValue } from './omrs-entity-util';
import { columnContent as personColumnContent } from './person-util';
import { IPatient } from '../models/patient';

export const columnContent = (patient, column, intl) => {
  // extract the value from person first
  const content = patient.person && personColumnContent(patient.person, column, intl);
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

export const setValueOnChange = (patient, prop, callback) => event =>
  setValue(patient, prop, callback, event && event.target ? event.target.value : event);

export const extractPatientOrPersonData = patient => {
  const person = patient.person || patient;
  const { preferredName, preferredAddress, gender, uuid, personId } = person;
  const { givenName, middleName, familyName } = preferredName;
  const { address1, address2, cityVillage, stateProvince, country, postalCode } = preferredAddress || {};
  return {
    patientId: patient.patientId || uuid,
    uuid: patient.uuid,
    personId,
    givenName,
    middleName,
    familyName,
    gender,
    birthdate: !!person.birthdate ? new Date(person.birthdate) : null,
    address1,
    address2,
    cityVillage,
    stateProvince,
    country,
    postalCode,
    ...extractAttributes(person),
    ...extractIdentifiers(patient)
  } as IPatient;
};

export const extractPersonRelationships = (patientId, personRelationships) =>
  personRelationships.map(relationship => {
    const { personA, personB, relationshipType } = relationship;
    const isPersonA = personA.uuid === patientId;
    return {
      relationshipType: isPersonA ? relationshipType.uuid + '-B' : relationshipType.uuid + '-A',
      otherPerson: {
        label: isPersonA ? personB.display : personA.display,
        value: isPersonA ? personB.uuid : personA.uuid
      }
    };
  });
