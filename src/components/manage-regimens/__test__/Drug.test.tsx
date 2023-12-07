/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import flatten from 'flat';
import userEvent from '@testing-library/user-event';
import { drugProps, invalidEmptyDrugProps } from '../../../mocks/Drug';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Drug } from '../Drug';
import '@testing-library/jest-dom';

const messages = flatten({});

describe('<Drug />', () => {
  describe('with the set values', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={messages}>
          <Drug {...drugProps} />
        </IntlProvider>
      );
    });

    it('should render proper drug name', () => {
      expect(screen.getByText(drugProps.drug.drugDetails.label)).toBeInTheDocument();
    });

    it('should render proper drug abbreviation', () => {
      const input = screen.getByTestId('abbreviationInput') as HTMLInputElement;

      expect(input.value).toBe(drugProps.drug.drugDetails.abbreviation);
    });

    it('should render proper dose unit type', () => {
      expect(screen.getByText(drugProps.drug.doseUnits.label)).toBeInTheDocument();
    });

    it('should render proper number of units', () => {
      const input = screen.getByTestId('doseInput') as HTMLInputElement;

      expect(input.value).toBe(drugProps.drug.dose);
    });

    it('should render proper frequency', () => {
      expect(screen.getByText(drugProps.drug.frequency.label)).toBeInTheDocument();
    });

    it('should add new drug row', () => {
      const expectedRegimens = [
        {
          drugs: [
            {
              dose: '2',
              doseUnits: { isValid: true, label: 'Ampule(s)', value: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
              drugDetails: { abbreviation: 'ASP', isValid: true, label: 'Aspirin Test', value: '40a9783f-2707-4322-a089-e6bebb7cf9a7' },
              frequency: { isValid: true, label: 'Once daily', value: '160862OFAAAAAAAAAAAAAAA' }
            },
            {
              dose: '1',
              doseUnits: { isValid: true, label: '', value: '' },
              drugDetails: { abbreviation: '', isValid: true, label: '', value: '' },
              frequency: { isValid: true, label: '', value: '' }
            }
          ],
          isValid: true,
          regimenName: 'regimen',
          uuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9'
        }
      ];
      const addButton = screen.getByTestId('addItem');

      userEvent.click(addButton);

      expect(drugProps.setRegimens).toBeCalledWith(expectedRegimens);
    });

    it('should remove drug', () => {
      const expectedDrugToRemove = { drugIdx: 0, drugUuid: undefined, regimenIdx: 0, regimenUuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9' };
      const expectedConfirmationModal = { open: true, type: 'deleteDrugModal' };
      const addButton = screen.getByTestId('removeItem');

      userEvent.click(addButton);

      expect(drugProps.setDrugToDelete).toBeCalledWith(expectedDrugToRemove);
      expect(drugProps.setConfirmationModal).toBeCalledWith(expectedConfirmationModal);
    });

    it('should render number of units with new value', () => {
      const newUnitValue = '15';
      const expectedRegimens = [
        {
          drugs: [
            {
              dose: '15',
              doseUnits: { isValid: true, label: 'Ampule(s)', value: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
              drugDetails: { abbreviation: 'ASP', isValid: true, label: 'Aspirin Test', value: '40a9783f-2707-4322-a089-e6bebb7cf9a7' },
              frequency: { isValid: true, label: 'Once daily', value: '160862OFAAAAAAAAAAAAAAA' }
            }
          ],
          isValid: true,
          regimenName: 'regimen',
          uuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9'
        }
      ];
      const input = screen.getByTestId('doseInput');

      userEvent.clear(input);
      userEvent.type(input, newUnitValue);

      expect(drugProps.setRegimens).toBeCalledWith(expectedRegimens);
    });

    it('should change drug name and abbreviation', async () => {
      const expectedRegimens = [
        {
          drugs: [
            {
              dose: '2',
              doseUnits: { isValid: true, label: 'Ampule(s)', value: '162335AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
              drugDetails: { abbreviation: '', isValid: true, label: 'Morphine Test', value: 'fc4898ab-56b0-4409-800c-546c7cde8c67' },
              frequency: { isValid: true, label: 'Once daily', value: '160862OFAAAAAAAAAAAAAAA' }
            }
          ],
          isValid: true,
          regimenName: 'regimen',
          uuid: '0a0ef395-ec03-4279-b9cb-0b987cb006d9'
        }
      ];
      const select = screen.getByTestId('drugNameSelect').getElementsByClassName('default-select__control')[0];
      const selectedOption = drugProps.drugsList[1].display;

      userEvent.click(select);
      await screen.findByText(selectedOption);
      userEvent.click(screen.getByText(selectedOption));

      expect(drugProps.setRegimens).toBeCalledWith(expectedRegimens);
    });
  });

  describe('with empty and invalid values', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={messages}>
          <Drug {...invalidEmptyDrugProps} />
        </IntlProvider>
      );
    });

    it('should render invalid number of unit input', () => {
      const input = screen.getByTestId('doseInput') as HTMLInputElement;

      expect(input).toHaveClass('invalid');
    });

    it('should render error field', () => {
      Object.keys(invalidEmptyDrugProps.drug).forEach((_, idx) => expect(screen.getAllByTestId('fieldError')[idx]).toBeInTheDocument());
    });
  });
});
