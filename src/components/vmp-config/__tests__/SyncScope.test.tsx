import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SyncScope } from '../SyncScope';
import { DEFAULT_SYNC_SCOPES, DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

const props = {
  intl: { formatMessage: jest.fn() },
  config: DEFAULT_VMP_CONFIG,
  syncScopes: DEFAULT_SYNC_SCOPES,
  onValueChange: jest.fn()
};

describe('<SyncScope />', () => {
  describe('with default values', () => {
    beforeEach(() => render(<SyncScope {...props} />));

    it('should render title', () => expect(screen.getByText('vmpConfig.syncScope')).toBeInTheDocument());

    it('should render appropriate number of buttons', () =>
      props.syncScopes.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument()));

    it('should render active button', () => expect(screen.getByText(props.syncScopes[0].label)).toHaveClass('active'));
  });
});
