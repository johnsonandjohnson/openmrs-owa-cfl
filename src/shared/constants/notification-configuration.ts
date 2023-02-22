/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { getData } from 'country-list';
import _ from 'lodash';
import { ZERO, DEFAULT_TIME_FORMAT } from './input';
import { parseJson } from '../util/json-util';
import moment from 'moment';

export const COUNTRY_OPTIONS = _.sortBy(getData(), 'name').map(({ name }) => ({ label: name, value: name }));
export const COUNTRY_SETTINGS_MAP_SETTING_KEY = 'cfl.countrySettingsMap';
export const MESSAGES_COUNTRY_PROPERTIES_PREFIX = 'message';
export const DEFAULT_COUNTRY_CONFIGURATION_NAME = 'default';
export const DEFAULT_COUNTRY_SETTINGS_MAP = { [DEFAULT_COUNTRY_CONFIGURATION_NAME]: {} };
export const CONFIGURATION_NAME_PROPERTY_NAME = 'name';
export const SMS_PROPERTY_NAME = 'SMS';
export const CALL_PROPERTY_NAME = 'CALL';
export const WHATSAPP_PROPERTY_NAME = 'WhatsApp';
export const PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME = 'performCallOnPatientRegistration';
export const SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME = 'sendSmsOnPatientRegistration';
export const SEND_CALL_REMINDER_PROPERTY_NAME = 'shouldSendReminderViaCall';
export const SEND_SMS_REMINDER_PROPERTY_NAME = 'shouldSendReminderViaSms';
export const SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME = 'sendWhatsAppOnPatientRegistration';
export const SEND_WHATSAPP_REMINDER_PROPERTY_NAME = 'shouldSendReminderViaWhatsApp';
export const NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME = 'patientNotificationTimeWindowFrom';
export const NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME = 'patientNotificationTimeWindowTo';
export const BEST_CONTACT_TIME_PROPERTY_NAME = 'message.bestContactTime.default';
export const VISIT_REMINDER_PROPERTY_NAME = 'message.daysToCallBeforeVisit.default';
export const SHOULD_CREATE_FIRST_VISIT = 'shouldCreateFirstVisit';
export const SHOULD_CREATE_FUTURE_VISITS = 'shouldCreateFutureVisit';
export const DEFAULT_COUNTRY_CONFIGURATION = {
  [CONFIGURATION_NAME_PROPERTY_NAME]: '',
  [SMS_PROPERTY_NAME]: null,
  [CALL_PROPERTY_NAME]: null,
  [WHATSAPP_PROPERTY_NAME]: null,
  [PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME]: false,
  [SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME]: false,
  [SEND_CALL_REMINDER_PROPERTY_NAME]: false,
  [SEND_SMS_REMINDER_PROPERTY_NAME]: false,
  [SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME]: false,
  [SEND_WHATSAPP_REMINDER_PROPERTY_NAME]: false,
  [SHOULD_CREATE_FIRST_VISIT]: false,
  [SHOULD_CREATE_FUTURE_VISITS]: false,
  [NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]: null,
  [NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]: null,
  [BEST_CONTACT_TIME_PROPERTY_NAME]: null,
  [VISIT_REMINDER_PROPERTY_NAME]: [ZERO]
};

// Maps Country Property name to the Notification Configuration property.
export const COUNTRY_CONFIGURATION_TO_PROPERTY_MAPPING = {
  'messages.smsConfig': SMS_PROPERTY_NAME,
  'messages.callConfig': CALL_PROPERTY_NAME,
  'messages.whatsAppConfig': WHATSAPP_PROPERTY_NAME,
  'messages.performCallOnPatientRegistration': PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME,
  'messages.sendSmsOnPatientRegistration': SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME,
  'messages.shouldSendReminderViaCall': SEND_CALL_REMINDER_PROPERTY_NAME,
  'messages.shouldSendReminderViaSms': SEND_SMS_REMINDER_PROPERTY_NAME,
  'messages.sendWhatsAppOnPatientRegistration': SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME,
  'messages.shouldSendReminderViaWhatsApp': SEND_WHATSAPP_REMINDER_PROPERTY_NAME,
  'visits.shouldCreateFirstVisit': SHOULD_CREATE_FIRST_VISIT,
  'visits.shouldCreateFutureVisit': SHOULD_CREATE_FUTURE_VISITS,
  'messages.patientNotificationTimeWindowFrom': NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME,
  'messages.patientNotificationTimeWindowTo': NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME,
  [BEST_CONTACT_TIME_PROPERTY_NAME]: BEST_CONTACT_TIME_PROPERTY_NAME,
  [VISIT_REMINDER_PROPERTY_NAME]: VISIT_REMINDER_PROPERTY_NAME
};

// Default getter used to extract proper value from any Country Property value.
export const COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER_DEFAULT = propertyValue => propertyValue;

const safeTimeStringToMoment = value => (value ? moment(value, DEFAULT_TIME_FORMAT) : null);

const BEST_CONTACT_TIME_VALUE_JSON_PROPERTY = 'global';

// Getters used to extract Notification Configuration value from any Country Property value based on the property name.
export const COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER = {
  'messages.patientNotificationTimeWindowFrom': safeTimeStringToMoment,
  'messages.patientNotificationTimeWindowTo': safeTimeStringToMoment,
  [BEST_CONTACT_TIME_PROPERTY_NAME]: propertyValue => {
    try {
      return moment(parseJson(propertyValue)[BEST_CONTACT_TIME_VALUE_JSON_PROPERTY], DEFAULT_TIME_FORMAT);
    } catch (e) {
      console.error(`Failed to read ${BEST_CONTACT_TIME_PROPERTY_NAME}, encountered value: ${propertyValue}`);
      return moment();
    }
  },
  [VISIT_REMINDER_PROPERTY_NAME]: propertyValue => (propertyValue ? propertyValue.split(',') : [])
};

// Maps Notification Configuration property to Country Property by name;
export const PROPERTY_TO_COUNTRY_CONFIGURATION_MAPPING = Object.entries(COUNTRY_CONFIGURATION_TO_PROPERTY_MAPPING).reduce(
  (map: {}, entry: string[]) => {
    map[entry[1]] = entry[0];
    return map;
  },
  {}
);

// Default getter used to extract proper value from Notification Configuration, for Country Property.
export const PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER_DEFAULT = propertyValue => {
  if (propertyValue != null) {
    return propertyValue.toString();
  } else {
    return null;
  }
}

const safeMomentToTimeString = value =>
  moment.isMoment(value) ? value.format(DEFAULT_TIME_FORMAT) : PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER_DEFAULT(value);

// Getter used to extract proper value from Notification Configuration, for Country Property.
export const PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER = {
  [BEST_CONTACT_TIME_PROPERTY_NAME]: value => {
    const timeAsString = safeMomentToTimeString(value);
    return timeAsString ? `{ "${BEST_CONTACT_TIME_VALUE_JSON_PROPERTY}": "${timeAsString}"}` : null;
  },
  [NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]: safeMomentToTimeString,
  [NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]: safeMomentToTimeString,
  [VISIT_REMINDER_PROPERTY_NAME]: value => (value ? value.join() : null)
};
