import axios from "axios";

import { REQUEST, SUCCESS, FAILURE } from "../action-type.util";

export const ACTION_TYPES = {
  GET_SETTINGS: "settings/GET_SETTINGS",
  CREATE_SETTING: "settings/CREATE_SETTING",
};

export const SETTING_PREFIX = `cflui.`;
export const FIND_PATIENT_TABLE_COLUMNS_SETTING =
  SETTING_PREFIX + "findPatientTableColumns";
export const FIND_CAREGIVER_TABLE_COLUMNS_SETTING =
  SETTING_PREFIX + "findCaregiverTableColumns";
export const FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION =
  "A list of possible columns and their labels:\n" +
  "patientIdentifier - Identifier,\n" +
  "givenName - First Name,\n" +
  "familyName - Last Name,\n" +
  "display - Name,\n" +
  "gender - Gender,\n" +
  "age - Age,\n" +
  "birthdate - Birthdate,\n" +
  "birthdateEstimated - Is birthdate estimated,\n" +
  "phoneNumber - Phone number,\n" +
  "uuid - ID,\n" +
  "personLanguage - Language";
export const FIND_PATIENT_TABLE_COLUMNS_SETTING_DESCRIPTION = FIND_CAREGIVER_TABLE_COLUMNS_SETTING_DESCRIPTION;

const initialState = {
  loading: false,
  errorMessage: null,
  settings: [],
  findPatientTableColumnsSetting: {},
  findCaregiverTableColumnsSetting: {},
};

export const getSetting = (settings, property) => {
  return settings.find((setting) => setting.property === property);
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
