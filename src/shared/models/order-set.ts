/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
