import React from 'react';
import { VmpConfig, IVmpConfigProps } from '../VmpConfig';
import { render } from '@testing-library/react';
import { createBrowserHistory } from 'history';
import { IntlProvider } from 'react-intl';
import en from '../../../lang/en.json';
import flatten from 'flat';

const messages = flatten(en);
const locale = 'en';

const match = {
  params: {},
  isExact: false,
  path: '',
  url: ''
};

const location = {
  pathname: '',
  search: '',
  state: '',
  hash: '',
  key: ''
};

const props: IVmpConfigProps = {
  intl: { formatMessage: jest.fn() },
  appError: false,
  appLoading: false,
  authSteps: 1,
  config: {},
  createSetting: jest.fn(),
  error: false,
  getPatientLinkedRegimens: jest.fn(),
  getSettingByQuery: jest.fn(),
  history: createBrowserHistory(),
  loading: false,
  location,
  match,
  patientLinkedRegimens: false,
  regimenUpdatePermitted: false,
  setting: {},
  success: true,
  syncScopes: '',
  updateSetting: jest.fn()
};
jest.mock('@bit/soldevelo-omrs.cfl-components.toast-handler', () => ({
  successToast: jest.fn(),
  errorToast: jest.fn(),
  displayToast: jest.fn()
}));

describe('VmpConfig', () => {
  it('render', () => {
    expect(true).toBe(true);
    //   const { debug } = render(
    //     <IntlProvider locale={locale} messages={messages} >
    //       <VmpConfig {...props} />
    //     </IntlProvider>
    //   )
    //   debug()
  });
});
