export interface IOrderType {
  name: string;
  uuid: string;
  javaClassName: string;
}
export interface IOrderTypeState {
  loading: boolean;
  orderType: IOrderType[];
}
