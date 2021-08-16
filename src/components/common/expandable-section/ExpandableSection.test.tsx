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
    <ExpandableSection headerComponent={headerComponent} bodyComponent={bodyComponent} isDeletable onDelete={emptyFunction} />
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
