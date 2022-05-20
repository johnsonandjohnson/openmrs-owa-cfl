/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import IntlShape from '../mocks/Intl';
import { IDetails } from '../shared/models/user-account';

export const defaultProps: IDetails = {
  intl: IntlShape,
  dirtyFields: [],
  roles: [
    {
      display: 'Anonymous',
      uuid: '774b2af3-6437-4e5a-a310-547554c7c65c'
    },
    {
      display: 'Organizational: Doctor',
      uuid: 'f9260ffa-4271-4e80-b798-72c98d00ecc4'
    },
    {
      display: 'System Developer',
      uuid: '8d94f852-c2cc-11de-8d13-0010c6dffd0f'
    }
  ],
  locations: [],
  forcePassword: true,
  isEdit: false,
  userAccount: {
    username: { value: '', isValid: true, error: '' },
    locations: { value: [], isValid: true, error: '' },
    userRole: { value: { label: '', value: '' }, isValid: true, error: '' },
    password: { value: '', isValid: true, error: '' },
    confirmPassword: { value: '', isValid: true, error: '' },
    email: { value: '', isValid: true, error: '' },
    familyName: { value: '', isValid: true, error: '' },
    givenName: { value: '', isValid: true, error: '' },
    phone: { value: '', isValid: true, error: '' }
  },
  onValueChange: jest.fn(),
  setForcePassword: jest.fn()
};

export const userAccountInvalidProps: IDetails = {
  ...defaultProps,
  userAccount: {
    username: { value: 'admin', isValid: false, error: 'common.error.nameUnique' },
    locations: { value: [], isValid: false, error: 'common.error.required' },
    userRole: { value: { label: '', value: '' }, isValid: false, error: 'common.error.required' },
    password: { value: 'test', isValid: false, error: 'common.error.invalidPassword' },
    confirmPassword: { value: 'Test', isValid: false, error: 'common.error.confirmPassword' },
    email: { value: '', isValid: false, error: 'common.error.required' },
    familyName: { value: '', isValid: false, error: 'common.error.required' },
    givenName: { value: '', isValid: false, error: 'common.error.required' },
    phone: { value: '', isValid: false, error: 'common.error.required' }
  }
};

export const defaultEditUserAccountProps: IDetails = {
  ...defaultProps,
  isEdit: true,
  userAccount: {
    username: { value: 'admin', isValid: true, error: '' },
    locations: { value: [{ label: 'Dopemu Clinic', value: '3b7617c9-778f-4f48-83e7-5514eb6ed946' }], isValid: true, error: '' },
    userRole: { value: { label: 'System Developer', value: '8d94f852-c2cc-11de-8d13-0010c6dffd0f' }, isValid: true, error: '' },
    password: { value: 'xxxxxx', isValid: true, error: '' },
    confirmPassword: { value: 'xxxxxx', isValid: true, error: '' },
    email: { value: 'test@test.tt', isValid: true, error: '' },
    familyName: { value: 'Admin', isValid: true, error: '' },
    givenName: { value: 'Test', isValid: true, error: '' },
    phone: { value: '+43234234', isValid: true, error: '' }
  }
};

export const passwordEditUserAccountProps: IDetails = {
  ...defaultProps,
  isEdit: true,
  dirtyFields: ['password', 'confirmPassword'],
  userAccount: {
    ...defaultEditUserAccountProps.userAccount,
    password: { value: 'Test1234', isValid: true, error: '' },
    confirmPassword: { value: 'Test1234', isValid: true, error: '' }
  }
};
