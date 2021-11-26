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
