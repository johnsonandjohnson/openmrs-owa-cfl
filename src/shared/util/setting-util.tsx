export const getSettingValue = (settings, settingName) => {
  const setting = getSetting(settings, settingName);
  return setting && setting.value;
};

export const getSetting = (settings, property) => settings && settings.find(setting => setting.property === property);
