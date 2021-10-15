import React from 'react';
import { IntlProvider } from 'react-intl';
import { render } from '@testing-library/react';
import { Location, ILocationProps } from './location';

const initialProps: ILocationProps = {
  intl: { formatMessage: (message: { id: string }) => message.id },
  loadingLocationAttributeTypes: false,
  locationAttributeTypes: [],
  locations: [],
  success: false,
  getLocationAttributeTypes: jest.fn(),
  saveLocation: jest.fn(),
  searchLocations: jest.fn(),
  history: null,
  match: null,
  location: null
};

const props: ILocationProps = {
  ...initialProps,
  locationAttributeTypes: [
    {
      datatypeClassname: 'org.openmrs.customdatatype.datatype.FreeTextDatatype',
      datatypeConfig: null,
      description: null,
      display: 'input',
      handlerConfig: null,
      maxOccurs: null,
      minOccurs: 0,
      name: 'input',
      preferredHandlerClassname: null,
      retired: false,
      uuid: 'f654c803-6c9f-4c35-b069-d905f7ecdad2'
    },
    {
      datatypeClassname: 'org.openmrs.customdatatype.datatype.SpecifiedTextOptionsDatatype',
      datatypeConfig: null,
      description: null,
      display: 'dropdown',
      handlerConfig: 'one,two,three',
      maxOccurs: null,
      minOccurs: 0,
      name: 'dropdown',
      preferredHandlerClassname: 'org.openmrs.web.attribute.handler.SpecifiedTextOptionsDropdownHandler',
      retired: false,
      uuid: 'ef54cb39-fa43-412c-816f-a1dbd055f57e'
    },
    {
      datatypeClassname: 'org.openmrs.customdatatype.datatype.LongFreeTextDatatype',
      datatypeConfig: null,
      description: null,
      display: 'textarea',
      handlerConfig: null,
      maxOccurs: null,
      minOccurs: 0,
      name: 'textarea',
      preferredHandlerClassname: 'org.openmrs.web.attribute.handler.LongFreeTextTextareaHandler',
      retired: false,
      uuid: '6a04a106-010d-4459-a7f3-8aa59ee652e0'
    },
    {
      datatypeClassname: 'org.openmrs.customdatatype.datatype.BooleanDatatype',
      datatypeConfig: null,
      description: null,
      display: 'radio-buttons',
      handlerConfig: null,
      maxOccurs: null,
      minOccurs: 0,
      name: 'radio buttons',
      preferredHandlerClassname: 'org.openmrs.web.attribute.handler.BooleanFieldGenDatatypeHandler',
      retired: false,
      uuid: '579e3246-c898-485a-a297-e0b16abdcb4a'
    }
  ],
  locations: [
    {
      display: 'testLocationName'
    }
  ]
};

test('should render with initial props match snapshot', () => {
  const input = render(
    <IntlProvider locale="en">
      <Location {...initialProps} />
    </IntlProvider>
  );
  expect(input).toMatchSnapshot();
});

test('should render with props match snapshot', () => {
  const input = render(
    <IntlProvider locale="en">
      <Location {...props} />
    </IntlProvider>
  );
  expect(input).toMatchSnapshot();
});
