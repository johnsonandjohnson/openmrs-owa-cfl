import axios from "axios";

import { FAILURE, REQUEST, SUCCESS } from "../action-type.util";
import querystring from "querystring";

export const ACTION_TYPES = {
  REGISTER: "registration/REGISTER",
};

const initialState = {
  loading: false,
  success: false,
  errors: [],
};

const fieldErrors = (response) => {
  return response.fieldErrors
    ? Object.keys(response.fieldErrors).map(
        (k) => `${k}: ${response.fieldErrors[k]}`
      )
    : [];
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.REGISTER):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.REGISTER):
      const resp = action.payload.response.data;
      return {
        ...initialState,
        errors: (resp.globalErrors || []).concat(fieldErrors(resp)),
      };
    case SUCCESS(ACTION_TYPES.REGISTER):
      return {
        ...initialState,
        success: true,
      };
    default:
      return state;
  }
};

const extractFormData = (patient) => {
  const validRelatives = patient.relatives?.filter(
    (relative) => !!relative.relationshipType && !!relative.otherPerson
  );
  return {
    ...patient,
    relationship_type: validRelatives?.map(
      (relative) => relative.relationshipType
    ),
    other_person_uuid: validRelatives?.map(
      (relative) => relative.otherPerson.value
    ),
    "ART Number": patient.artNumber,
    "Aadhar Number": patient.aadharNumber,
  };
};

// actions
export const register = (patient) => {
  const requestUrl = `/openmrs/registrationapp/registerPatient/submit.action?appId=cfl.registerPatient`;
  const formData = extractFormData(patient);
  return {
    type: ACTION_TYPES.REGISTER,
    payload: axios.post(requestUrl, querystring.stringify(formData)),
  };
};

export default reducer;
