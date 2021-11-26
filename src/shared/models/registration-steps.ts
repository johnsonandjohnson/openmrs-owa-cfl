export interface IRegistrationStepFieldOption {
  label: string;
  value: string;
}
export interface IRegistrationStepField {
  name?: string;
  required?: boolean;
  type?: string;
  label?: string;
  class?: string;
  options?: IRegistrationStepFieldOption[] | string[];
}
export interface IRegistrationStep {
  label: string;
  title: string;
  subtitle: string;
  fields: IRegistrationStepField[];
  columns?: number;
}
