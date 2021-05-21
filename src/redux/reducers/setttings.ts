import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_SETTINGS: 'settings/GET_SETTINGS',
  CREATE_SETTING: 'settings/CREATE_SETTING'
};

const initialState = {
  loading: false,
  errorMessage: null,
  settings: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SETTINGS):
    case REQUEST(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_SETTINGS):
    case FAILURE(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_SETTINGS):
      return {
        ...initialState,
        settings: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.CREATE_SETTING):
      return {
        ...state,
        loading: false,
        errorMessage: null
      };
    default:
      return state;
  }
};

// actions
export const getSettings = (prefix = '') => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting?q=${prefix}&v=full`;
  return {
    type: ACTION_TYPES.GET_SETTINGS,
    payload: axios.get(requestUrl)
  };
};

export const createSetting = (property, value = '', description = '') => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting`;
  const data = {
    property,
    description
  };
  if (value) {
    data['value'] = value;
  }
  return {
    type: ACTION_TYPES.CREATE_SETTING,
    payload: axios.post(requestUrl, data)
  };
};

export default reducer;
