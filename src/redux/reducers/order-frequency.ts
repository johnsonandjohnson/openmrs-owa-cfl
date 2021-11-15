import axios from 'axios';
import { AnyAction } from 'redux';
import { REQUEST, SUCCESS } from '../action-type.util';
import { IOrderFrequencyState } from '../../shared/models/order-frequency';

const ACTION_TYPES = {
  GET_ORDER_FREQUENCY: 'order-frequency/GET_ORDER_FREQUENCY'
};

const initialState: IOrderFrequencyState = {
  loading: false,
  frequency: []
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_ORDER_FREQUENCY):
      return {
        ...state,
        loading: true
      };
    case SUCCESS(ACTION_TYPES.GET_ORDER_FREQUENCY):
      return {
        ...state,
        loading: false,
        frequency: action.payload.data.results
      };
    default:
      return state;
  }
};

export default reducer;

export const getFrequency = (custom?: string) => ({
  type: ACTION_TYPES.GET_ORDER_FREQUENCY,
  payload: axios.get(`/openmrs/ws/rest/v1/orderfrequency?v=${custom ? `custom:(${custom})` : 'full'}`)
});
