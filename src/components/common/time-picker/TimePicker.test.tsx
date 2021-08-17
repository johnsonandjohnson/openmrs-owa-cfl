import React from 'react';
import { render } from '@testing-library/react';
import { TimePicker } from './TimePicker';
import moment from 'moment';
import { DEFAULT_TIME_FORMAT } from '../../../shared/constants/input';

test('should render match snapshot', () => {
  const value = moment('10:00', DEFAULT_TIME_FORMAT);
  const input = render(<TimePicker value={value} onChange={() => null} />);
  expect(input).toMatchSnapshot();
});
