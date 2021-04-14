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
export const REGISTRATION_STEPS_SETTING = REGISTRATION_SETTING_PREFIX + "steps";
export const REGISTRATION_STEPS_SETTING_DESCRIPTION =
  "A JSON representation of Registration steps and fields.";
