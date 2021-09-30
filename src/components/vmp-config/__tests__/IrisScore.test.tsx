import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IrisScore } from '../IrisScore';
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: (message: { id: string }) => message.id },
  config: DEFAULT_VMP_CONFIG,
  onNumberValueChange: jest.fn()
};

describe('<IrisScore />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<IrisScore {...props} />));

    it('should render title', () => expect(screen.getByText('vmpConfig.irisScore')).toBeInTheDocument());

    it('should render input with empty value', () => {
      const input = screen.getByTestId('irisScoreInput') as HTMLInputElement;

      expect(input.value).toBe('');
    });
  });

  describe('with none default values', () => {
    it('should render input with provided value', () => {
      const irisScoreValue = '40';

      render(
        <IrisScore
          {...props}
          config={{
            ...props.config,
            irisScore: irisScoreValue
          }}
        />
      );

      const input = screen.getByTestId('irisScoreInput') as HTMLInputElement;

      expect(input.value).toBe(irisScoreValue);
    });
  });
});
