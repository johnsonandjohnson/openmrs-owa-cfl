import { defaultFields as nameFields } from "../../components/register-patient/steps/Name";
import { defaultFields as genderFields } from "../../components/register-patient/steps/Gender";
import {
  defaultFieldsGroup1 as birthdateFieldsGroup1,
  defaultFieldsGroup2 as birthdateFieldsGroup2,
} from "../../components/register-patient/steps/Birthdate";
import { defaultFields as addressFields } from "../../components/register-patient/steps/Address";
import { defaultFields as languageFields } from "../../components/register-patient/steps/Language";
import { defaultFields as phoneNumberFields } from "../../components/register-patient/steps/PhoneNumber";
import { defaultFields as patientLocationFields } from "../../components/register-patient/steps/PatientLocation";
import { defaultFields as aadharNumberFields } from "../../components/register-patient/steps/AadharNumber";
import { defaultFields as artNumberFields } from "../../components/register-patient/steps/ArtNumber";

export const SETTING_PREFIX = `cflui.`;
export const FIND_PATIENT_TABLE_COLUMNS_SETTING =
  SETTING_PREFIX + "findPatientTableColumns";
export const FIND_CAREGIVER_TABLE_COLUMNS_SETTING =
  SETTING_PREFIX + "findCaregiverTableColumns";
export const FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION =
  "A comma-separated list of possible columns and their labels:\n" +
  "patientIdentifier - Identifier,\n" +
  "givenName - First Name,\n" +
  "familyName - Last Name,\n" +
  "display - Name,\n" +
  "gender - Gender,\n" +
  "age - Age,\n" +
  "birthdate - Birthdate,\n" +
  "birthdateEstimated - Is birthdate estimated,\n" +
  "phoneNumber - Phone number,\n" +
  "uuid - ID,\n" +
  "personLanguage - Language";
export const FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION = FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION;

export const REGISTRATION_SETTING_PREFIX = SETTING_PREFIX + "registration.";

const JSON_FIELDS_DESCRIPTION =
  "This has to be a proper JSON with the structure of [{name: 'fieldName', required: true|false, type: 'text|number|select'}]";

export const REGISTRATION_SETTINGS = {
  enabledSteps: {
    name: REGISTRATION_SETTING_PREFIX + "enabledSteps",
    description:
      "A comma-separated list of enabled registration steps. Possible values: name, gender, birthdate, address, language, phoneNumber, patientLocation, aadharNumber, artNumber, relatives",
  },
  possiblePersonLanguages: {
    name: REGISTRATION_SETTING_PREFIX + "possiblePersonLanguages",
    description: "A comma-separated list of possible person languages.",
  },
  nameFields: {
    name: REGISTRATION_SETTING_PREFIX + "nameFields",
    description:
      "Possible fields: givenName, middleName, familyName. " +
      JSON_FIELDS_DESCRIPTION,
  },
  genderFields: {
    name: REGISTRATION_SETTING_PREFIX + "genderFields",
    description: "Possible fields: gender. " + JSON_FIELDS_DESCRIPTION,
  },
  birthdateFieldsGroup1: {
    name: REGISTRATION_SETTING_PREFIX + "birthdateFieldsGroup1",
    description:
      "Possible fields: birthdateDay, birthdateMonth, birthdateYear. " +
      JSON_FIELDS_DESCRIPTION,
  },
  birthdateFieldsGroup2: {
    name: REGISTRATION_SETTING_PREFIX + "birthdateFieldsGroup2",
    description:
      "Estimated age group. These fields are conditionally required if the birthdate is empty. Possible fields: birthdateYears, birthdateMonths." +
      JSON_FIELDS_DESCRIPTION,
  },
  addressFields: {
    name: REGISTRATION_SETTING_PREFIX + "addressFields",
    description:
      "Possible fields: address1, address2, cityVillage, stateProvince, country, postalCode. " +
      JSON_FIELDS_DESCRIPTION,
  },
  languageFields: {
    name: REGISTRATION_SETTING_PREFIX + "languageFields",
    description: "Possible fields: personLanguage. " + JSON_FIELDS_DESCRIPTION,
  },
  phoneNumberFields: {
    name: REGISTRATION_SETTING_PREFIX + "phoneNumberFields",
    description: "Possible fields: phoneNumber. " + JSON_FIELDS_DESCRIPTION,
  },
  patientLocationFields: {
    name: REGISTRATION_SETTING_PREFIX + "patientLocationFields",
    description: "Possible fields: locationId. " + JSON_FIELDS_DESCRIPTION,
  },
  aadharNumberFields: {
    name: REGISTRATION_SETTING_PREFIX + "aadharNumberFields",
    description: "Possible fields: aadharNumber. " + JSON_FIELDS_DESCRIPTION,
  },
  artNumberFields: {
    name: REGISTRATION_SETTING_PREFIX + "artNumberFields",
    description: "Possible fields: artNumber. " + JSON_FIELDS_DESCRIPTION,
  },
};

// needs to be a method so that we can define field defaults directly in steps
export const getDefaultValue = (fieldName) =>
  [
    {
      name: REGISTRATION_SETTINGS.enabledSteps.name,
      value:
        "name,gender,birthdate,address,language,phoneNumber,patientLocation,aadharNumber,artNumber,relatives",
    },
    {
      name: REGISTRATION_SETTINGS.possiblePersonLanguages.name,
      value: "English,Marathi,Hindi",
    },
    {
      name: REGISTRATION_SETTINGS.nameFields.name,
      value: JSON.stringify(nameFields),
    },
    {
      name: REGISTRATION_SETTINGS.genderFields.name,
      value: JSON.stringify(genderFields),
    },
    {
      name: REGISTRATION_SETTINGS.birthdateFieldsGroup1.name,
      value: JSON.stringify(birthdateFieldsGroup1),
    },
    {
      name: REGISTRATION_SETTINGS.birthdateFieldsGroup2.name,
      value: JSON.stringify(birthdateFieldsGroup2),
    },
    {
      name: REGISTRATION_SETTINGS.addressFields.name,
      value: JSON.stringify(addressFields),
    },
    {
      name: REGISTRATION_SETTINGS.languageFields.name,
      value: JSON.stringify(languageFields),
    },
    {
      name: REGISTRATION_SETTINGS.phoneNumberFields.name,
      value: JSON.stringify(phoneNumberFields),
    },
    {
      name: REGISTRATION_SETTINGS.patientLocationFields.name,
      value: JSON.stringify(patientLocationFields),
    },
    {
      name: REGISTRATION_SETTINGS.aadharNumberFields.name,
      value: JSON.stringify(aadharNumberFields),
    },
    {
      name: REGISTRATION_SETTINGS.artNumberFields.name,
      value: JSON.stringify(artNumberFields),
    },
  ].find((dv) => dv.name === fieldName)?.value;
