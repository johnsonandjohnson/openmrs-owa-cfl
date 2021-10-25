export const PERSON_ID_LOOKUP_STRING = 'personId=';
export const EMAIL_REGEX = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const USERNAME_REGEX = /^[\w\d\\_][\w\d\\_\\-\\.]{1,49}$/;
export const SETTING_ATTRIBUTE_TYPE_PREFIX = 'cfl.person.attributeType';
export const SETTING_TELEPHONE_NUMBER_ATRRIBUTE_TYPE = `${SETTING_ATTRIBUTE_TYPE_PREFIX}.telephoneNumberUuid`;
export const SETTING_EMAIL_ADDRESS_ATRRIBUTE_TYPE = `${SETTING_ATTRIBUTE_TYPE_PREFIX}.emailAddressUuid`;
export const DEFAULT_AUDIT_DATE_FORMAT = 'DD.MMM.YYYY, HH:mm:ss';
export const DEFAULT_EDIT_USER_PASSWORD = 'xxxxxx';
export const GENDER_OTHER = 'O';
export const FAMILY_NAME_FIELD = 'familyName';
export const GIVEN_NAME_FIELD = 'givenName';
export const PHONE_FIELD = 'phone';
export const EMAIL_FIELD = 'email';
export const USERNAME_FIELD = 'username';
export const LOCATION_FIELD = 'locations';
export const USER_ROLE_FIELD = 'userRole';
export const PASSWORD_FIELD = 'password';
export const CONFIRM_PASSWORD_FIELD = 'confirmPassword';
export const DEFAULT_USER_VALUES = {
  familyName: { value: '', isValid: true, error: '' },
  givenName: { value: '', isValid: true, error: '' },
  phone: { value: '', isValid: true, error: '' },
  email: { value: '', isValid: true, error: '' },
  username: { value: '', isValid: true, error: '' },
  locations: { value: [], isValid: true, error: '' },
  userRole: { value: null, isValid: true, error: '' },
  password: { value: '', isValid: true, error: '' },
  confirmPassword: { value: '', isValid: true, error: '' }
};
