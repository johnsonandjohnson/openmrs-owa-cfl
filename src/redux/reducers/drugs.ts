import axios from 'axios';
import { AnyAction } from 'redux';
import { REQUEST, SUCCESS } from '../action-type.util';
import { IDrugsState } from '../../shared/models/drugs';

const ACTION_TYPES = {
  GET_DRUGS_LIST: 'drugs/GET_DRUGS_LIST'
};

const initialState: IDrugsState = {
  loading: false,
  drugsList: []
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_DRUGS_LIST):
      return {
        ...state,
        loading: true
      };
    case SUCCESS(ACTION_TYPES.GET_DRUGS_LIST):
      return {
        ...state,
        loading: false,
        drugsList: action.payload.data.results
      };
    default:
      return state;
  }
};

export default reducer;

export const getDrugsList = (custom?: string) => ({
  type: ACTION_TYPES.GET_DRUGS_LIST,
  payload: axios.get(`/openmrs/ws/rest/v1/drug?v=${custom ? `custom:(${custom})` : 'full'}`)
});
