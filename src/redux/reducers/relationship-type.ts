import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_RELATIONSHIP_TYPES: 'relationshipType/GET_RELATIONSHIP_TYPES',
  RESET_RELATIONSHIP_TYPES: 'relationshipType/RESET_RELATIONSHIP_TYPES'
};

const initialState = {
  loading: false,
  relationshipTypes: [],
  errorMessage: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_RELATIONSHIP_TYPES):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_RELATIONSHIP_TYPES):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_RELATIONSHIP_TYPES):
      return {
        ...initialState,
        relationshipTypes: action.payload.data.results
      };
    case ACTION_TYPES.RESET_RELATIONSHIP_TYPES:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const getRelationshipTypes = () => {
  const requestUrl = `/openmrs/ws/rest/v1/relationshiptype?v=full`;
  return {
    type: ACTION_TYPES.GET_RELATIONSHIP_TYPES,
    payload: axios.get(requestUrl)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_RELATIONSHIP_TYPES
});

export default reducer;
