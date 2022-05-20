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
import userEvent from '@testing-library/user-event';
import flatten from 'flat';
import en from '../../../../lang/en.json';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import { Select } from '../../inputs/Select';
import { props, vaccinationProgramField } from '../../../../mocks/Select';
import '@testing-library/jest-dom';

describe('<Select />', () => {
  it('should render selected default option for nationality field', () => {
    render(<Select {...props} />);

    const option = screen.getByRole('option', { name: props.field.defaultOption }) as HTMLOptionElement;

    expect(option.selected).toBe(true);
  });

  it('should render invalid field', () => {
    render(
      <IntlProvider locale="en" messages={flatten(en)}>
        <Select {...{ ...props, isInvalid: true, isDirty: true }} />
      </IntlProvider>
    );

    const select = screen.getByTestId(props.field.name) as HTMLSelectElement;

    expect(select).toHaveClass('invalid');
  });

  it('should change selected option', () => {
    render(<Select {...{ ...props, field: vaccinationProgramField }} />);

    const select = screen.getByTestId(vaccinationProgramField.name) as HTMLSelectElement;
    const option = screen.getByRole('option', { name: 'Covid 2D vaccine' }) as HTMLOptionElement;

    expect(option.selected).toBe(false);
    userEvent.selectOptions(select, [screen.getByText('Covid 2D vaccine')]);
    expect(option.selected).toBe(true);
  });
});
