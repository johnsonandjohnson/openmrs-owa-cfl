/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const DROPDOWN = 'DROPDOWN';
const FREE_INPUT = 'FREE_INPUT';
export const ADDRESS_FIELDS = ['countyDistrict', 'stateProvince', 'cityVillage', 'postalCode', 'address1', 'address2'];
export const ADDRESS_FIELD_TYPE = {
  countyDistrict: DROPDOWN,
  stateProvince: DROPDOWN,
  cityVillage: DROPDOWN,
  postalCode: DROPDOWN,
  address1: FREE_INPUT,
  address2: FREE_INPUT
};
