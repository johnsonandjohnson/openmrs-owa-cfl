import { IConcept } from './concept';

export interface ICountryProperty {
  uuid: string;
  name: string;
  description: string;
  country: IConcept;
  value: string;
}

export interface ICountryPropertyValue {
  country: String;
  name: String;
  value: String;
}

export interface ICountryPropertyState {
  loading: boolean;
  errorMessage: string;
  countryProperties: ICountryProperty[];
  success: boolean;
  isSetValuesSuccessful: boolean;
}
