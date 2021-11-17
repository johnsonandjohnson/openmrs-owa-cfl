import axios from 'axios';
import { AnyAction } from 'redux';
import { REQUEST, SUCCESS } from '../action-type.util';
import { IOrderFrequencyState } from '../../shared/models/order-frequency';

const ACTION_TYPES = {
  GET_ORDER_FREQUENCIES: 'order-frequency/GET_ORDER_FREQUENCIES'
};

const initialState: IOrderFrequencyState = {
  loading: false,
  frequencies: []
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_ORDER_FREQUENCIES):
      return {
        ...state,
        loading: true
      };
    case SUCCESS(ACTION_TYPES.GET_ORDER_FREQUENCIES):
      return {
        ...state,
        loading: false,
        frequencies: action.payload.data.results
      };
    default:
      return state;
  }
};

export default reducer;

export const getFrequencies = (custom?: string) => ({
  type: ACTION_TYPES.GET_ORDER_FREQUENCIES,
  payload: axios.get(`/openmrs/ws/rest/v1/orderfrequency?v=${custom ? `custom:(${custom})` : 'full'}`)
});
