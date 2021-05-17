import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import querystring from 'querystring';

export const ACTION_TYPES = {
  REGISTER: 'registration/REGISTER',
  UPDATE_RELATIONSHIPS: 'registration/UPDATE_RELATIONSHIPS',
  UPDATE_PROFILE: 'registration/UPDATE_PROFILE'
};

const initialState = {
  loading: false,
  success: false,
  message: null,
  errors: [],
  id: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.REGISTER):
    case REQUEST(ACTION_TYPES.UPDATE_PROFILE):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.REGISTER):
    case FAILURE(ACTION_TYPES.UPDATE_PROFILE):
      const error = action.payload.response.data?.error;
      const message = error?.message;
      return {
        ...initialState,
        success: false,
        errors: !!message ? [message.split('reason: ')[1].replace(']', '')] : []
      };
    case SUCCESS(ACTION_TYPES.REGISTER):
    case SUCCESS(ACTION_TYPES.UPDATE_PROFILE):
      const { data } = action.payload;
      return {
        ...state,
        success: true,
        loading: false,
        id: data
      };
    default: {
      return state;
    }
  }
};

const extractFormData = patient => {
  const validRelatives = patient.relatives?.filter(relative => !!relative.relationshipType && !!relative.otherPerson);
  const relationships = validRelatives?.map(relative => ({
    relationshipType: relative.relationshipType,
    otherPersonUuid: relative.otherPerson.value
  }));
  const formData = {
    ...patient,
    relationships
  };
  if (!formData.birthdate) {
    formData.birthdate = null;
  } else {
    formData.birthdateEstimated = false;
    formData.birthdate = formData.birthdate.toISOString().split('T')[0];
  }
  return formData;
};

// actions
export const register = patient => {
  const requestUrl = `/openmrs/ws/cfl/patientRegistration`;
  const formData = extractFormData(patient);
  return {
    type: ACTION_TYPES.REGISTER,
    payload: axios.post(requestUrl, formData)
  };
};

export const registerPerson = person => {
  const requestUrl = `/openmrs/ws/cfl/caregiverRegistration`;
  const formData = extractFormData(person);
  return {
    type: ACTION_TYPES.REGISTER,
    payload: axios.post(requestUrl, formData)
  };
};

export const editPatient = patient => {
  const requestUrl = `/openmrs/ws/cfl/patientRegistration`;
  const formData = extractFormData(patient);
  return {
    type: ACTION_TYPES.UPDATE_PROFILE,
    payload: axios.put(requestUrl, formData)
  };
};

export const editPerson = person => {
  const requestUrl = `/openmrs/ws/cfl/caregiverRegistration`;
  const formData = extractFormData(person);
  return {
    type: ACTION_TYPES.UPDATE_PROFILE,
    payload: axios.put(requestUrl, formData)
  };
};

export const updateRelationships = person => {
  const requestUrl = `/openmrs/cfl/field/personRelationship/updateRelationships.action`;
  const formData = extractFormData(person);
  return {
    type: ACTION_TYPES.UPDATE_RELATIONSHIPS,
    payload: axios.post(requestUrl, querystring.stringify(formData))
  };
};

export default reducer;
