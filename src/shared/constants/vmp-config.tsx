import { getData } from 'country-list';
import _ from 'lodash';

const DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME = 604800000;
const DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT = 43200000;
export const SETTING_KEY = 'biometric.api.config.main';
export const DEFAULT_REGIMEN_UPDATE_PERMITTED = true;
export const EMPTY_COUNTRY = { fields: [{}] };
export const COUNTRY_OPTIONS = _.sortBy(getData(), 'name').map(({ name }) => ({ label: name, value: name }));
export const ORDERED_ADDRESS_FIELD_PARTS = ['field', 'type', 'name', 'displayOrder'];
export const DEFAULT_SYNC_SCOPES = [
  {
    value: 'country',
    label: 'Country'
  },
  {
    value: 'site',
    label: 'Site'
  }
];
export const DEFAULT_AUTH_STEPS = [
  {
    value: 'id_card',
    label: 'ID Card'
  },
  {
    value: 'phone',
    label: 'Phone'
  },
  {
    value: 'iris_scan',
    label: 'Iris Scan'
  }
];
export const DEFAULT_VMP_CONFIG = {
  syncScope: DEFAULT_SYNC_SCOPES[0].value,
  operatorCredentialsRetentionTime: DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME,
  operatorOfflineSessionTimeout: DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT,
  vaccine: [{}],
  canUseDifferentManufacturers: true,
  allowManualParticipantIDEntry: true,
  manufacturers: [{}],
  personLanguages: [],
  authSteps: [{}],
  irisScore: null,
  addressFields: [],
  participantIDRegex: '',
  isBiometricOnlySearchWithoutPhone: true
};
