import { IOption } from './option';

export interface IRegistrationStepField {
  name?: string;
  required?: boolean;
  type?: string;
  label?: string;
  class?: string;
  options?: IOption[] | string[];
}
export interface IRegistrationStep {
  label: string;
  title: string;
  subtitle: string;
  fields: IRegistrationStepField[];
  columns?: number;
}
