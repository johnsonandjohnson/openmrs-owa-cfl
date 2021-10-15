import axios from 'axios';
import { ILocation, ILocationAttributeType, ILocationListItem } from '../../shared/models/location';
import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';
import { AnyAction } from 'redux';

export const ACTION_TYPES = {
  SEARCH_LOCATIONS: 'location/SEARCH_LOCATIONS',
  GET_LOCATION_ATTRIBUTE_TYPES: 'location/GET_LOCATION_ATTRIBUTE_TYPES',
  POST_LOCATION: 'location/POST_LOCATION'
};

export interface ILocationState {
  loadingLocations: boolean;
  locations: Array<ILocationListItem>;
  errorMessage: string;
  locationAttributeTypes: Array<ILocationAttributeType>;
  loadingLocationAttributeTypes: boolean;
  success: boolean;
}

const initialState: ILocationState = {
  loadingLocations: false,
  locations: [],
  errorMessage: '',
  locationAttributeTypes: [],
  loadingLocationAttributeTypes: false,
  success: false
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...state,
        loadingLocations: true
      };
    case REQUEST(ACTION_TYPES.GET_LOCATION_ATTRIBUTE_TYPES):
      return {
        ...state,
        loadingLocationAttributeTypes: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...state,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.SEARCH_LOCATIONS):
      return {
        ...state,
        loadingLocations: false,
        locations: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.GET_LOCATION_ATTRIBUTE_TYPES):
      return {
        ...state,
        loadingLocationAttributeTypes: false,
        locationAttributeTypes: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.POST_LOCATION):
      return {
        ...state,
        success: true
      };
    default:
      return state;
  }
};

// actions
export const searchLocations = (q?: string) => {
  const requestUrl = `/openmrs/ws/rest/v1/location${!!q ? '?q=' + q : ''}`;
  return {
    type: ACTION_TYPES.SEARCH_LOCATIONS,
    payload: axios.get(requestUrl)
  };
};

export const getLocationAttributeTypes = () => ({
  type: ACTION_TYPES.GET_LOCATION_ATTRIBUTE_TYPES,
  payload: axios.get('/openmrs/ws/rest/v1/locationattributetype?v=full')
});

export const saveLocation = (location: ILocation) => ({
  type: ACTION_TYPES.POST_LOCATION,
  payload: axios.post('/openmrs/ws/rest/v1/location', location)
});

export default reducer;
