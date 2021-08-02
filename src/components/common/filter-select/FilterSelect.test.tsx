import React from 'react';
import { render } from '@testing-library/react';
import { FilterSelect } from './FilterSelect';

test('should render match snapshot', () => {
  const select = render(
    <FilterSelect intl={{ formatMessage: () => {} }} placeholderId="" value={null} onChange={() => null} wrapperClassName="" options={[]} />
  );
  expect(select).toMatchSnapshot();
});
