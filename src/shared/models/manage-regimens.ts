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
