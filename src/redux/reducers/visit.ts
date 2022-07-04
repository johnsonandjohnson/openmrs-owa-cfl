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
  GET_VISIT_TYPES: 'visit/GET_VISIT_TYPES'
};

const initialState = {
  visitTypes: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_VISIT_TYPES):
    case FAILURE(ACTION_TYPES.GET_VISIT_TYPES):
      return {
        ...state
      };
    case SUCCESS(ACTION_TYPES.GET_VISIT_TYPES):
      return {
        ...state,
        visitTypes: action.payload.data.results
      };
    default:
      return state;
  }
};

export const getVisitTypes = () => {
  const baseUrl = '/openmrs/ws';
  const restUrl = `${baseUrl}/rest/v1`;
  const visitTypeUrl = `${restUrl}/visittype`;
  return {
    type: ACTION_TYPES.GET_VISIT_TYPES,
    payload: axios.get(visitTypeUrl)
  };
};

export default reducer;
