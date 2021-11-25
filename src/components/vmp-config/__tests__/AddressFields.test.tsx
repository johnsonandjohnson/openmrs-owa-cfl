import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddressFields } from '../AddressFields';
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';

const defaultProps = {
  intl: { formatMessage: jest.fn() },
  config: DEFAULT_VMP_CONFIG,
  onValueChange: jest.fn()
};
const props = {
  ...defaultProps,
  config: {
    ...DEFAULT_VMP_CONFIG,
    addressFields: [
      {
        countryName: 'India',
        fields: [
          {
            field: 'stateProvince',
            type: 'DROPDOWN',
            name: 'State',
            displayOrder: 1
          },
          {
            field: 'cityVillage',
            type: 'DROPDOWN',
            name: 'City',
            displayOrder: 2
          },
          {
            field: 'postalCode',
            type: 'DROPDOWN',
            name: 'Postal Code',
            displayOrder: 3
          },
          {
            field: 'address1',
            type: 'FREE_INPUT',
            name: 'Street',
            displayOrder: 4
          },
          {
            field: 'address2',
            type: 'FREE_INPUT',
            name: 'Number',
            displayOrder: 5
          }
        ]
      }
    ]
  }
};

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

describe('AddressFields', () => {
  describe('with default values', () => {
    beforeEach(() => render(<AddressFields {...defaultProps} />));

    it('should render  label', () => expect(screen.getByText('vmpConfig.addressFields')).toBeInTheDocument());

    it('should render button for adding new country', () => expect(screen.getByText('vmpConfig.addNewCountry')).toBeInTheDocument());

    it('should not render country section', () => expect(screen.queryByTestId('country')).not.toBeInTheDocument());
  });

  describe('with non default values', () => {
    beforeEach(() => render(<AddressFields {...props} />));

    it('should render button for delete country', () => expect(screen.getByText('vmpConfig.delete')).toBeInTheDocument());

    it('should render country section', () => expect(screen.queryByTestId('country')).toBeInTheDocument());

    it('should render appropriate number of fields', () => {
      const {
        config: { addressFields }
      } = props;
      const [first] = addressFields;

      first.fields.forEach(({ name }) => expect(screen.getByDisplayValue(name)).toBeInTheDocument());
    });

    it('should render appropriate number of remove button', () => {
      const {
        config: { addressFields }
      } = props;
      const [first] = addressFields;

      expect(screen.getAllByTestId('removeItem').length).toEqual(first.fields.length);
    });

    it('should render button add new field', () => expect(screen.getByTestId('addItem')).toBeInTheDocument());

    it('should render disabled up button on first addres field', () => {
      const [firstField] = screen.getAllByTestId('up-button');
      expect(firstField).toHaveClass('disabled');
    });

    it('should render disabled down button on first addres field', () => {
      const [lastField] = screen.getAllByTestId('down-button').slice(-1);
      expect(lastField).toHaveClass('disabled');
    });
  });
});
