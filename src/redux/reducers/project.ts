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
    GET_PROJECT_NAMES: 'project/GET_PROJECT_NAMES'
  };

const initialState = {
  loading: false,
  projects: [],
  errorMessage: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case REQUEST(ACTION_TYPES.GET_PROJECT_NAMES):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_PROJECT_NAMES):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_PROJECT_NAMES):
      return {
        ...initialState,
        projects: action.payload.data.results
      };
    case ACTION_TYPES.GET_PROJECT_NAMES:
      return {
        ...initialState
      };
    default:
      return state;
    }
};

export const getProjectNames = () => ({
    type: ACTION_TYPES.GET_PROJECT_NAMES,
    payload: axios.get('/openmrs/ws/rest/v1/project')
});

export default reducer;