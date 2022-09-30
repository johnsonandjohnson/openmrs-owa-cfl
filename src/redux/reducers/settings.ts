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

export const ACTION_TYPES = {
  GET_SETTING: 'settings/GET_SETTING',
  GET_SETTINGS: 'settings/GET_SETTINGS',
  CREATE_SETTING: 'settings/CREATE_SETTING',
  DELETE_SETTING: 'settings/DELETE_SETTING'
};

const initialState = {
  loading: false,
  errorMessage: null,
  settings: [],
  setting: null,
  success: false,
  isSettingExist: { settingPropertyUrl: null, value: false }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SETTING):
    case REQUEST(ACTION_TYPES.GET_SETTINGS):
    case REQUEST(ACTION_TYPES.CREATE_SETTING):
    case REQUEST(ACTION_TYPES.DELETE_SETTING):
      return {
        ...state,
        loading: true,
        success: false,
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_SETTING):
    case FAILURE(ACTION_TYPES.GET_SETTINGS):
    case FAILURE(ACTION_TYPES.CREATE_SETTING):
    case FAILURE(ACTION_TYPES.DELETE_SETTING):
      return {
        ...state,
        loading: false,
        success: false,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_SETTINGS):
      return {
        ...state,
        loading: false,
        settings: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.GET_SETTING): {
      const results = action.payload.data.results;
      const isSettingExist = !!results && results.length > 0;

      return {
        ...state,
        loading: false,
        errorMessage: null,
        isSettingExist: { settingPropertyUrl: action.payload.config.url, value: isSettingExist },
        setting: isSettingExist ? results[0] : state.setting,
        settings: [
          ...state.settings,
          results[0]
        ] 
      };
    }
    case SUCCESS(ACTION_TYPES.CREATE_SETTING):
    case SUCCESS(ACTION_TYPES.DELETE_SETTING):
      return {
        ...state,
        loading: false,
        errorMessage: null,
        success: true
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

export const getSettingByQuery = q => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting?q=${q}&v=full`;
  return {
    type: ACTION_TYPES.GET_SETTING,
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

export const updateSetting = setting => {
  const requestUrl = `/openmrs/ws/rest/v1/systemsetting/${setting.uuid}`;
  return {
    type: ACTION_TYPES.CREATE_SETTING,
    payload: axios.post(requestUrl, setting)
  };
};

export const deleteSetting = setting => ({
  type: ACTION_TYPES.DELETE_SETTING,
  payload: axios.delete(`/openmrs/ws/rest/v1/systemsetting/${setting.uuid}`)
});

export default reducer;
