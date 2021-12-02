import React from 'react';
import en from '../../../lang/en.json';
import flatten from 'flat';
import IntlShape from '../../../mocks/Intl';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AuditInfo, { IAuditInfo } from '../AuditInfo';

const props: IAuditInfo = {
  intl: IntlShape,
  audit: {
    changedBy: {
      display: 'admin'
    },
    creator: {
      display: 'admin'
    },
    dateChanged: '2021-11-30T11:32:06.000+0000',
    dateCreated: '2021-10-30T10:24:34.000+0000'
  }
};

describe('<AuditInfo />', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={flatten(en)}>
        <AuditInfo {...props} />
      </IntlProvider>
    );
  });

  it('should render title', () => {
    expect(screen.getByText(en.userAccount.auditInfo.title)).toBeInTheDocument();
  });

  it('should render information by whom the user account was created', () => {
    expect(screen.getByTestId('userAccountCreatedBy')).toBeInTheDocument();
  });

  it('should render information by whom the user account was changed', () => {
    expect(screen.getByTestId('userAccountChangedBy')).toBeInTheDocument();
  });
});
