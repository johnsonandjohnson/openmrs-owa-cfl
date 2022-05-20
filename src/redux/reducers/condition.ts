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
  GET_CONDITION: 'condition/GET_CONDITION',
  CONDITION_HISTORY: 'condition/CONDITION_HISTORY',
  SAVE_CONDITION: 'condition/SAVE_CONDITION',
  RESET_CONDITION: 'condition/RESET_CONDITION'
};

const initialState = {
  loading: false,
  q: '',
  condition: null,
  conditions: [],
  errorMessage: '',
  conditionUpdated: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_CONDITION):
    case REQUEST(ACTION_TYPES.CONDITION_HISTORY):
    case REQUEST(ACTION_TYPES.SAVE_CONDITION):
      return {
        ...state,
        loading: true,
        conditionUpdated: false
      };
    case FAILURE(ACTION_TYPES.GET_CONDITION):
    case FAILURE(ACTION_TYPES.SAVE_CONDITION):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_CONDITION):
      return {
        ...initialState,
        condition: action.payload.data && action.payload.data[0]
      };
    case SUCCESS(ACTION_TYPES.CONDITION_HISTORY):
      return {
        ...initialState,
        conditions: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.SAVE_CONDITION):
      return {
        ...state,
        loading: false,
        conditionUpdated: true
      };
    case ACTION_TYPES.RESET_CONDITION:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const getCondition = uuid => {
  const requestUrl = `/openmrs/ws/rest/emrapi/condition?conditionUuid=${uuid}`;
  return {
    type: ACTION_TYPES.GET_CONDITION,
    payload: axios.get(requestUrl)
  };
};

export const getConditionHistory = patientId => {
  const requestUrl = `/openmrs/ws/rest/emrapi/conditionhistory?patientUuid=${patientId}`;
  return {
    type: ACTION_TYPES.CONDITION_HISTORY,
    payload: axios.get(requestUrl)
  };
};

export const saveCondition = condition => {
  const requestUrl = `/openmrs/ws/rest/emrapi/condition`;
  return {
    type: ACTION_TYPES.SAVE_CONDITION,
    payload: axios.post(requestUrl, [prepareCondition(condition)])
  };
};

export const saveConditions = conditions => {
  const requestUrl = `/openmrs/ws/rest/emrapi/condition`;
  return {
    type: ACTION_TYPES.SAVE_CONDITION,
    payload: axios.post(
      requestUrl,
      conditions?.map(condition => prepareCondition(condition))
    )
  };
};

const prepareCondition = condition => ({
  ...condition,
  conditionNonCoded: condition.conditionNonCoded || null
});

export const reset = () => ({
  type: ACTION_TYPES.RESET_CONDITION
});

export default reducer;
