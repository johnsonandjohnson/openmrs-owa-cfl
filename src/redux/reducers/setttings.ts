import axios from "axios";

import { FAILURE, REQUEST, SUCCESS } from "../action-type.util";
import {
  FIND_CAREGIVER_TABLE_COLUMNS_SETTING,
  FIND_PATIENT_TABLE_COLUMNS_SETTING,
  REGISTRATION_APP_SETTING,
  REGISTRATION_STEPS_SETTING,
  SETTING_PREFIX,
} from "../../shared/constants/setting";
import {
  getSetting,
  getSettingValue,
  parseJsonSetting,
} from "../../shared/util/setting-util";

export const ACTION_TYPES = {
  GET_SETTINGS: "settings/GET_SETTINGS",
  CREATE_SETTING: "settings/CREATE_SETTING",
};

const initialState = {
  loading: false,
  errorMessage: null,
  settings: [],
  findPatientTableColumnsSetting: {},
  findCaregiverTableColumnsSetting: {},
  registrationSteps: null,
  registrationAppSetting: {},
};

export const getSettingsState = (settings) => {
  return {
    settings,
    findPatientTableColumnsSetting: getSetting(
      settings,
      FIND_PATIENT_TABLE_COLUMNS_SETTING
    ),
    findCaregiverTableColumnsSetting: getSetting(
      settings,
      FIND_CAREGIVER_TABLE_COLUMNS_SETTING
    ),
    registrationSteps: parseJsonSetting(
      getSettingValue(settings, REGISTRATION_STEPS_SETTING),
      null
    ),
    registrationAppSetting: getSetting(settings, REGISTRATION_APP_SETTING),
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SETTINGS):
    case REQUEST(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case FAILURE(ACTION_TYPES.GET_SETTINGS):
    case FAILURE(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.message,
      };
    case SUCCESS(ACTION_TYPES.GET_SETTINGS):
      return {
        ...initialState,
        ...getSettingsState(action.payload.data.results),
      };
    case SUCCESS(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: false,
        errorMessage: null,
      };
    default:
      return state;
  }
};

// actions
export const getSettings = () => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting?q=${SETTING_PREFIX}&v=full`;
  return {
    type: ACTION_TYPES.GET_SETTINGS,
    payload: axios.get(requestUrl),
  };
};

export const createSetting = (property, value = "", description = "") => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting`;
  const data = {
    property,
    description,
  };
  if (value) {
    data["value"] = value;
  }
  return {
    type: ACTION_TYPES.CREATE_SETTING,
    payload: axios.post(requestUrl, data),
  };
};

export default reducer;
