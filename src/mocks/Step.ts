/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export const props = {
  intl: {},
  locations: [],
  onPatientChange: jest.fn(),
  patient: {
    givenName: '',
    middleName: '',
    familyName: '',
    preferred: false,
    gender: '',
    unknown: false,
    address1: '',
    address2: '',
    cityVillage: '',
    stateProvince: '',
    country: '',
    postalCode: '',
    personLanguage: '',
    phoneNumber: null,
    locationId: '',
    aadharNumber: null,
    artNumber: null,
    relationship_type: '',
    other_person_uuid: '',
    birthdateYears: null,
    birthdateMonths: null
  },
  patientIdentifierTypes: [],
  searchLocations: jest.fn(),
  stepButtons: jest.fn(),
  stepDefinition: {},
  setStep: jest.fn(),
  regimens: [],
  setValidity: jest.fn(),
  stepNumber: 0,
  onKeyDown: jest.fn()
};
export const fullNameStep = {
  label: 'Name',
  title: 'Patient Demographics',
  subtitle: "What's the patient's name?",
  columns: 3,
  fields: [
    {
      name: 'givenName',
      required: true
    },
    {
      name: 'middleName',
      required: false
    },
    {
      name: 'familyName',
      required: true
    }
  ]
};
export const birthdateStep = {
  label: 'Birthdate',
  title: 'Patient Demographics',
  subtitle: "What's the patient's birth date? (Required)",
  fields: [
    {
      name: 'birthdate',
      required: true,
      type: 'date'
    },
    {
      label: 'Or',
      type: 'separator'
    },
    {
      name: 'birthdateYears',
      required: false,
      type: 'number'
    },
    {
      name: 'birthdateMonths',
      required: false,
      type: 'number'
    }
  ]
};
export const identifiersStep = {
  label: 'Identifiers',
  title: 'Patient Demographics',
  subtitle: 'Identifiers information',
  columns: 2,
  fields: [
    {
      name: 'HIVConfirmatoryLabCode',
      required: false,
      label: 'HIV Confirmatory Lab Code'
    },
    {
      name: 'identifierCode',
      required: true,
      label: 'Unique Identifier Code'
    }
  ]
};
export const identifiersProps = [
  {
    name: 'HIVConfirmatoryLabCode',
    format: '[0-9]{12}$',
    formatDescription: 'HIV Confirmatory Lab Code number should be 12 digits',
    required: false
  },
  {
    name: 'identifierCode',
    format: '[0-9]{12}$',
    formatDescription: 'Identifier Code should be 12 digits',
    required: true
  }
];
export const locationStep = {
  label: 'Patient Location',
  title: 'Patient Demographics',
  subtitle: "What's the patient's location?",
  columns: 1,
  fields: [
    {
      name: 'LocationAttribute',
      label: 'Patient Location',
      required: false,
      type: 'select',
      optionSource: 'locations'
    }
  ]
};
export const locationProps = [
  {
    uuid: '3b7617c9-778f-4f48-83e7-5514eb6ed946',
    display: 'Dopemu Clinic'
  },
  {
    uuid: 'ae3b788e-1d66-46f7-941d-e3a8fb9fd278',
    display: 'Hooglede Clinic'
  },
  {
    uuid: '4ee5702b-69c7-42b9-9a18-5fe14dead8c3',
    display: 'Mumbai Clinic'
  }
];
export const vaccineProps = ['Covid 1D vaccine', 'Covid 2D vaccine', 'Covid 3D vaccine'];
export const vaccinationStep = {
  label: 'Vaccination program',
  title: 'Vaccination program',
  subtitle: 'Patient Vaccination program?',
  fields: [
    {
      name: 'vaccinationProgram',
      label: 'Vaccination program',
      required: false,
      type: 'select',
      optionSource: 'vaccine'
    }
  ]
};
export const genderStep = {
  label: 'Gender',
  title: 'Patient Demographics',
  subtitle: "What's the patient's gender? (Required)",
  fields: [
    {
      name: 'gender',
      required: true,
      type: 'buttons',
      options: [
        {
          label: 'Male',
          value: 'M'
        },
        {
          label: 'Female',
          value: 'F'
        }
      ]
    }
  ]
};
export const addressStep = {
  label: 'Address',
  title: 'Patient Demographics',
  subtitle: "What's the patient's address?",
  columns: 4,
  fields: [
    {
      name: 'address1',
      required: false
    },
    {
      name: 'address2',
      required: false
    },
    {
      name: 'cityVillage',
      required: false
    },
    {
      name: 'stateProvince',
      required: false
    },
    {
      name: 'country',
      required: false
    },
    {
      name: 'postalCode',
      required: false
    }
  ]
};
export const addressProps = {
  address1: 'Marcina Kasprzaka 31',
  address2: '',
  cityVillage: 'Warszawa',
  stateProvince: 'Mazowieckie',
  country: 'Poland',
  postalCode: '01-234'
};
export const phoneNumberStep = {
  label: 'Phone Number',
  title: 'Patient Demographics',
  subtitle: "What's the patient's phone number?",
  fields: [
    {
      name: 'Telephone Number',
      required: false,
      type: 'phone'
    }
  ]
};
