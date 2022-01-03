import React from 'react';
import en from '../../../lang/en.json';
import flatten from 'flat';
import userEvent from '@testing-library/user-event';
import UserAccountDetails from '../UserAccountDetails';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import {
  defaultProps,
  userAccountInvalidProps,
  defaultEditUserAccountProps,
  passwordEditUserAccountProps
} from '../../../mocks/UserAccount';
import '@testing-library/jest-dom';

describe('<UserAccountDetails />', () => {
  describe('when creating a user account with default values', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={flatten(en)}>
          <UserAccountDetails {...defaultProps} />
        </IntlProvider>
      );
    });

    it('should render section title', () => {
      expect(screen.getByText(en.userAccount.userAccountDetails.title)).toBeInTheDocument();
    });

    it('should uncheck force password change checkbox', () => {
      userEvent.click(screen.getByTestId('userAccountDetailsForcePasswordChangeInput'));
      expect(defaultProps.setForcePassword).toBeCalledWith(!defaultProps.forcePassword);
    });
  });

  describe('when creating a user account with invalid information', () => {
    beforeEach(() => {
      render(
        <IntlProvider locale="en" messages={flatten(en)}>
          <UserAccountDetails {...userAccountInvalidProps} />
        </IntlProvider>
      );
    });

    it('should render section title', () => {
      expect(screen.getByText(en.userAccount.userAccountDetails.title)).toBeInTheDocument();
    });

    it('should render an error message about a unique username', () => {
      expect(screen.getByText(en.common.error.nameUnique)).toBeInTheDocument();
    });

    it('should render an invalid password error', () => {
      expect(screen.getByText(en.common.error.invalidPassword)).toBeInTheDocument();
    });

    it('should render an invalid password confirmation error', () => {
      expect(screen.getByText(en.common.error.confirmPassword)).toBeInTheDocument();
    });
  });

  describe('when editig a user account', () => {
    it('should render hidden force password change', () => {
      render(
        <IntlProvider locale="en" messages={flatten(en)}>
          <UserAccountDetails {...defaultEditUserAccountProps} />
        </IntlProvider>
      );

      expect(screen.getByTestId('userAccountDetailsForcePasswordChangeLabel')).toHaveClass('hide');
    });

    it('should render force password change when editing password', () => {
      render(
        <IntlProvider locale="en" messages={flatten(en)}>
          <UserAccountDetails {...passwordEditUserAccountProps} />
        </IntlProvider>
      );

      expect(screen.getByTestId('userAccountDetailsForcePasswordChangeLabel')).not.toHaveClass('hide');
    });
  });
});
