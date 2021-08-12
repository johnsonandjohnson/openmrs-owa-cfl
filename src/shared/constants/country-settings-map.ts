import { ZERO } from './input';

export const COUNTRY_SETTINGS_MAP_SETTING_KEY = 'cfl.countrySettingsMap';
export const DEFAULT_COUNTRY_CONFIGURATION_NAME = 'default';
export const DEFAULT_COUNTRY_SETTINGS_MAP = { [DEFAULT_COUNTRY_CONFIGURATION_NAME]: {} };
export const CONFIGURATION_NAME_PROPERTY_NAME = 'name';
export const SMS_PROPERTY_NAME = 'SMS';
export const CALL_PROPERTY_NAME = 'CALL';
export const PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME = 'performCallOnPatientRegistration';
export const SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME = 'sendSmsOnPatientRegistration';
export const SEND_CALL_REMINDER_PROPERTY_NAME = 'shouldSendReminderViaCall';
export const SEND_SMS_REMINDER_PROPERTY_NAME = 'shouldSendReminderViaSms';
export const NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME = 'patientNotificationTimeWindowFrom';
export const NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME = 'patientNotificationTimeWindowTo';
export const BEST_CONTACT_TIME_PROPERTY_NAME = 'message.bestContactTime.default';
export const VISIT_REMINDER_PROPERTY_NAME = 'message.daysToCallBeforeVisit.default';
export const DEFAULT_COUNTRY_CONFIGURATION = {
  [CONFIGURATION_NAME_PROPERTY_NAME]: '',
  [SMS_PROPERTY_NAME]: '',
  [CALL_PROPERTY_NAME]: '',
  [PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME]: false,
  [SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME]: false,
  [SEND_CALL_REMINDER_PROPERTY_NAME]: false,
  [SEND_SMS_REMINDER_PROPERTY_NAME]: false,
  shouldCreateFirstVisit: false,
  shouldCreateFutureVisit: false,
  [NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]: null,
  [NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]: null,
  [BEST_CONTACT_TIME_PROPERTY_NAME]: null,
  [VISIT_REMINDER_PROPERTY_NAME]: [ZERO]
};
