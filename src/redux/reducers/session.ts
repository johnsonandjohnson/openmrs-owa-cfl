import axios from "axios";

import { FAILURE, REQUEST, SUCCESS } from "../action-type.util";

export const ACTION_TYPES = {
  GET_SESSION: "session/GET_SESSION",
  GET_LOGIN_LOCATIONS: "session/GET_LOGIN_LOCATIONS",
  SET_LOGIN_LOCATION: "session/SET_LOGIN_LOCATION",
  RESET_SESSION: "session/RESET_SESSION",
};

const initialState = {
  loading: false,
  errorMessage: null,
  session: null,
  loginLocations: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SESSION):
    case REQUEST(ACTION_TYPES.GET_LOGIN_LOCATIONS):
    case REQUEST(ACTION_TYPES.SET_LOGIN_LOCATION):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...initialState,
        errorMessage: action.payload.message,
      };
    case FAILURE(ACTION_TYPES.GET_LOGIN_LOCATIONS):
    case FAILURE(ACTION_TYPES.SET_LOGIN_LOCATION):
      return {
        ...state,
        errorMessage: action.payload.message,
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION):
      return {
        ...initialState,
        session: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.GET_LOGIN_LOCATIONS):
      return {
        ...state,
        loginLocations: action.payload.data,
        loading: false,
        errorMessage: null,
      };
    case SUCCESS(ACTION_TYPES.SET_LOGIN_LOCATION):
      return {
        ...state,
        loading: false,
        errorMessage: null,
      };
    case ACTION_TYPES.RESET_SESSION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// actions
export const getSession = () => {
  const requestUrl = `/openmrs/ws/rest/v1/appui/session`;
  return {
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get(requestUrl),
  };
};

export const getLoginLocations = () => {
  const requestUrl = `/openmrs/appui/session/getLoginLocations.action`;
  return {
    type: ACTION_TYPES.GET_LOGIN_LOCATIONS,
    payload: axios.get(requestUrl),
  };
};

export const setLoginLocation = (locationId) => {
  const requestUrl = `/openmrs/appui/session/setLocation.action?locationId=${locationId}`;
  return {
    type: ACTION_TYPES.SET_LOGIN_LOCATION,
    payload: axios.post(requestUrl),
  };
};

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET_SESSION,
  };
};

export default reducer;
