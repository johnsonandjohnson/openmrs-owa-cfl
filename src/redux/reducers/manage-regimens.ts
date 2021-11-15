import { AnyAction } from 'redux';
import { IConfirmationModal, IDrugToDelete, IManageRegimensState, IRegimen, IRegimenToDelete } from '../../shared/models/manage-regimens';
import {
  DEFAULT_DRUG_TO_DELETE,
  DEFAULT_MANAGE_REGIMEN_CONFIGURATION,
  DEFAULT_MODAL_CONFIGURATION,
  DEFAULT_REGIMEN_TO_DELETE
} from '../../shared/constants/manage-regimens';

const ACTION_TYPES = {
  SET_REGIMENS: 'manage-regimens/SET_REGIMENS',
  SET_EDITED_REGIMENS: 'manage-regimens/SET_EDITED_REGIMENS',
  SET_REGIMEN_TO_DELETE: 'manage-regimens/SET_REGIMEN_TO_DELETE',
  SET_DRUG_TO_DELETE: 'manage-regimens/SET_DRUG_TO_DELETE',
  SET_CONFIRMATION_MODAL: 'manage-regimens/SET_CONFIRMATION_MODAL'
};

const initialState: IManageRegimensState = {
  regimens: [DEFAULT_MANAGE_REGIMEN_CONFIGURATION],
  editedRegimens: [],
  regimenToDelete: DEFAULT_REGIMEN_TO_DELETE,
  drugToDelete: DEFAULT_DRUG_TO_DELETE,
  confirmationModal: DEFAULT_MODAL_CONFIGURATION
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_REGIMENS: {
      return {
        ...state,
        regimens: action.data
      };
    }
    case ACTION_TYPES.SET_EDITED_REGIMENS: {
      return {
        ...state,
        editedRegimens: action.data
      };
    }
    case ACTION_TYPES.SET_REGIMEN_TO_DELETE: {
      return {
        ...state,
        regimenToDelete: action.data
      };
    }
    case ACTION_TYPES.SET_DRUG_TO_DELETE: {
      return {
        ...state,
        drugToDelete: action.data
      };
    }
    case ACTION_TYPES.SET_CONFIRMATION_MODAL: {
      return {
        ...state,
        confirmationModal: action.data
      };
    }
    default:
      return state;
  }
};

export default reducer;

export const setRegimens = (regimens: IRegimen[]) => ({
  type: ACTION_TYPES.SET_REGIMENS,
  data: regimens
});

export const setEditedRegimens = (editedRegimens: string) => ({
  type: ACTION_TYPES.SET_EDITED_REGIMENS,
  data: editedRegimens
});

export const setRegimenToDelete = (regimenToDelete: IRegimenToDelete) => ({
  type: ACTION_TYPES.SET_REGIMEN_TO_DELETE,
  data: regimenToDelete
});

export const setDrugToDelete = (drugToDelete: IDrugToDelete) => ({
  type: ACTION_TYPES.SET_DRUG_TO_DELETE,
  data: drugToDelete
});

export const setConfirmationModal = (configuration: IConfirmationModal) => ({
  type: ACTION_TYPES.SET_CONFIRMATION_MODAL,
  data: configuration
});
