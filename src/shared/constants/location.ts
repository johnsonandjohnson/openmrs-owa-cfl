import { ILocation } from '../models/location';

export const REQUIRED_OCCURRENCE = 1;
export const COLUMNS = 2;
export const DROPDOWN_HANDLER_CONFIG_SEPARATOR = ',';
export const BOOLEAN_RADIOS_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.BooleanFieldGenDatatypeHandler';
export const DROPDOWN_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.SpecifiedTextOptionsDropdownHandler';
export const TEXTAREA_PREFERRED_HANDLER = 'org.openmrs.web.attribute.handler.LongFreeTextTextareaHandler';
export const LOCATION_DEFAULT_TAG_LIST_SETTING_KEY = 'cflui.location.defaultTag.uuid.list';
export const DEFAULT_LOCATION: ILocation = {
  name: '',
  description: '',
  address1: '',
  address2: '',
  cityVillage: '',
  stateProvince: '',
  country: '',
  postalCode: '',
  tags: [],
  attributes: []
};
