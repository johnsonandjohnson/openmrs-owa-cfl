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
