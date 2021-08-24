import axios from 'axios';

import { FAILURE, REQUEST, SUCCESS } from '../action-type.util';

export const ACTION_TYPES = {
  GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES: 'messages/GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES'
};

const initialState = {
  loading: false,
  success: false,
  errorMessage: null,
  messagesTemplatesGlobalProperties: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES):
      return {
        ...state,
        loading: true,
        success: false,
        errorMessage: null
      };
    case FAILURE(ACTION_TYPES.GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES):
      return {
        ...state,
        loading: false,
        success: false,
        errorMessage: action.payload.message
      };
    case SUCCESS(ACTION_TYPES.GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES):
      return {
        ...initialState,
        loading: false,
        success: true,
        messagesTemplatesGlobalProperties: action.payload.data
      };
    default:
      return state;
  }
};

export const getMessagesTemplatesGlobalProperties = () => ({
  type: ACTION_TYPES.GET_MESSAGES_TEMPLATES_GLOBAL_PROPERTIES,
  payload: axios.get('/openmrs/ws/messages/templates/globalProperties')
});

export default reducer;
