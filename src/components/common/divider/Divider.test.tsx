import React from 'react';
import { render } from '@testing-library/react';
import Divider from './Divider';

test('should render match snapshot', () => {
  const divider = render(<Divider />);
  expect(divider).toMatchSnapshot();
});
