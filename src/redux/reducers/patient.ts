import axios from "axios";

import { REQUEST, SUCCESS, FAILURE } from "../action-type.util";
import { DEFAULT_PAGE_SIZE } from "../page.util";

export const ACTION_TYPES = {
  SEARCH_PATIENTS: "patient/SEARCH_PATIENTS",
  RESET_PATIENTS: "patient/RESET_PATIENTS",
};

const initialState = {
  loading: false,
  patients: [],
  errorMessage: "",
  currentPage: 0,
  totalCount: 0,
  hasNext: false,
  hasPrev: false,
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
      const links = action.payload.data.links;
      return {
        ...initialState,
        patients: action.payload.data.results,
        hasNext: links && !!links.find((link) => link.rel === "next"),
        hasPrev: links && !!links.find((link) => link.rel === "prev"),
        totalCount: action.payload.data.totalCount,
        currentPage: action.meta.currentPage,
      };
    case ACTION_TYPES.RESET_PATIENTS:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// actions
export const search = (q, page = 0, limit = DEFAULT_PAGE_SIZE) => {
  const requestUrl = `/openmrs/ws/rest/v1/patient?q=${q || ""}&startIndex=${
    page * limit
  }&limit=${limit}&v=full&totalCount=true`;
  return {
    type: ACTION_TYPES.SEARCH_PATIENTS,
    payload: axios.get(requestUrl),
    meta: {
      currentPage: page,
    },
  };
};

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET_PATIENTS,
  };
};

export default reducer;
