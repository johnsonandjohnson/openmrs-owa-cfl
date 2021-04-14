import axios from "axios";

import { FAILURE, REQUEST, SUCCESS } from "../action-type.util";
import querystring from "querystring";

export const ACTION_TYPES = {
  REGISTER: "registration/REGISTER",
  UPDATE_RELATIONSHIPS: "registration/UPDATE_RELATIONSHIPS",
  EDIT_SECTION: "registration/EDIT_SECTION",
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
    case REQUEST(ACTION_TYPES.EDIT_SECTION):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.REGISTER):
    case FAILURE(ACTION_TYPES.EDIT_SECTION):
      const resp = action.payload.response.data;
      return {
        ...initialState,
        errors: (resp.globalErrors || []).concat(fieldErrors(resp)),
      };
    case SUCCESS(ACTION_TYPES.REGISTER):
    case SUCCESS(ACTION_TYPES.EDIT_SECTION):
      const { data } = action.payload;
      // edit section returns errors both in json and in html responses, despite success response code
      const error = data
        .toString()
        .match(/<p>Validation errors found(.*)<\/p>/)
        ?.pop();
      const isSuccess = !data.stackTrace && !data.fullStackTrace && !error;
      return {
        ...state,
        success: isSuccess,
        errors: isSuccess
          ? state.errors
          : [error || data.message || data.fullStacktrace],
        loading: false,
      };
    default: {
      return state;
    }
  }
};

const extractFormData = (patient) => {
  const validRelatives = patient.relatives?.filter(
    (relative) => !!relative.relationshipType && !!relative.otherPerson
  );
  const formData = {
    ...patient,
    relationship_type: validRelatives?.map(
      (relative) => relative.relationshipType
    ),
    other_person_uuid: validRelatives?.map(
      (relative) => relative.otherPerson.value
    ),
  };
  if (
    !formData.birthdateYear &&
    !formData.birthdateMonth &&
    !formData.birthdateDay
  ) {
    formData.birthdate = null;
  } else {
    formData.birthdateEstimated = false;
    formData.birthdate = [
      formData.birthdateYear,
      formData.birthdateMonth,
      formData.birthdateDay,
    ].join("-");
  }
  return formData;
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

export const editPatient = (patient) => {
  const requestUrl = `/openmrs/registrationapp/editSection.page?patientId=${patient.patientId}&appId=cfl.registerPatient&sectionId=demographics&returnUrl=/`;
  const formData = extractFormData(patient);
  return {
    type: ACTION_TYPES.EDIT_SECTION,
    payload: axios.post(requestUrl, querystring.stringify(formData)),
  };
};

export const updateRelationships = (patient) => {
  const requestUrl = `/openmrs/cfl/field/personRelationship/updateRelationships.action`;
  const formData = extractFormData(patient);
  return {
    type: ACTION_TYPES.UPDATE_RELATIONSHIPS,
    payload: axios.post(requestUrl, querystring.stringify(formData)),
  };
};

export default reducer;
