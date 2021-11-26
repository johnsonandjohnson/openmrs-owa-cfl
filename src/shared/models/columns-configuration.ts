export interface IColumnConfiguration {
  label: string;
  value: string;
  isValid?: boolean;
}
export interface IColumnsConfigurationState {
  allPossibleColumns: IColumnConfiguration[];
  columnsConfiguration: IColumnConfiguration[];
}
