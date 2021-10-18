import React from 'react';
import { render } from '@testing-library/react';
import RadioButtons from './RadioButtons';

test('should render match snapshot', () => {
  const options = [
    { value: 'option1', label: 'option1' },
    { value: 'option2', label: 'option2' }
  ];
  const onChange = jest.fn();
  const input = render(<RadioButtons name="testName" options={options} onChange={onChange} />);
  expect(input).toMatchSnapshot();
});
