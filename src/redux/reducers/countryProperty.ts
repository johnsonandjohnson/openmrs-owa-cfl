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
import { ICountryProperty, ICountryPropertyState, ICountryPropertyValue } from '../../shared/models/country-property';

export const ACTION_TYPES = {
  GET_PROPERTIES: 'countryProperty/GET_PROPERTIES',
  CREATE_PROPERTY: 'countryProperty/CREATE_PROPERTY',
  DELETE_PROPERTY: 'countryProperty/DELETE_PROPERTY',
  SET_PROPERTY_VALUES: 'countryProperty/SET_VALUES'
};

const initialState: ICountryPropertyState = {
  loading: false,
  errorMessage: null,
  countryProperties: [],
  success: false,
  isSetValuesSuccessful: false
};

const reducer = (state: ICountryPropertyState = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PROPERTIES):
    case REQUEST(ACTION_TYPES.CREATE_PROPERTY):
    case REQUEST(ACTION_TYPES.DELETE_PROPERTY):
    case REQUEST(ACTION_TYPES.SET_PROPERTY_VALUES):
      return {
        ...state,
        loading: true,
        success: false,
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_PROPERTIES):
    case FAILURE(ACTION_TYPES.CREATE_PROPERTY):
    case FAILURE(ACTION_TYPES.DELETE_PROPERTY):
    case FAILURE(ACTION_TYPES.SET_PROPERTY_VALUES):
      return {
        ...state,
        loading: false,
        success: false,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_PROPERTIES):
      return {
        ...state,
        loading: false,
        errorMessage: null,
        success: true,
        countryProperties: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.CREATE_PROPERTY):
    case SUCCESS(ACTION_TYPES.DELETE_PROPERTY):
      return {
        ...state,
        loading: false,
        errorMessage: null,
        success: true
      };
    case SUCCESS(ACTION_TYPES.SET_PROPERTY_VALUES):
      return {
        ...state,
        loading: false,
        errorMessage: null,
        success: true,
        isSetValuesSuccessful: true
      };
    default:
      return state;
  }
};

export const getCountryProperties = (nameFragment = '') => ({
  type: ACTION_TYPES.GET_PROPERTIES,
  payload: axios.get(`/openmrs/ws/rest/v1/countryProperty?v=default&q=${nameFragment}`)
});

export const createCountryProperty = (name: string, country = '', value = '', description = '') => {
  const requestUrl = `/openmrs/ws/rest/v1/countryProperty`;
  const data = {
    name,
    description
  };
  if (country) {
    data['country'] = country;
  }
  if (value) {
    data['value'] = value;
  }
  return {
    type: ACTION_TYPES.CREATE_PROPERTY,
    payload: axios.post(requestUrl, data)
  };
};

export const updateCountryProperty = (property: ICountryProperty) => ({
  type: ACTION_TYPES.CREATE_PROPERTY,
  payload: axios.post(`/openmrs/ws/rest/v1/countryProperty/${property.uuid}`, property)
});

export const deleteCountryProperty = (property: ICountryProperty) => ({
  type: ACTION_TYPES.DELETE_PROPERTY,
  payload: axios.delete(`/openmrs/ws/rest/v1/countryProperty/${property.uuid}`)
});

export const setCountryPropertyValues = (values: ICountryPropertyValue[]) => ({
  type: ACTION_TYPES.SET_PROPERTY_VALUES,
  payload: axios.post(`/openmrs/ws/messages/countryProperty/setValues`, { values })
});

export default reducer;
