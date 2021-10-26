import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { getAppConfig } from '../../shared/util/app-util';
import {
  FIND_CAREGIVER_APP,
  FIND_PATIENT_APP,
  REGISTER_CAREGIVER_APP,
  REGISTER_PATIENT_APP,
  CONFIGURE_METADATA_APPS
} from '../../shared/constants/app';

export const ACTION_TYPES = {
  GET_APPS: 'settings/GET_APPS'
};

const initialState = {
  loading: false,
  errorMessage: null,
  apps: [],
  findPatientTableColumns: null,
  findCaregiverTableColumns: null,
  patientRegistrationSteps: null,
  caregiverRegistrationSteps: null,
  vmpSyncScopes: null,
  vmpAuthSteps: null,
  vmpDosingVisitTypes: null,
  vmpRegimenUpdatePermitted: null
};

export const getAppsState = apps => ({
  apps,
  findPatientTableColumns: getAppConfig(apps, FIND_PATIENT_APP)?.tableColumns,
  findCaregiverTableColumns: getAppConfig(apps, FIND_CAREGIVER_APP)?.tableColumns,
  patientRegistrationSteps: getAppConfig(apps, REGISTER_PATIENT_APP)?.steps,
  caregiverRegistrationSteps: getAppConfig(apps, REGISTER_CAREGIVER_APP)?.steps,
  vmpSyncScopes: getAppConfig(apps, CONFIGURE_METADATA_APPS)?.syncScopes,
  vmpAuthSteps: getAppConfig(apps, CONFIGURE_METADATA_APPS)?.authSteps,
  vmpDosingVisitTypes: getAppConfig(apps, CONFIGURE_METADATA_APPS)?.dosingVisitTypes,
  vmpRegimenUpdatePermitted: getAppConfig(apps, CONFIGURE_METADATA_APPS)?.regimenUpdatePermitted
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
      return {
        ...initialState,
        ...getAppsState(action.payload.data.results)
      };
    default:
      return state;
  }
};

// actions
export const getApps = () => {
  const requestUrl = `/openmrs/ws/rest/v1/app?v=default`;
  return {
    type: ACTION_TYPES.GET_APPS,
    payload: axios.get(requestUrl)
  };
};

export default reducer;
