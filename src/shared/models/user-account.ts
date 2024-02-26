/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { Dispatch, FormEvent, SetStateAction } from 'react';
import { IntlShape } from 'react-intl';
import { IOption } from './option';
export interface IDetailsOption {
  display?: string;
  uuid?: string;
}

interface IValidationField {
  isValid: boolean;
  error: string;
}

interface IUserAccountInput extends IValidationField {
  value: string;
}

interface IUserAccountSelectLocations extends IValidationField {
  value: IOption[];
}
interface IUserAccountSelectRole extends IValidationField {
  value: IOption;
}

export interface IUserAccount {
  familyName: IUserAccountInput;
  givenName: IUserAccountInput;
  phone: IUserAccountInput;
  email: IUserAccountInput;
  username: IUserAccountInput;
  locations: IUserAccountSelectLocations;
  userRole: IUserAccountSelectRole;
  password: IUserAccountInput;
  confirmPassword: IUserAccountInput;
}

export interface IDetails {
  intl: IntlShape;
  onValueChange: (name: string) => (e: FormEvent) => void;
  userAccount: IUserAccount;
  dirtyFields?: string[];
  roles?: IDetailsOption[];
  locations?: IDetailsOption[];
  forcePassword?: boolean;
  isEdit?: boolean;
  setForcePassword?: Dispatch<SetStateAction<boolean>>;
  roleUuidsToHide?: string
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
  roles: IDetailsOption[];
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
