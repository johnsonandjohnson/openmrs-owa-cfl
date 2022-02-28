import IntlShape from './Intl';
import { IDrugProps } from '../components/manage-regimens/Drug';
import { DEFAULT_OPTION_CONFIGURATION } from '../shared/constants/manage-regimens';

const invalidDefaultDrugProps = {
  ...DEFAULT_OPTION_CONFIGURATION,
  isValid: false
};

export const drugProps: IDrugProps = {
  conceptDoseTypes: {
    uuid: '162384AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    display: 'Dose Types',
    setMembers: [
      {
        display: 'Ampule(s)',
        uuid: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      },
      {
        display: 'Application',
        uuid: '162376AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      },
      {
        display: 'Bar',
        uuid: '162351AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      }
    ]
  },
  drug: {
    dose: '2',
    doseUnits: {
      isValid: true,
      label: 'Ampule(s)',
      value: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
    },
    drugDetails: {
      abbreviation: 'ASP',
      isValid: true,
      label: 'Aspirin Test',
      value: '40a9783f-2707-4322-a089-e6bebb7cf9a7'
    },
    frequency: {
      isValid: true,
      label: 'Once daily',
      value: '160862OFAAAAAAAAAAAAAAA'
    }
  },
  drugIdx: 0,
  drugsList: [
    {
      abbreviation: 'ASP',
      concept: {
        display: 'Aspirin',
        uuid: '71617AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      },
      display: 'Aspirin Test',
      uuid: '40a9783f-2707-4322-a089-e6bebb7cf9a7'
    },
    {
      abbreviation: null,
      concept: {
        display: 'Morphine',
        uuid: '80106AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
      },
      display: 'Morphine Test',
      uuid: 'fc4898ab-56b0-4409-800c-546c7cde8c67'
    }
  ],
  editedRegimens: [],
  frequencies: [
    {
      display: 'One time',
      uuid: '162135OFAAAAAAAAAAAAAAA'
    },
    {
      display: 'Every six hours',
      uuid: '162249OFAAAAAAAAAAAAAAA'
    },
    {
      display: 'Once daily',
      uuid: '160862OFAAAAAAAAAAAAAAA'
    }
  ],
  intl: IntlShape,
  regimenIdx: 0,
  regimenUuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9',
  regimens: [
    {
      drugs: [
        {
          dose: '2',
          doseUnits: {
            isValid: true,
            label: 'Ampule(s)',
            value: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
          },
          drugDetails: {
            abbreviation: 'ASP',
            isValid: true,
            label: 'Aspirin Test',
            value: '40a9783f-2707-4322-a089-e6bebb7cf9a7'
          },
          frequency: {
            isValid: true,
            label: 'Once daily',
            value: '160862OFAAAAAAAAAAAAAAA'
          }
        }
      ],
      isValid: true,
      regimenName: 'regimen',
      uuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9'
    }
  ],
  setConfirmationModal: jest.fn(),
  setDrugToDelete: jest.fn(),
  setEditedRegimens: jest.fn(),
  setRegimens: jest.fn()
};

export const invalidEmptyDrugProps = {
  ...drugProps,
  drug: {
    drugDetails: {
      ...invalidDefaultDrugProps,
      abbreviation: ''
    },
    doseUnits: invalidDefaultDrugProps,
    dose: '',
    frequency: invalidDefaultDrugProps
  },
  drugsList: [],
  frequencies: [],
  regimens: [
    {
      drugs: [
        {
          dose: '',
          doseUnits: invalidDefaultDrugProps,
          drugDetails: {
            ...invalidDefaultDrugProps,
            abbreviation: ''
          },
          frequency: invalidDefaultDrugProps
        }
      ],
      isValid: false,
      regimenName: '',
      uuid: ''
    }
  ]
};
