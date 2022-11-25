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
import { IPatientFlagsOverviewState } from '../../shared/models/patient-flags-overview';
import { DEFAULT_PAGE_NUMBER_TO_SEND, DEFAULT_PAGE_SIZE } from '../../shared/constants/patient-flags-overview';
import { ZERO } from '../../shared/constants/input';

export const ACTION_TYPES = {
  GET_PATIENT_FLAGS: 'patientFlagsOverview/GET_PATIENT_FLAGS',
  GET_FLAGGED_PATIENTS: 'patientFlagsOverview/GET_FLAGGED_PATIENTS'
};

const initialState: IPatientFlagsOverviewState = {
  flagsLoading: false,
  flaggedPatientsLoading: false,
  flagsSuccess: false,
  flaggedPatientsSuccess: false,
  flags: [{ name: '', uuid: '', priority: '' }],
  flaggedPatients: {
    flaggedPatients: [{
      patientIdentifier: '',
      patientName: '',
      phoneNumber: '',
      patientStatus: '',
      patientUuid: ''
    }],
    totalCount: ZERO
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PATIENT_FLAGS):
      return {
        ...state,
        flagsLoading: true,
        flagsSuccess: false
      };
    case REQUEST(ACTION_TYPES.GET_FLAGGED_PATIENTS):
      return {
        ...state,
        flaggedPatientsLoading: true,
        flaggedPatientsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_PATIENT_FLAGS):
      return {
        ...state,
        flagsLoading: false,
        flagsSuccess: false,
      };
    case FAILURE(ACTION_TYPES.GET_FLAGGED_PATIENTS):
      return {
        ...state,
        flaggedPatientsLoading: false,
        flaggedPatientsSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.GET_PATIENT_FLAGS):
      return {
        ...state,
        flagsLoading: false,
        flagsSuccess: true,
        flags: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.GET_FLAGGED_PATIENTS):
      return {
        ...state,
        flaggedPatientsLoading: false,
        flaggedPatientsSuccess: true,
        flaggedPatients: action.payload.data
      };
    default:
      return state;
  }
};

export const getPatientFlags = () => ({
  type: ACTION_TYPES.GET_PATIENT_FLAGS,
  payload: axios.get('/openmrs/ws/cfl/flags')
});
export const getFlaggedPatientsOverview = (uuidLocation: string, query?: string, flagName?: string, page: number = DEFAULT_PAGE_NUMBER_TO_SEND, pageSize: number = DEFAULT_PAGE_SIZE) => ({
  type: ACTION_TYPES.GET_FLAGGED_PATIENTS,
  payload: axios.get(`/openmrs/ws/cfl/patientFlags/${uuidLocation}?${query ? `query=${query}&` : ''}${flagName ? `flagName=${flagName}&` : ''}${page ? `pageNumber=${page}&` : ''}${pageSize ? `pageSize=${pageSize}&` : ''}`)
});

export default reducer;
