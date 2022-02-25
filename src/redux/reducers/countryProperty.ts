import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { ICountryProperty, ICountryPropertyState, ICountryPropertyValue } from '../../shared/models/country-property';

export const ACTION_TYPES = {
  GET_PROPERTY: 'countryProperty/GET_PROPERTY',
  GET_PROPERTIES: 'countryProperty/GET_PROPERTIES',
  CREATE_PROPERTY: 'countryProperty/CREATE_PROPERTY',
  DELETE_PROPERTY: 'countryProperty/DELETE_PROPERTY',
  SET_PROPERTY_VALUES: 'countryProperty/SET_VALUES'
};

const initialState = {
  loading: false,
  errorMessage: null,
  countryProperty: null,
  countryProperties: [],
  success: false,
  isPropertyExist: { countryPropertyUrl: null, value: false },
  setValuesSuccess: false
} as ICountryPropertyState;

const reducer = (state: ICountryPropertyState = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_PROPERTY):
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
    case FAILURE(ACTION_TYPES.GET_PROPERTY):
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
    case SUCCESS(ACTION_TYPES.GET_PROPERTY):
      const results = action.payload.data.results;
      const isPropertyExist = !!results && results.length > 0;
      return {
        ...state,
        loading: false,
        errorMessage: null,
        success: true,
        isPropertyExist: { countryPropertyUrl: action.payload.config.url, value: isPropertyExist },
        countryProperty: isPropertyExist ? results[0] : state.countryProperty
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
        setValuesSuccess: true
      };
    default:
      return state;
  }
};

export const getCountryProperty = (name: string, countryName = '') => {
  const requestUrl = `/openmrs/ws/rest/v1/countryProperty?v=default&name=${name}&countryName=${countryName}`;
  return {
    type: ACTION_TYPES.GET_PROPERTY,
    payload: axios.get(requestUrl)
  };
};

export const getCountryProperties = (nameFragment = '') => {
  const requestUrl = `/openmrs/ws/rest/v1/countryProperty?v=default&q=${nameFragment}`;
  return {
    type: ACTION_TYPES.GET_PROPERTIES,
    payload: axios.get(requestUrl)
  };
};

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

export const updateCountryProperty = (property: ICountryProperty) => {
  const requestUrl = `/openmrs/ws/rest/v1/countryProperty/${property.uuid}`;
  return {
    type: ACTION_TYPES.CREATE_PROPERTY,
    payload: axios.post(requestUrl, property)
  };
};

export const deleteCountryProperty = (property: ICountryProperty) => ({
  type: ACTION_TYPES.DELETE_PROPERTY,
  payload: axios.delete(`/openmrs/ws/rest/v1/countryProperty/${property.uuid}`)
});

export const setCountryPropertyValues = (values: ICountryPropertyValue[]) => ({
  type: ACTION_TYPES.SET_PROPERTY_VALUES,
  payload: axios.post(`/openmrs/ws/messages/countryProperty/setValues`, { values })
});

export default reducer;
