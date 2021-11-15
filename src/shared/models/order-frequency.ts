export interface IFrequency {
  display: string;
  uuid: string;
}
export interface IOrderFrequencyState {
  loading: boolean;
  frequency: IFrequency[];
}
