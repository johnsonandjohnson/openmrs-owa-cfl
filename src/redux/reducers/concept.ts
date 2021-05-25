import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  SEARCH_CONCEPTS: 'concept/SEARCH_CONCEPTS',
  RESET_CONCEPTS: 'concept/RESET_CONCEPTS'
};

const initialState = {
  loading: false,
  q: '',
  concepts: [],
  errorMessage: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_CONCEPTS):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_CONCEPTS):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_CONCEPTS):
      return {
        ...initialState,
        q: action.meta.q,
        concepts: action.payload.data.results
      };
    case ACTION_TYPES.RESET_CONCEPTS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const searchConcepts = (q, conceptClasses) => {
  const requestUrl = `/openmrs/ws/rest/v1/conceptsearch?conceptClasses=${conceptClasses}${!!q ? '&q=' + q : ''}`;
  return {
    type: ACTION_TYPES.SEARCH_CONCEPTS,
    payload: axios.get(requestUrl),
    meta: {
      q
    }
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_CONCEPTS
});

export default reducer;
