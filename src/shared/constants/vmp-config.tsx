import { getData } from 'country-list';

const DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME = 604800000;
const DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT = 43200000;
export const SETTING_KEY = 'biometric.api.config.main';
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
  syncScope: '',
  operatorCredentialsRetentionTime: DEFAULT_OPERATOR_CREDENTIALS_RETENTION_TIME,
  operatorOfflineSessionTimeout: DEFAULT_OPERATOR_OFFLINE_SESSION_TIMEOUT,
  vaccine: [],
  canUseDifferentManufacturers: '',
  manufacturers: [],
  personLanguages: [],
  authSteps: [],
  irisScore: null,
  addressFields: {}
};
export const EMPTY_COUNTRY = { fields: [{}] };
export const COUNTRY_OPTIONS = getData()
  .map(country => country.name)
  .sort()
  .map(countryName => ({ label: countryName, value: countryName }));
