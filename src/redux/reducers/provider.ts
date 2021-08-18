import axios from 'axios';
import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_SMS_PROVIDERS: 'provider/GET_SMS_PROVIDERS',
  GET_CALLFLOWS_PROVIDERS: 'provider/GET_CALLFLOWS_PROVIDERS'
};

const initialState = {
  loading: false,
  smsProviders: [],
  callflowsProviders: [],
  errorMessage: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_SMS_PROVIDERS):
    case REQUEST(ACTION_TYPES.GET_CALLFLOWS_PROVIDERS):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_SMS_PROVIDERS):
    case FAILURE(ACTION_TYPES.GET_CALLFLOWS_PROVIDERS):
      return {
        ...state,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_SMS_PROVIDERS):
      return {
        ...state,
        loading: false,
        smsProviders: !!action.payload.data && !!action.payload.data.configs ? action.payload.data.configs : []
      };
    case SUCCESS(ACTION_TYPES.GET_CALLFLOWS_PROVIDERS):
      return {
        ...state,
        loading: false,
        callflowsProviders: !!action.payload.data ? action.payload.data : []
      };
    default:
      return state;
  }
};

export const getSmsProviders = () => ({
  type: ACTION_TYPES.GET_SMS_PROVIDERS,
  payload: axios.get('/openmrs/ws/sms/configs')
});

export const getCallflowsProviders = () => ({
  type: ACTION_TYPES.GET_CALLFLOWS_PROVIDERS,
  payload: axios.get('/openmrs/ws/callflows/configs')
});

export default reducer;
