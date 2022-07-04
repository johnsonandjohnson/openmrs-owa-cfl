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
