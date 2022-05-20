/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { AnyAction } from 'redux';
import { DEFAULT_COLUMNS } from '../../shared/constants/columns-configuration';
import { IColumnConfiguration, IColumnsConfigurationState } from '../../shared/models/columns-configuration';

const ACTION_TYPES = {
  SET_POSSIBLE_COLUMN_LIST: 'columns-configuration/SET_POSSIBLE_COLUMN_LIST',
  SET_COLUMNS_CONFIGURATION: 'columns-configuration/SET_COLUMNS_CONFIGURATION'
};

const initialState: IColumnsConfigurationState = {
  allPossibleColumns: [],
  columnsConfiguration: DEFAULT_COLUMNS
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_POSSIBLE_COLUMN_LIST:
      return {
        ...state,
        allPossibleColumns: action.data
      };
    case ACTION_TYPES.SET_COLUMNS_CONFIGURATION:
      return {
        ...state,
        columnsConfiguration: action.data
      };
    default:
      return state;
  }
};

export default reducer;

export const setAllPossibleColumns = (data: IColumnConfiguration[]) => ({
  type: ACTION_TYPES.SET_POSSIBLE_COLUMN_LIST,
  data
});
export const setColumnsConfiguration = (data: IColumnConfiguration[]) => ({
  type: ACTION_TYPES.SET_COLUMNS_CONFIGURATION,
  data
});
