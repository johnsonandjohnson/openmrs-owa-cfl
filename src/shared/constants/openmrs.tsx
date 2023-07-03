/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export const ROOT_URL = '/openmrs/';
export const WS_REST_V1_URL = `${ROOT_URL}ws/rest/v1/`;
export const PATIENT_PAGE_URL = `${ROOT_URL}coreapps/clinicianfacing/patient.page`;
export const CONDITIONS_PAGE_URL = `${ROOT_URL}coreapps/conditionlist/manageConditions.page`;
/** Default URL to redirect after successful registration. */
export const DEFAULT_REGISTRATION_FORM_REDIRECT = `${PATIENT_PAGE_URL}?patientId=%PATIENT_ID%&dashboard=%PERSON_TYPE%`;
