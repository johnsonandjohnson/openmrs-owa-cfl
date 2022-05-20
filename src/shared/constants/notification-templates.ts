/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { EMPTY_STRING } from './input';

export const NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX = 'messages.notificationTemplate.';
export const INJECTED_SERVICES_SETTING_KEY_SUFFIX = 'injectedServices';
export const INJECTED_SERVICES_SETTING_KEY = NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX + INJECTED_SERVICES_SETTING_KEY_SUFFIX;
export const TEMPLATE_NAME_PROPERTY_NAME = 'property';
export const TEMPLATE_DESCRIPTION_PROPERTY_NAME = 'description';
export const TEMPLATE_VALUE_PROPERTY_NAME = 'value';
export const TEMPLATE_UUID_PROPERTY_NAME = 'uuid';
export const TEMPLATE_NAME_REGEX = /^[^\d\s][a-z-]*$/g;
export const INJECTED_SERVICES_DELIMITER = ',';
export const INJECTED_SERVICES_KEY_VALUE_DELIMITER = ':';
export const INJECTED_SERVICES_KEY = 'key';
export const INJECTED_SERVICES_VALUE = 'value';
export const DEFAULT_INJECTED_SERVICE = { [INJECTED_SERVICES_KEY]: EMPTY_STRING, [INJECTED_SERVICES_VALUE]: EMPTY_STRING };
