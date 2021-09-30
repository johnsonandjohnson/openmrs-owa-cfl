import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DEFAULT_VMP_CONFIG } from '../../../shared/constants/vmp-config';
import { AllowManualParticipantIDEntry, ParticipantIDRegex } from '../ParticipantId';

const props = {
  intl: {
    formatMessage: (message: { id: string }) => message.id
  },
  config: {
    ...DEFAULT_VMP_CONFIG,
    allowManualParticipantIDEntry: true
  },
  onValueChange: jest.fn()
};

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

describe('ParticipantIDRegex', () => {
  describe('with valid regex', () => {
    const participantIDRegex = '[0-9]';
    beforeEach(() => render(<ParticipantIDRegex {...props} config={{ ...props.config, participantIDRegex }} />));

    it('should render label', () => expect(screen.getAllByText('vmpConfig.participantIDRegex')[0]).toBeInTheDocument());

    it('should render input', () => expect(screen.getByDisplayValue(participantIDRegex)).toBeInTheDocument());

    it('should render input as valid', () => expect(screen.getByDisplayValue(participantIDRegex)).toHaveClass('id-regex'));
  });

  describe('with invalid regex', () => {
    const participantIDRegex = '[0-9';
    beforeEach(() => render(<ParticipantIDRegex {...props} config={{ ...props.config, participantIDRegex }} />));

    it('should render label', () => expect(screen.getAllByText('vmpConfig.participantIDRegex')[0]).toBeInTheDocument());

    it('should render input', () => expect(screen.getByDisplayValue(participantIDRegex)).toBeInTheDocument());

    it('should render input as invalid', () => expect(screen.getByDisplayValue(participantIDRegex)).toHaveClass('id-regex invalid'));
  });
});

describe('AllowManualParticipantIDEntry', () => {
  beforeEach(() => render(<AllowManualParticipantIDEntry {...props} />));

  it('should render label', () => expect(screen.getByText('vmpConfig.allowManualParticipantIDEntry')).toBeInTheDocument());

  it('should render button with YES label', () => expect(screen.getByText('common.yes')).toBeInTheDocument());

  it('should render button with NO label', () => expect(screen.getByText('common.no')).toBeInTheDocument());

  it('should render button with YES label selected', () => expect(screen.getByText('common.yes')).toHaveClass('active'));
});
