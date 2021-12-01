export const DRUG_DOSING_UNITS_SETTING_KEY = 'order.drugDosingUnitsConceptUuid';
export const DRUG_ORDER_TYPE_JAVA_CLASS_NAME = 'org.openmrs.DrugOrder';
export const DRUG_ORDER_TEMPLATE_TYPE = 'cfl.drug.order.json';
export const DRUGS = 'drugs';
export const REGIMEN_NAME = 'regimenName';
export const DELETE_REGIMEN_MODAL = 'deleteRegimenModal';
export const DELETE_DRUG_MODAL = 'deleteDrugModal';
export const DOSE = 'dose';
export const DRUG_DETAILS = 'drugDetails';
export const ORDER_TYPE_CUSTOM_V = 'name,uuid,javaClassName';
export const ORDER_SET_CUSTOM_V = 'display,uuid,orderSetMembers';
export const ORDER_FREQUENCY_CUSTOM_V = 'display,uuid';
export const DRUGS_LIST_CUSTOM_V = 'display,uuid,abbreviation,concept';
export const CONCEPT_CUSTOM_V = 'uuid,setMembers';
export const REGIMEN_TO_SAVE_DESCRIPTION = 'Manage regimens with drugs';
export const RETURN_LOCATION = '/openmrs/adminui/metadata/configureMetadata.page';
export const OPERATOR_ALL = 'ALL';
export const FIELD_REQUIRED_ERROR_MESSAGE = 'common.error.required';
export const REGIMEN_NAME_ERROR_MESSAGE = 'manageRegimens.error.regimenNameUnique';
export const CLOSED_MODAL_CONFIGURATION = { open: false, type: DELETE_REGIMEN_MODAL };
export const DEFAULT_OPTION_CONFIGURATION = { label: '', value: '', isValid: true };
export const DEFAULT_DRUG_CONFIGURATION = {
  drugDetails: { ...DEFAULT_OPTION_CONFIGURATION, abbreviation: '' },
  doseUnits: DEFAULT_OPTION_CONFIGURATION,
  dose: '1',
  frequency: DEFAULT_OPTION_CONFIGURATION
};
export const DEFAULT_MANAGE_REGIMEN_CONFIGURATION = {
  regimenName: '',
  uuid: '',
  isValid: true,
  drugs: [DEFAULT_DRUG_CONFIGURATION]
};
export const INITIAL_REGIMEN_VALUE = {
  regimenUuid: '',
  regimenIdx: null
};
export const INITIAL_DRUG_VALUE = {
  ...INITIAL_REGIMEN_VALUE,
  drugUuid: '',
  drugIdx: null
};
