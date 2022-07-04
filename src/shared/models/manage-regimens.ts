/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { FormEvent } from 'react';

export interface IDrugExtendedDetails extends IDrugCommonDetails {
  abbreviation: string;
}
export interface IDrugCommonDetails {
  label: string;
  value: string;
  isValid: boolean;
}
export interface IDrug {
  uuid?: string;
  drugDetails: IDrugExtendedDetails;
  doseUnits: IDrugCommonDetails;
  dose: string;
  frequency: IDrugCommonDetails;
}
export interface IRegimen {
  regimenName: string;
  uuid: string;
  isValid: boolean;
  drugs: IDrug[];
  errorMessage?: string;
}
export interface IManageRegimensState {
  regimens: IRegimen[];
  editedRegimens: string[];
  regimenToDelete: IRegimenToDelete;
  drugToDelete: IDrugToDelete;
  confirmationModal: IConfirmationModal;
}
export interface IRegimenToDelete {
  regimenUuid: string;
  regimenIdx: number;
}
export interface IDrugToDelete extends IRegimenToDelete {
  drugUuid: string;
  drugIdx: number;
}
export interface IConfirmationModal {
  open: boolean;
  type: string;
}
export type OnChangeHandler = (regimenIdx: number, regimenUuid: string, name?: string, drugIdx?: number) => (event: FormEvent) => void;
