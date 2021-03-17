import axios from "axios";

import { REQUEST, SUCCESS, FAILURE } from "../action-type.util";

export const ACTION_TYPES = {
  GET_SESSION: "session/GET_SESSION",
  RESET_SESSION: "session/RESET_SESSION",
};

const initialState = {
  loading: false,
  errorMessage: null,
  session: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...initialState,
        errorMessage: action.payload.message,
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION):
      return {
        ...initialState,
        session: action.payload.data,
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

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET_SESSION,
  };
};

export default reducer;
