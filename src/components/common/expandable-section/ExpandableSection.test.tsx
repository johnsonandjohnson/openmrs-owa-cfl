/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ExpandableSection from './ExpandableSection';
import { Input } from 'reactstrap';

function emptyFunction() {
  return null;
}

test('should render match snapshot', () => {
  const headerComponent = <Input value="test1" onChange={emptyFunction} />;
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(<ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} />);
  expect(container).toMatchSnapshot();
});

test('should deletable render match snapshot', () => {
  const headerComponent = <Input value="test1" onChange={emptyFunction} />;
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(
    <ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} isRemovable onRemove={emptyFunction} />
  );
  expect(container).toMatchSnapshot();
});

test('should be collapsed and match snapshot', () => {
  const headerComponent = <Input value="test1" onChange={emptyFunction} />;
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(<ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} />);
  const header = container.querySelector('.expandable-section-header');
  const body = container.querySelector('.expandable-section-body');
  expect(header).toBeInTheDocument();
  expect(body).not.toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('should expand and match snapshot', () => {
  const headerComponent = <Input value="test1" onChange={emptyFunction} />;
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(<ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} />);
  const expandButton = container.querySelector('.icon-button.btn');
  fireEvent.click(expandButton);
  const header = container.querySelector('.expandable-section-header');
  const body = container.querySelector('.expandable-section-body');
  expect(header).toBeInTheDocument();
  expect(body).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('should collapse and match snapshot', () => {
  const headerComponent = <Input value="test1" onChange={emptyFunction} />;
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(<ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} />);
  const expandButton = container.querySelector('.icon-button.btn');
  fireEvent.click(expandButton);
  fireEvent.click(expandButton);
  const header = container.querySelector('.expandable-section-header');
  const body = container.querySelector('.expandable-section-body');
  expect(header).toBeInTheDocument();
  expect(body).not.toBeInTheDocument();
  expect(container).toMatchSnapshot();
});

test('should switch between disabled header component and header component on expand/collapse', () => {
  const disabledHeaderTextContent = 'disabled test1';
  const bodyComponent = (
    <div>
      <Input value="test2" onChange={emptyFunction} />
      <Input value="test3" onChange={emptyFunction} />
    </div>
  );
  const { container } = render(
    <ExpandableSection
      disabledHeaderComponent={<div>{disabledHeaderTextContent}</div>}
      headerComponent={<Input value="test1" onChange={emptyFunction} />}
      bodyComponent={bodyComponent}
    />
  );
  let body = container.querySelector('.expandable-section-body');
  const disabledHeader = container.querySelector('.expandable-section-header');
  expect(disabledHeader).toBeInTheDocument();
  expect(disabledHeader).toHaveTextContent('disabled test1');
  expect(body).not.toBeInTheDocument();
  const expandButton = container.querySelector('.icon-button.btn');
  fireEvent.click(expandButton);
  body = container.querySelector('.expandable-section-body');
  const header = container.querySelector('.expandable-section-header');
  expect(header).toBeInTheDocument();
  expect(body).toBeInTheDocument();
});
