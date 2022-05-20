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
  SEARCH_PEOPLE: 'cfl-people/SEARCH_PEOPLE',
  RESET_PEOPLE: 'cfl-people/RESET_PEOPLE'
};

const initialState = {
  loading: false,
  people: [],
  errorMessage: '',
  totalCount: 0,
  q: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...state,
        loading: true,
        q: action.meta.q
      };
    case FAILURE(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PEOPLE):
      const people = action.payload.data.results;
      if (action.meta.q === state.q) {
        return {
          ...initialState,
          people,
          totalCount: people.length
        };
      } else {
        return {
          ...state
        };
      }
    case ACTION_TYPES.RESET_PEOPLE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const search = q => {
  const requestUrl = `/openmrs/ws/cfl/people?query=${q || ''}`;
  return {
    type: ACTION_TYPES.SEARCH_PEOPLE,
    payload: axios.get(requestUrl),
    meta: {
      q
    }
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_PEOPLE
});

export default reducer;
