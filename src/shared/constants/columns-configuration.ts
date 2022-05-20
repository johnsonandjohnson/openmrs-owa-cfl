/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { AGE, BIRTHDATE, DISPLAY, GENDER, OPENMRS_ID, TELEPHONE_NUMBER_ATTRIBUTE_TYPE } from './patient';

export const RETURN_LOCATION = '/openmrs/adminui/metadata/configureMetadata.page';
export const COLUMNS_CONFIGURATION_SETTING_KEY = 'cflui.findPatientColumnsConfiguration';
export const DEFAULT_COLUMN_CONFIGURATION = { label: '', value: '', isValid: true };
export const FIRST_COLUMN_NAME_LETTERS_REGEX = /\w\S*/g;
export const ADJACENT_LOWER_AND_UPPER_LETTERS_REGEX = /([a-z])([A-Z])/g;
export const FIXED_COLUMNS = [
  { label: 'Identifier', value: OPENMRS_ID },
  { label: 'Name', value: DISPLAY },
  { label: 'Age', value: AGE }
];
export const DEFAULT_COLUMNS = [
  ...FIXED_COLUMNS,
  { label: 'Gender', value: GENDER },
  { label: 'Birthdate', value: BIRTHDATE },
  { label: TELEPHONE_NUMBER_ATTRIBUTE_TYPE, value: TELEPHONE_NUMBER_ATTRIBUTE_TYPE }
];
