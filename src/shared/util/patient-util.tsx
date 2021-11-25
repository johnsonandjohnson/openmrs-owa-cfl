import { BIRTHDATE, TELEPHONE_NUMBER_ATTRIBUTE_TYPE } from '../constants/patient';
import { extractAttribute, extractAttributes, extractIdentifier, extractIdentifiers } from './omrs-entity-util';
import { getPhoneNumberWithPlusSign } from './person-util';
import { IPatient } from '../models/patient';
import { formatDate } from './date-util';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

export const columnContent = (patient, column, intl) => {
  const { person } = patient;
  const { preferredAddress, preferredName } = person;
  const attributesValue = extractAttribute(person, column);
  const personValue = person[column];

  if (attributesValue) {
    return column === TELEPHONE_NUMBER_ATTRIBUTE_TYPE
      ? formatPhoneNumberIntl(getPhoneNumberWithPlusSign(attributesValue))
        ? getPhoneNumberWithPlusSign(attributesValue)
        : attributesValue
      : attributesValue;
  } else if (personValue) {
    return column === BIRTHDATE ? formatDate(intl, new Date(personValue)) : personValue;
  } else {
    return preferredName?.[column] || preferredAddress?.[column] || extractIdentifier(patient, column);
  }
};

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
