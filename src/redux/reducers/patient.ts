import axios from "axios";

import { REQUEST, SUCCESS, FAILURE } from "../action-type.util";

export const ACTION_TYPES = {
  SEARCH_PATIENTS: "patient/SEARCH_PATIENTS",
};

const initialState = {
  loading: false,
  patients: [],
  errorMessage: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_PATIENTS):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_PATIENTS):
      return {
        ...initialState,
        errorMessage: action.payload.message,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_PATIENTS):
      return {
        ...initialState,
        patients: action.payload.data.results,
      };
    default:
      return state;
  }
};
// actions
export const search = (q) => {
  const requestUrl = `/openmrs/ws/rest/v1/person?v=full&q=${q}`;
  return {
    type: ACTION_TYPES.SEARCH_PATIENTS,
    payload: axios.get(requestUrl),
  };
};

export default reducer;
