import React from 'react';
import { render, screen } from '@testing-library/react';
import { Step } from '../Step';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import en from '../../../lang/en.json';
import flatten from 'flat';
import {
  props,
  fullNameStep,
  identifiersStep,
  identifiersProps,
  genderStep,
  addressProps,
  addressStep,
  birthdateStep,
  locationProps,
  locationStep,
  vaccinationStep,
  vaccineProps,
  phoneNumberStep
} from '../../../__mocks__/Step.mock';

const messages = flatten(en);
const mockStore = configureMockStore();
const store = mockStore({});

describe('<Step />', () => {
  describe('with default values', () => {
    beforeEach(() =>
      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, stepDefinition: fullNameStep }} />
          </IntlProvider>
        </Provider>
      )
    );

    it('should render step title', () => expect(screen.getByText(fullNameStep.title)).toBeInTheDocument());

    it('should render step subtitle', () => expect(screen.getByText(fullNameStep.subtitle)).toBeInTheDocument());

    it('should render appropriate number of fields', () => {
      const { fields } = fullNameStep;
      fields.forEach(({ name }) => expect(screen.getByTestId(name)).toBeInTheDocument());
    });

    it('should render first name as required field', () => {
      const { fields } = fullNameStep;
      const [first] = fields;
      const input = screen.getByTestId(first.name);

      expect(input).toBeRequired();
    });

    it('should render input with empty name value', () => {
      const { fields } = fullNameStep;
      const [first] = fields;
      const input = screen.getByTestId(first.name) as HTMLInputElement;

      expect(input.value).toBe('');
    });
  });

  describe('with non default values', () => {
    it('should render input first name with proper value', () => {
      const name = 'Jan';
      const { fields } = fullNameStep;
      const [first] = fields;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, patient: { ...props.patient, givenName: name }, stepDefinition: fullNameStep }} />
          </IntlProvider>
        </Provider>
      );

      const input = screen.getByTestId(first.name) as HTMLInputElement;

      expect(input.value).toBe(name);
    });

    it('should render location step', () => {
      const { fields } = locationStep;
      const [first] = fields;
      const { name } = first;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, locations: locationProps, stepDefinition: locationStep }} />
          </IntlProvider>
        </Provider>
      );

      expect(screen.getByTestId(name)).toBeInTheDocument();
    });

    it('should render vaccination step', () => {
      const { fields } = vaccinationStep;
      const [first] = fields;
      const { name } = first;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, vaccine: vaccineProps, stepDefinition: vaccinationStep }} />
          </IntlProvider>
        </Provider>
      );

      expect(screen.getByTestId(name)).toBeInTheDocument();
    });

    it('should render address step', () => {
      const { fields } = addressStep;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, patient: { ...props.patient, ...addressProps }, stepDefinition: addressStep }} />
          </IntlProvider>
        </Provider>
      );

      fields.forEach(({ name }) => {
        const input = screen.getByTestId(name) as HTMLInputElement;

        expect(input.value).toBe(addressProps[name]);
      });
    });

    it('should render identifier step', () => {
      const { fields } = identifiersStep;
      const [first] = fields;
      const { name } = first;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, patientIdentifierTypes: identifiersProps, stepDefinition: identifiersStep }} />
          </IntlProvider>
        </Provider>
      );

      expect(screen.getByTestId(name)).toBeInTheDocument();
    });

    it('should render gender step', () => {
      const { fields } = genderStep;
      const [first] = fields;
      const { options } = first;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, stepDefinition: genderStep }} />
          </IntlProvider>
        </Provider>
      );

      options.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('should render phone number step', () => {
      const { fields } = phoneNumberStep;
      const [first] = fields;
      const { name } = first;

      render(
        <Provider store={store}>
          <IntlProvider locale="en" messages={messages}>
            <Step {...{ ...props, stepDefinition: phoneNumberStep }} />
          </IntlProvider>
        </Provider>
      );

      expect(screen.getByTestId(name)).toBeInTheDocument();
    });

    describe('Birthdate step', () => {
      const estimatedYears = 32;
      const estimatedMonths = 8;

      beforeEach(() =>
        render(
          <Provider store={store}>
            <IntlProvider locale="en" messages={messages}>
              <Step
                {...{
                  ...props,
                  patient: {
                    ...props.patient,
                    birthdateYears: estimatedYears,
                    birthdateMonths: estimatedMonths
                  },
                  stepDefinition: birthdateStep
                }}
              />
            </IntlProvider>
          </Provider>
        )
      );

      it('should render with separator', () => {
        const { fields } = birthdateStep;
        const { label } = fields.find(({ type }) => type === 'separator');

        expect(screen.getByText(label)).toBeInTheDocument();
      });

      it('should render with estimated birthdate years', () => {
        const input = screen.getByTestId('birthdateYears') as HTMLInputElement;

        expect(input.value).toBe(String(estimatedYears));
      });

      it('should render with estimated birthdate months', () => {
        const input = screen.getByTestId('birthdateMonths') as HTMLInputElement;

        expect(input.value).toBe(String(estimatedMonths));
      });
    });
  });
});
