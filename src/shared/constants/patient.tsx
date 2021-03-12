// patient/person's fields
export const PATIENT_IDENTIFIER = "patientIdentifier";
export const DISPLAY = "display";
export const GENDER = "gender";
export const AGE = "age";
export const BIRTHDATE = "birthdate";
export const DEATH_DATE = "deathDate";
export const PREFERRED_ADDRESS = "preferredAddress";
export const PHONE_NUMBER = "phoneNumber";
export const PERSON_LANGUAGE = "personLanguage";

// attribute types
export const TELEPHONE_NUMBER_ATTRIBUTE_TYPE = "Telephone Number";
export const PERSON_LANGUAGE_ATTRIBUTE_TYPE = "personLanguage";

// table columns
export const FIND_PATIENT_TABLE_COLUMNS =
  process.env.REACT_APP_FIND_PATIENT_TABLE_COLUMNS ||
  `${PATIENT_IDENTIFIER},${DISPLAY},${GENDER},${AGE},${BIRTHDATE}`;
export const TABLE_COLUMNS = FIND_PATIENT_TABLE_COLUMNS.split(",");
export const DEFAULT_COLUMN_VALUE = "";
