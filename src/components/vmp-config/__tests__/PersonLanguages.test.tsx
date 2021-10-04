import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';
import { PersonLanguages } from '../PersonLanguages';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: (message: { id: string }) => message.id },
  config: DEFAULT_VMP_CONFIG,
  onValueChange: jest.fn()
};

describe('<PersonLanguages />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<PersonLanguages {...props} />));

    it('should render title', () => expect(screen.getByTestId('personLanguagesLabel')).toContainHTML('vmpConfig.personLanguages'));
  });
});
