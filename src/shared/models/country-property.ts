/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { IConcept } from './concept';

export interface ICountryProperty {
  uuid: string;
  name: string;
  description: string;
  country: IConcept;
  value: string;
}

export interface ICountryPropertyValue {
  country: String;
  name: String;
  value: String;
}

export interface ICountryPropertyState {
  loading: boolean;
  errorMessage: string;
  countryProperties: ICountryProperty[];
  success: boolean;
  isSetValuesSuccessful: boolean;
}
