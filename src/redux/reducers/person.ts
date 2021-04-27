import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { DEFAULT_PAGE_SIZE } from '../page.util';

export const ACTION_TYPES = {
  SEARCH_PEOPLE: 'person/SEARCH_PEOPLE',
  RESET_PEOPLE: 'person/RESET_PEOPLE'
};

const initialState = {
  loading: false,
  people: [],
  errorMessage: '',
  hasNext: false,
  hasPrev: false,
  currentPage: 0,
  totalCount: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PEOPLE):
      const links = action.payload.data.links;
      return {
        ...initialState,
        people: action.payload.data.results,
        hasNext: links && !!links.find(link => link.rel === 'next'),
        hasPrev: links && !!links.find(link => link.rel === 'prev'),
        totalCount: action.payload.data.totalCount,
        currentPage: action.meta.currentPage
      };
    case ACTION_TYPES.RESET_PEOPLE:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

// actions
export const search = (q, page = 0, limit = DEFAULT_PAGE_SIZE) => {
  const requestUrl = `/openmrs/ws/rest/v1/person?q=${q || ''}&startIndex=${page * limit}&limit=${limit}&v=full&totalCount=true`;
  return {
    type: ACTION_TYPES.SEARCH_PEOPLE,
    payload: axios.get(requestUrl),
    meta: {
      currentPage: page
    }
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_PEOPLE
});

export default reducer;
