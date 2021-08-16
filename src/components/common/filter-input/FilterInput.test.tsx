import React from 'react';
import { render } from '@testing-library/react';
import { FilterInput } from './FilterInput';

test('should render match snapshot', () => {
  const input = render(<FilterInput intl={{ formatMessage: () => {} }} placeholderId="" value="" onChange={() => null} />);
  expect(input).toMatchSnapshot();
});
