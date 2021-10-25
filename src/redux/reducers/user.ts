import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_USER: 'user/GET_USER',
  GET_USERS: 'user/GET_USERS',
  POST_USER: 'user/POST_USER',
  DELETE_USER: 'user/DELETE_USER'
};

const initialState = {
  loading: false,
  users: [],
  currentUser: {},
  errorMessage: '',
  success: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_USER):
    case REQUEST(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_USER):
    case FAILURE(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        errorMessage: action.payload.message,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.GET_USER): {
      const [currentUser] = action.payload.data.results;
      return {
        ...state,
        currentUser,
        loading: false
      };
    }
    case SUCCESS(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        users: action.payload.data.results,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.DELETE_USER):
    case SUCCESS(ACTION_TYPES.POST_USER):
      return {
        ...state,
        success: true
      };
    default:
      return state;
  }
};

export const getUsers = () => ({
  type: ACTION_TYPES.GET_USERS,
  payload: axios.get('/openmrs/ws/rest/v1/user')
});

export const getUserByPersonId = (personId: string) => ({
  type: ACTION_TYPES.GET_USER,
  payload: axios.get(`/openmrs/ws/rest/v1/user?s=byPerson&personId=${personId}&v=full`)
});

export const saveUser = (data: {}, uuid: string) => ({
  type: ACTION_TYPES.POST_USER,
  payload: axios.post(`/openmrs/ws/rest/v1/user/${uuid ? uuid : ''}`, data)
});

export const deleteUser = (uuid: string) => ({
  type: ACTION_TYPES.DELETE_USER,
  payload: axios.delete(`/openmrs/ws/rest/v1/user/${uuid}?purge=true`)
});

export default reducer;
