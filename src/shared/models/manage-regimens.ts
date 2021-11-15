import { FormEvent } from 'react';

export interface IDrugDetails {
  label: string;
  value: string;
  abbreviation?: string;
  isValid: boolean;
}
export interface IDrug {
  uuid?: string;
  drugDetails: IDrugDetails;
  doseUnits: IDrugDetails;
  dose: string;
  frequency: IDrugDetails;
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
