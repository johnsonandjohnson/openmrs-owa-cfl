import axios from 'axios';
import { AnyAction } from 'redux';
import { IOrderSetPayload, IOrderSetState } from '../../shared/models/order-set';
import { REQUEST, SUCCESS } from '../action-type.util';

const ACTION_TYPES = {
  GET_ORDER_SET: 'order-set/GET_ORDER_SET',
  SAVE_ORDER_SET: 'order-set/SAVE_ORDER_SET',
  DELETE_ORDER_SET: 'order-set/DELETE_ORDER_SET',
  DELETE_ORDER_SET_MEMBER: 'order-set/DELETE_ORDER_SET_MEMBER'
};

const initialState: IOrderSetState = {
  loading: false,
  orderSet: [],
  success: {
    deletedOrderSet: false,
    deletedOrderSetMember: false,
    savedOrderSet: false
  }
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_ORDER_SET):
      return {
        ...state,
        loading: true
      };
    case REQUEST(ACTION_TYPES.SAVE_ORDER_SET):
      return {
        ...state,
        success: {
          ...state.success,
          savedOrderSet: false
        }
      };
    case REQUEST(ACTION_TYPES.DELETE_ORDER_SET):
      return {
        ...state,
        success: {
          ...state.success,
          deletedOrderSet: false
        }
      };
    case REQUEST(ACTION_TYPES.DELETE_ORDER_SET_MEMBER):
      return {
        ...state,
        success: {
          ...state.success,
          deletedOrderSetMember: false
        }
      };
    case SUCCESS(ACTION_TYPES.GET_ORDER_SET):
      return {
        ...state,
        loading: false,
        orderSet: action.payload.data.results
      };
    case SUCCESS(ACTION_TYPES.SAVE_ORDER_SET):
      return {
        ...state,
        success: {
          ...state.success,
          savedOrderSet: true
        }
      };
    case SUCCESS(ACTION_TYPES.DELETE_ORDER_SET):
      return {
        ...state,
        success: {
          ...state.success,
          deletedOrderSet: true
        }
      };
    case SUCCESS(ACTION_TYPES.DELETE_ORDER_SET_MEMBER):
      return {
        ...state,
        success: {
          ...state.success,
          deletedOrderSetMember: true
        }
      };
    default:
      return state;
  }
};

export default reducer;

export const getOrderSet = (custom?: string) => ({
  type: ACTION_TYPES.GET_ORDER_SET,
  payload: axios.get(`/openmrs/ws/rest/v1/orderset?v=${custom ? `custom:(${custom})` : 'full'}`)
});

export const deleteOrderSet = (uuid: string) => ({
  type: ACTION_TYPES.DELETE_ORDER_SET,
  payload: axios.delete(`/openmrs/ws/rest/v1/orderset/${uuid}`)
});

export const saveOrderSet = (uuid: string, orderSet: IOrderSetPayload) => ({
  type: ACTION_TYPES.SAVE_ORDER_SET,
  payload: axios.post(`/openmrs/ws/rest/v1/orderset/${uuid && uuid}`, orderSet)
});

export const deleteOrderSetMember = (orderSetUuid: string, orderSetMemberUuid: string) => ({
  type: ACTION_TYPES.DELETE_ORDER_SET_MEMBER,
  payload: axios.delete(`/openmrs/ws/rest/v1/orderset/${orderSetUuid}/ordersetmember/${orderSetMemberUuid}`)
});
