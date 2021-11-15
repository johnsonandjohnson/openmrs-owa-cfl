export interface IOrderSetMemberOrderTypePayload {
  javaClassName: string;
  name: string;
  uuid: string;
}
export interface IOrderSetMemberPayload {
  concept: string;
  orderTemplate: string;
  orderTemplateType: string;
  orderType: IOrderSetMemberOrderTypePayload;
}
export interface IOrderSetMember {
  uuid: string;
  orderTemplate: string;
  retired: boolean;
}
export interface IOrderSet {
  display: string;
  uuid: string;
  orderSetMembers: IOrderSetMember[];
}
export interface IOrderSetPayload {
  description: string;
  name: string;
  operator: string;
  orderSetMembers: IOrderSetMemberPayload[];
}
export interface IOrderSetState {
  loading: boolean;
  orderSet: IOrderSet[];
  success: {
    deletedOrderSet: boolean;
    deletedOrderSetMember: boolean;
    savedOrderSet: boolean;
  };
}
