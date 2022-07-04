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
import { IOrderTypeState } from '../../shared/models/order-type';

const ACTION_TYPES = {
  GET_ORDER_TYPE: 'order-type/GET_ORDER_TYPE'
};

const initialState: IOrderTypeState = {
  loading: false,
  orderTypes: []
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_ORDER_TYPE):
      return {
        ...state,
        loading: true
      };
    case SUCCESS(ACTION_TYPES.GET_ORDER_TYPE):
      return {
        ...state,
        loading: false,
        orderTypes: action.payload.data.results
      };
    default:
      return state;
  }
};

export default reducer;

export const getOrderType = (custom?: string) => ({
  type: ACTION_TYPES.GET_ORDER_TYPE,
  payload: axios.get(`/openmrs/ws/rest/v1/ordertype?v=${custom ? `custom:(${custom})` : 'full'}`)
});
