/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import querystring from 'querystring';
import { GENERIC_ERROR_MESSAGE } from '../../shared/constants/error';

export const ACTION_TYPES = {
  REGISTER: 'registration/REGISTER',
  UPDATE_RELATIONSHIPS: 'registration/UPDATE_RELATIONSHIPS',
  UPDATE_PROFILE: 'registration/UPDATE_PROFILE',
  GET_PATIENT_IDENTIFIER_TYPES: 'registration/GET_PATIENT_IDENTIFIER_TYPE'
};

const initialState = {
  loading: false,
  success: false,
  message: null,
  errors: [],
  id: null,
  patientIdentifierTypes: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.REGISTER):
    case REQUEST(ACTION_TYPES.UPDATE_PROFILE):
    case REQUEST(ACTION_TYPES.GET_PATIENT_IDENTIFIER_TYPES):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.REGISTER):
    case FAILURE(ACTION_TYPES.UPDATE_PROFILE):
      const error = action.payload.response.data?.error;
      let message = error?.message;
      message = message?.split('reason: ')[1]?.replace(']', '') || message;
      return {
        ...initialState,
        success: false,
        loading: false,
        errors: !!message ? [message] : [GENERIC_ERROR_MESSAGE]
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
    case SUCCESS(ACTION_TYPES.GET_PATIENT_IDENTIFIER_TYPES):
      return {
        ...state,
        patientIdentifierTypes: action.payload.data.results,
        loading: false
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

export const getPatientIdentifierTypes = () => ({
  type: ACTION_TYPES.GET_PATIENT_IDENTIFIER_TYPES,
  payload: axios.get('/openmrs/ws/rest/v1/patientidentifiertype?v=default')
});

export default reducer;
