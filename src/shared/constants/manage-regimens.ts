/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export const DRUG_DOSING_UNITS_SETTING_KEY = 'order.drugDosingUnitsConceptUuid';
export const DRUG_ORDER_TYPE_JAVA_CLASS_NAME = 'org.openmrs.DrugOrder';
export const DRUG_ORDER_TEMPLATE_TYPE = 'cfl.drug.order.json';
export const DRUGS = 'drugs';
export const REGIMEN_NAME = 'regimenName';
export const DELETE_REGIMEN_MODAL = 'deleteRegimenModal';
export const DELETE_DRUG_MODAL = 'deleteDrugModal';
export const DOSE = 'dose';
export const DRUG_DETAILS = 'drugDetails';
export const ORDER_TYPE_CUSTOM_REPRESENTATION = 'name,uuid,javaClassName';
export const ORDER_SET_CUSTOM_REPRESENTATION = 'display,uuid,orderSetMembers';
export const ORDER_FREQUENCY_CUSTOM_REPRESENTATION = 'display,uuid';
export const DRUGS_LIST_CUSTOM_REPRESENTATION = 'display,uuid,abbreviation,concept';
export const CONCEPT_CUSTOM_REPRESENTATION = 'uuid,setMembers';
export const REGIMEN_TO_SAVE_DESCRIPTION = 'Manage regimens with drugs';
export const RETURN_LOCATION = '/openmrs/adminui/metadata/configureMetadata.page';
export const OPERATOR_ALL = 'ALL';
export const FIELD_REQUIRED_ERROR_MESSAGE = 'common.error.required';
export const UNIQUE_REGIMEN_NAME_ERROR_MESSAGE = 'manageRegimens.error.regimenNameUnique';
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
