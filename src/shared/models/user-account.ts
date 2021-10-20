import { Dispatch, FormEvent, SetStateAction } from 'react';
import { IntlShape } from 'react-intl';

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IDetailsOption {
  display: string;
  uuid: string;
}

interface IValidationFields {
  isValid: boolean;
  error: string;
}

interface IUserAccountInput extends IValidationFields {
  value: string;
}

interface IUserAccountSelectLocations extends IValidationFields {
  value: ISelectOption[];
}
interface IUserAccountSelectRole extends IValidationFields {
  value: ISelectOption;
}

export interface IUserAccountFields {
  familyName: IUserAccountInput;
  givenName: IUserAccountInput;
  phone: IUserAccountInput;
  email: IUserAccountInput;
  userName: IUserAccountInput;
  locations: IUserAccountSelectLocations;
  userRole: IUserAccountSelectRole;
  password: IUserAccountInput;
  confirmPassword: IUserAccountInput;
}

export interface IDetails {
  intl: IntlShape;
  onValueChange: (name: string) => (e: FormEvent) => void;
  fields: IUserAccountFields;
  dirtyFields?: string[];
  roles?: IDetailsOption[];
  locations?: IDetailsOption[];
  forcePassword?: boolean;
  setForcePassword?: Dispatch<SetStateAction<boolean>>;
}

export interface IAudit {
  dateCreated: string;
  dateChanged: string;
  creator: {
    display: string;
  };
  changedBy: {
    display: string;
  };
}

export interface ICurrentUser {
  username: string;
  allRoles: IDetailsOption[];
  uuid: string;
  auditInfo: IAudit;
  person: {
    uuid: string;
  };
  userProperties: {
    locationUuid: string;
  };
}

export interface IPersonAttribute {
  attributeType: { uuid: string };
  value: string;
}
