import ISO6391 from 'iso-639-1';

export const VMP_TRANSLATIONS_SETTING_KEY = 'biometric.api.config.localization';
export const LANGUAGES_ALLOWED_SETTING_KEY = 'locale.allowed.list';
export const LANGUAGE_OPTIONS = ISO6391.getAllCodes().map(code => ({ label: ISO6391.getName(code), value: code }));
export const DEFAULT_VMP_TRANSLATIONS_SETTING = { localization: {} };
export const DEFAULT_DOWNLOAD_FILENAME = 'translations.csv';
export const DEFAULT_DELIMITER = ',';
export const ACCEPTED_FILE_EXTENSIONS = '.csv';
