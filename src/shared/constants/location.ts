/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { ILocation } from '../models/location';

export const REQUIRED_OCCURRENCE = 1;
export const COLUMNS = 2;
export const DROPDOWN_HANDLER_CONFIG_SEPARATOR = ',';
export const BOOLEAN_RADIOS_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.BooleanFieldGenDatatypeHandler';
export const DROPDOWN_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.SpecifiedTextOptionsDropdownHandler';
export const TEXTAREA_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.LongFreeTextTextareaHandler';
export const LOCATION_DEFAULT_TAG_LIST_SETTING_KEY = 'cflui.location.defaultTag.uuid.list';
export const DEFAULT_LOCATION: ILocation = {
  name: '',
  description: '',
  address1: '',
  address2: '',
  cityVillage: '',
  stateProvince: '',
  country: '',
  postalCode: '',
  tags: [],
  attributes: []
};
export const COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID = '78dd0af8-9ea5-475a-858a-0adf31e448bd';
export const CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID = 'b59e7f64-11a0-44e2-bbff-27693ff5e735';
export const MANDATORY_LOCATION_ATTRIBUTE_TYPE_UUID = [COUNTRY_CODE_LOCATION_ATTRIBUTE_TYPE_UUID, CLUSTER_LOCATION_ATTRIBUTE_TYPE_UUID];
