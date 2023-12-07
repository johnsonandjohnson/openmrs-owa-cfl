/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { getAppConfig } from '../../shared/util/app-util';
import { FIND_CAREGIVER_APP, FIND_PATIENT_APP, PATIENT_FLAGS_OVERVIEW_APP, REGISTER_CAREGIVER_APP, REGISTER_PATIENT_APP } from '../../shared/constants/app';

export const ACTION_TYPES = {
  GET_APPS: 'settings/GET_APPS'
};

const initialState = {
  appLoading: false,
  app: null,
  loading: false,
  errorMessage: null,
  apps: [],
  findPatientTableColumns: null,
  findCaregiverTableColumns: null,
  patientRegistrationSteps: null,
  caregiverRegistrationSteps: null,
  confirmPageCustomElements: null,
  patientFlagsOverviewTableColumns: null,
};

export const getAppsState = (apps, projectName) => ({
  apps,
  findPatientTableColumns: getAppConfig(apps, FIND_PATIENT_APP, projectName)?.tableColumns,
  findCaregiverTableColumns: getAppConfig(apps, FIND_CAREGIVER_APP, projectName)?.tableColumns,
  patientRegistrationSteps: getAppConfig(apps, REGISTER_PATIENT_APP, projectName)?.steps,
  caregiverRegistrationSteps: getAppConfig(apps, REGISTER_CAREGIVER_APP, projectName)?.steps,
  registrationRedirectUrl: getAppConfig(apps, REGISTER_PATIENT_APP, projectName)?.redirectUrl,
  confirmPageCustomElements: getAppConfig(apps, REGISTER_PATIENT_APP, projectName)?.confirmPageCustomElements,
  patientFlagsOverviewTableColumns: getAppConfig(apps, PATIENT_FLAGS_OVERVIEW_APP, projectName)?.tableColumns
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_APPS):
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_APPS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_APPS):
      const projectName = action.meta.projectName;
      return {
        ...state,
        loading: false,
        ...getAppsState(action.payload.data, projectName)
      };
    default:
      return state;
  }
};

// actions
export const getApps = (projectName: string) => {
  const requestUrl = `/openmrs/ws/cfl/apps`;
  return {
    type: ACTION_TYPES.GET_APPS,
    payload: axios.get(requestUrl),
    meta: {
      projectName
    }
  };
};

export default reducer;
