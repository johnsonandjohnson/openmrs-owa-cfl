import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import App from '../App';

test('renders', () => {
  render(
    <IntlProvider locale="en">
      <App />
    </IntlProvider>
  );
  const linkElement = screen.getAllByText(/home/i)[0];
  expect(linkElement).toBeInTheDocument();
});
