import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AddLanguageModal } from './AddLanguageModal';

jest.mock('react-intl', () => ({
  __esModule: true,
  FormattedMessage: (message: { id: string }) => message.id
}));

test('should render match snapshot', () => {
  const modal = render(<AddLanguageModal intl={{ formatMessage: () => {} }} languages={[]} isOpen onYes={() => null} onNo={() => null} />);
  expect(modal).toMatchSnapshot();
});

test('should function onYes be called once with null', () => {
  const mockOnYes = jest.fn(_ => {});
  render(<AddLanguageModal intl={{ formatMessage: () => {} }} languages={[]} isOpen onYes={mockOnYes} onNo={() => null} />);
  const yesButton = screen.getByText('vmpTranslations.addLanguage.add');
  fireEvent.click(yesButton);
  expect(mockOnYes).toBeCalledWith(null);
  expect(mockOnYes).toBeCalledTimes(1);
});

test('should function onNo be called once', () => {
  const mockOnNo = jest.fn(() => {});
  render(<AddLanguageModal intl={{ formatMessage: () => {} }} languages={[]} isOpen onYes={() => null} onNo={mockOnNo} />);
  const noButton = screen.getByText('common.cancel');
  fireEvent.click(noButton);
  expect(mockOnNo).toBeCalledTimes(1);
});
