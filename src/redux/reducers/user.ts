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
import { PURGE_TRUE_FLAG } from '../../shared/constants/openmrs';
import { USER, USER_URL, PROVIDER_URL, PASSWORD_URL } from '../../shared/constants/user-account';

export const ACTION_TYPES = {
  GET_USER: 'user/GET_USER',
  GET_USERS: 'user/GET_USERS',
  GET_PROVIDERS: 'user/GET_PROVIDERS',
  POST_USER: 'user/POST_USER',
  POST_PROVIDER: 'user/POST_PROVIDER',
  DELETE_USER: 'user/DELETE_USER',
  DELETE_PROVIDER: 'user/DELETE_PROVIDER'
};

const initialState = {
  loading: false,
  users: [],
  providers: [],
  updatedUser: {},
  currentUser: {},
  errorMessage: '',
  success: {
    createUser: false,
    createProvider: false,
    deleteUser: false,
    deleteProvider: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_USER):
    case REQUEST(ACTION_TYPES.GET_USERS):
    case REQUEST(ACTION_TYPES.GET_PROVIDERS):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_USER):
    case FAILURE(ACTION_TYPES.GET_USERS):
    case FAILURE(ACTION_TYPES.GET_PROVIDERS):
      return {
        ...state,
        errorMessage: action.payload.message,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.GET_USER): {
      const [currentUser] = action.payload.data.results;
      return {
        ...state,
        currentUser,
        loading: false
      };
    }
    case SUCCESS(ACTION_TYPES.GET_USERS):
      return {
        ...state,
        users: action.payload.data.results,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.GET_PROVIDERS):
      return {
        ...state,
        providers: action.payload.data.results,
        loading: false
      };
    case SUCCESS(ACTION_TYPES.DELETE_USER):
      return {
        ...state,
        success: {
          ...state.success,
          deleteUser: true
        }
      };
    case SUCCESS(ACTION_TYPES.DELETE_PROVIDER):
      return {
        ...state,
        success: {
          ...state.success,
          deleteProvider: true
        }
      };
    case SUCCESS(ACTION_TYPES.POST_USER):
      const updatedUser = action.payload.find(res => res?.config?.url?.includes(USER));

      return {
        ...state,
        updatedUser: updatedUser?.data,
        success: {
          ...state.success,
          createUser: true
        }
      };
    case SUCCESS(ACTION_TYPES.POST_PROVIDER):
      return {
        ...state,
        success: {
          ...state.success,
          createProvider: true
        }
      };
    default:
      return state;
  }
};

export const getUsers = () => ({
  type: ACTION_TYPES.GET_USERS,
  payload: axios.get(USER_URL)
});

export const getProviders = (userUuid?: string) => ({
  type: ACTION_TYPES.GET_PROVIDERS,
  payload: axios.get(`${PROVIDER_URL}?v=default${userUuid ? '&user=' + userUuid : ''}`)
});

export const getUserByPersonId = (personId: string) => ({
  type: ACTION_TYPES.GET_USER,
  payload: axios.get(`${USER_URL}?s=byPerson&personId=${personId}&v=full`)
});

export const saveUser = (data: {}, uuid: string, newPassword?: string) => ({
  type: ACTION_TYPES.POST_USER,
  payload: Promise.all([
    axios.post(`${USER_URL}/${uuid ? uuid : ''}`, data),
    newPassword && axios.post(`${PASSWORD_URL}/${uuid}`, { newPassword })
  ])
});

export const saveProvider = (provider: { uuid: string; data: {} }) => ({
  type: ACTION_TYPES.POST_PROVIDER,
  payload: axios.post(`${PROVIDER_URL}/${provider?.uuid ? provider.uuid : ''}`, provider.data)
});

export const deleteUser = (uuid: string) => ({
  type: ACTION_TYPES.DELETE_USER,
  payload: axios.delete(`${USER_URL}/${uuid}?${PURGE_TRUE_FLAG}`)
});

export const deleteProvider = (providerUuid: string) => ({
  type: ACTION_TYPES.DELETE_PROVIDER,
  payload: axios.delete(`${PROVIDER_URL}/${providerUuid}?${PURGE_TRUE_FLAG}`)
});

export default reducer;
