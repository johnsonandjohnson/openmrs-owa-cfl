import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { DEFAULT_PAGE_SIZE } from '../page.util';

export const ACTION_TYPES = {
  SEARCH_PEOPLE: 'patient/SEARCH_PEOPLE',
  RESET_PEOPLE: 'patient/RESET_PEOPLE',
  GET_PERSON: 'patient/GET_PERSON',
  GET_PERSON_RELATIONSHIPS: 'patient/GET_PERSON_RELATIONSHIPS'
};

const initialState = {
  loading: false,
  people: [],
  errorMessage: '',
  hasNext: false,
  hasPrev: false,
  currentPage: 0,
  totalCount: 0,
  person: null,
  personRelationships: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...state,
        loading: true
      };
    case REQUEST(ACTION_TYPES.GET_PERSON_RELATIONSHIPS):
      return {
        ...state,
        personRelationships: null
      };
    case FAILURE(ACTION_TYPES.SEARCH_PEOPLE):
      return {
        ...initialState,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PEOPLE):
      const links = action.payload.data.links;
      const page = action.meta.currentPage || 0;
      const people = action.payload.data.results || [];
      return {
        ...initialState,
        people: page === 0 ? people : [...state.people, ...people],
        hasNext: links && !!links.find(link => link.rel === 'next'),
        hasPrev: links && !!links.find(link => link.rel === 'prev'),
        totalCount: action.payload.data.totalCount,
        currentPage: action.meta.currentPage
      };
    case SUCCESS(ACTION_TYPES.GET_PERSON):
      return {
        ...state,
        person: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_PERSON_RELATIONSHIPS):
      return {
        ...state,
        personRelationships: action.payload.data.results
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

const PERSON_CUSTOM_REPRESENTATION = `personId,gender,age,birthdate,birthdateEstimated,preferredAddress,preferredName,attributes,uuid`;

export const getPerson = id => {
  const requestUrl = `/openmrs/ws/rest/v1/person/${id}?v=custom:(${PERSON_CUSTOM_REPRESENTATION})`;
  return {
    type: ACTION_TYPES.GET_PERSON,
    payload: axios.get(requestUrl)
  };
};

export const getPersonRelationships = id => {
  const requestUrl = `/openmrs/ws/rest/v1/relationship?v=default&person=${id}`;
  return {
    type: ACTION_TYPES.GET_PERSON_RELATIONSHIPS,
    payload: axios.get(requestUrl)
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET_PEOPLE
});

export default reducer;
