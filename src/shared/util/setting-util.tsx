export const parseJsonSetting = (settingValue, defaultValue = [] as any) => {
  return settingValue ? JSON.parse(settingValue) : defaultValue;
};

export const getSettingValue = (settings, settingName) => {
  const setting = getSetting(settings, settingName);
  return setting && setting.value;
};

export const getSetting = (settings, property) => {
  return settings && settings.find((setting) => setting.property === property);
};
