/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export interface IPatient {
  givenName: string;
  middleName: string;
  familyName: string;
  preferred: boolean;
  gender: string;
  unknown: boolean;
  birthdate?: any;
  address1: string;
  address2: string;
  cityVillage: string;
  stateProvince: string;
  country: string;
  postalCode: string;
  personLanguage: string;
  phoneNumber: number;
  locationId: string;
  // 'Aadhar Number' in the request
  aadharNumber: number;
  // 'ART Number' in the request
  artNumber: number;
  relationship_type: string;
  other_person_uuid: string;
  birthdateYears: number;
  birthdateMonths: number;
  patientId?: number;
  personId?: number;
  uuid?: string;
  // custom
  relatives?: any[];
  LocationAttribute?: string;
}
