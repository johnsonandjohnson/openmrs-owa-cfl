import axios from "axios";

import { FAILURE, REQUEST, SUCCESS } from "../action-type.util";

export const ACTION_TYPES = {
  SEARCH_LOCATIONS: "person/SEARCH_LOCATIONS",
  RESET_LOCATIONS: "person/RESET_LOCATIONS",
};

const initialState = {
  loading: false,
  locations: [],
  errorMessage: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...initialState,
        errorMessage: action.payload.message,
      };
    case SUCCESS(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...initialState,
        locations: action.payload.data.results,
      };
    case ACTION_TYPES.RESET_LOCATIONS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// actions
export const search = (q) => {
  const requestUrl = `/openmrs/ws/rest/v1/location${!!q ? "?q=" + q : ""}`;
  return {
    type: ACTION_TYPES.SEARCH_LOCATIONS,
    payload: axios.get(requestUrl),
  };
};

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET_LOCATIONS,
  };
};

export default reducer;
