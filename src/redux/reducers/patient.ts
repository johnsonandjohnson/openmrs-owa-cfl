import axios from "axios";

import { REQUEST, SUCCESS, FAILURE } from "../action-type.util";

export const PATIENT_IDENTIFIER = "patientIdentifier";
export const DISPLAY = "display";
export const GENDER = "gender";
export const AGE = "age";
export const BIRTHDATE = "birthdate";

const FIND_PATIENT_TABLE_COLUMNS =
  process.env.REACT_APP_FIND_PATIENT_TABLE_COLUMNS ||
  `${PATIENT_IDENTIFIER},${DISPLAY},${GENDER},${AGE},${BIRTHDATE}`;
export const TABLE_COLUMNS = FIND_PATIENT_TABLE_COLUMNS.split(",");

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
  const requestUrl = `/openmrs/ws/rest/v1/patient?q=${q || ""}&v=full`;
  return {
    type: ACTION_TYPES.SEARCH_PATIENTS,
    payload: axios.get(requestUrl),
  };
};

export default reducer;
