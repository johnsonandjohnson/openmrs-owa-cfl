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
  operatorCredentialsRetentionTime: '',
  operatorOfflineSessionTimeout: '',
  vaccine: [],
  canUseDifferentManufacturers: '',
  manufacturers: [],
  personLanguages: [],
  authSteps: [],
  irisScore: '',
  addressFields: {}
};
