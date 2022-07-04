/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import IntlShape from './Intl';

export const props = {
  intl: IntlShape,
  concept: {
    loading: {
      concepts: false,
      concept: false
    },
    query: '',
    concepts: [],
    errorMessage: '',
    concept: {
      uuid: '165657AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      setMembers: [
        {
          uuid: '165660AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          display: 'Belgium'
        },
        {
          uuid: '165670AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          display: 'Poland'
        },
        {
          uuid: '165696AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          display: 'Norway'
        },
        {
          uuid: '165757AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          display: 'Algeria'
        },
        {
          uuid: '165829AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          display: 'Peru'
        }
      ]
    }
  },
  settings: {
    setting: {
      value:
        '{"vaccine":[{"name":"Covid 1D vaccine","manufacturers":["J&J"]},{"name":"Covid 2D vaccine","manufacturers":["Moderna","Moderna"]},{"name":"Covid 3D vaccine","manufacturers":["AstraZenica","J&J","Moderna"]},{"name":"AHAU-95","manufacturers":["Pfizer","Pfizer"]}]}'
    }
  },
  patient: {},
  field: {
    defaultOption: 'Poland',
    label: 'Nationality',
    name: 'Nationality',
    optionSource: 'concept',
    optionUuid: '165657AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    required: true,
    type: 'select'
  },
  isInvalid: false,
  isDirty: false,
  onPatientChange: jest.fn(),
  getConcept: jest.fn(),
  getSettingByQuery: jest.fn(),
  onKeyDown: jest.fn()
};

export const vaccinationProgramField = {
  label: 'Vaccination program',
  name: 'Vaccination program',
  optionKey: 'vaccine',
  optionSource: 'globalProperty',
  optionUuid: 'biometric.api.config.main',
  required: true,
  type: 'select'
};
