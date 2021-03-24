import { getDefaultValue, REGISTRATION_SETTINGS } from "../constants/setting";

export const parseJsonSetting = (settingValue, defaultValue = []) => {
  return settingValue ? JSON.parse(settingValue) : defaultValue;
};

export const getSettingOrDefault = (settingsState, settingDefinition) => {
  const setting = getSetting(settingsState.settings, settingDefinition.name);
  return (setting && setting.value) || getDefaultValue(settingDefinition.name);
};

export const getSetting = (settings, property) => {
  return settings.find((setting) => setting.property === property);
};
