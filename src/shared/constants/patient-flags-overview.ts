/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
export const DEFAULT_PAGE_SIZE = 50;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const COLUMNS = [
  { label: 'Patient ID', value: 'patientIdentifier'},
  { label: 'Patient name', value: 'patientName'},
  { label: 'Phone number', value: 'phoneNumber'},
  { label: 'Status', value: 'patientStatus'},
] 