interface ISetting {
  uuid: string;
  property: string;
  value: string;
  description: string | null;
  display: string;
  datatypeClassname: string | null;
  datatypeConfig: string | null;
  preferredHandlerClassname: string | null;
  handlerConfig: string | null;
}

export interface ISettingsState {
  loading: boolean;
  errorMessage: string;
  settings: ISetting[];
  setting: ISetting;
  success: boolean;
  isSettingExist: {
    settingPropertyUrl: string;
    value: boolean;
  };
}
