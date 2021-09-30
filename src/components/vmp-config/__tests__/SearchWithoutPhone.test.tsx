import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';
import { EnableBiometricOnlySearchWithoutPhone } from '../SearchWithoutPhone';

const defaultProps = {
  intl: {
    formatMessage: (message: { id: string }) => message.id
  },
  config: DEFAULT_VMP_CONFIG,
  onValueChange: jest.fn()
};

const props = {
  ...defaultProps,
  config: {
    ...DEFAULT_VMP_CONFIG,
    isBiometricOnlySearchWithoutPhone: false
  }
};

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

describe('EnableBiometricOnlySearchWithoutPhone', () => {
  describe('with default values', () => {
    beforeEach(() => render(<EnableBiometricOnlySearchWithoutPhone {...defaultProps} />));

    it('should render label', () => expect(screen.getByText('vmpConfig.enableBiometricOnlySearchWithoutPhone')).toBeInTheDocument());

    it('should render button with YES label', () => expect(screen.getByText('common.yes')).toBeInTheDocument());

    it('should render button with NO label', () => expect(screen.getByText('common.no')).toBeInTheDocument());

    it('should render button with YES label selected by default', () => expect(screen.getByText('common.yes')).toHaveClass('active'));
  });

  describe('with non default values', () => {
    beforeEach(() => render(<EnableBiometricOnlySearchWithoutPhone {...props} />));

    it('should render label', () => expect(screen.getByText('vmpConfig.enableBiometricOnlySearchWithoutPhone')).toBeInTheDocument());

    it('should render button with YES label', () => expect(screen.getByText('common.yes')).toBeInTheDocument());

    it('should render button with NO label', () => expect(screen.getByText('common.no')).toBeInTheDocument());

    it('should render button with NO label selected by default', () => expect(screen.getByText('common.no')).toHaveClass('active'));
  });
});
