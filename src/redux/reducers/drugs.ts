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
