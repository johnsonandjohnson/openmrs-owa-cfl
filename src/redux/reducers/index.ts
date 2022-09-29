/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { combineReducers } from 'redux';
import cflPatient from './patient';
import cflPerson from './person';
import cflPeople from './cfl-people';
import session from './session';
import settings from './setttings';
import countryProperty from './countryProperty';
import location from './location';
import relationshipType from './relationship-type';
import registration from './registration';
import { reducers as openmrsReducers } from '@openmrs/react-components';
import { reducer as reduxFormReducer } from 'redux-form';
import customizeReducer from '../../components/customize/customize.reducer';
import person from '../../components/person-header/person.reducer';
import patient from '../../components/person-header/patient.reducer';
import personStatus from '../../components/person-status/person-status.reducer';
import apps from './apps';
import concept from './concept';
import condition from './condition';
import breadcrumbs from './breadcrumbs';
import visit from './visit';
import addressData from './address-data';
import provider from './provider';
import messages from './messages';
import role from './role';
import user from './user';
import manageRegimens from './manage-regimens';
import orderSet from './order-set';
import drugs from './drugs';
import orderFrequency from './order-frequency';
import orderType from './order-type';
import findPatientColumnsConfiguration from './columns-configuration';

export default combineReducers({
  cflPatient,
  cflPerson,
  cflPeople,
  session,
  settings,
  countryProperty,
  location,
  relationshipType,
  registration,
  apps,
  concept,
  condition,
  breadcrumbs,
  person,
  patient,
  personStatus,
  role,
  user,
  customizeReducer,
  visit,
  addressData,
  provider,
  messages,
  manageRegimens,
  orderSet,
  drugs,
  orderFrequency,
  orderType,
  findPatientColumnsConfiguration,
  openmrs: openmrsReducers,
  form: reduxFormReducer
});
