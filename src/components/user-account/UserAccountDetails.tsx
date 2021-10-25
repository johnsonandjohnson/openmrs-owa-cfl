import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Input } from 'reactstrap';
import { IDetails, IDetailsOption } from '../../shared/models/user-account';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../shared/util/form-util';
import { SelectWithPlaceholder } from '../../components/common/form/withPlaceholder';
import ValidationError from '../common/form/ValidationError';
import cx from 'classnames';
import 'react-phone-number-input/style.css';
import {
  CONFIRM_PASSWORD_FIELD,
  LOCATION_FIELD,
  PASSWORD_FIELD,
  USERNAME_FIELD,
  USER_ROLE_FIELD
} from '../../shared/constants/user-account';

const UserAccountDetails = ({
  intl: { formatMessage },
  onValueChange,
  dirtyFields,
  roles,
  locations,
  forcePassword,
  setForcePassword,
  userAccount: {
    username: { value: usernameValue, isValid: isUserNameValid, error: userNameError },
    locations: { value: locationsValue, isValid: isLocationsValid, error: locationsError },
    userRole: { value: userRoleValue, isValid: isUserRoleValid, error: userRoleError },
    password: { value: passwordValue, isValid: isPasswordValid, error: passwordError },
    confirmPassword: { value: confirmPasswordValue, isValid: isConfirmPasswordValid, error: confirmPasswordError }
  }
}: IDetails) => {
  const getOptions = (options: IDetailsOption[]) => options.map(option => ({ label: option.display, value: option.uuid }));

  return (
    <>
      <Label className="mb-3">
        <FormattedMessage id="userAccount.userAccountDetails.title" tagName="span" />
      </Label>
      <div className="details">
        <div className="grid-1">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: `userAccount.userAccountDetails.${USERNAME_FIELD}` })}
            showPlaceholder={!!usernameValue}
            value={usernameValue}
            onChange={onValueChange(USERNAME_FIELD)}
            type="text"
            className={cx({ invalid: !isUserNameValid })}
          />
          {!isUserNameValid && <ValidationError message={userNameError} />}
        </div>
        <div className="grid-2">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: `userAccount.userAccountDetails.${LOCATION_FIELD}` })}
            showPlaceholder={!!locationsValue.length}
            value={locationsValue}
            options={getOptions(locations)}
            onChange={onValueChange(LOCATION_FIELD)}
            isMulti
            wrapperClassName={cx({ invalid: !isLocationsValid })}
            classNamePrefix="default-select-multi"
            theme={selectDefaultTheme}
            type="text"
          />
          {!isLocationsValid && <ValidationError message={locationsError} />}
        </div>
        <div className="grid-3">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: `userAccount.userAccountDetails.${USER_ROLE_FIELD}` })}
            showPlaceholder={!!userRoleValue}
            value={userRoleValue}
            options={getOptions(roles)}
            onChange={onValueChange(USER_ROLE_FIELD)}
            wrapperClassName={cx({ invalid: !isUserRoleValid })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
            type="text"
          />
          {!isUserRoleValid && <ValidationError message={userRoleError} />}
        </div>
        <div className="grid-4">
          <InputWithPlaceholder
            className={cx({ invalid: !isPasswordValid })}
            placeholder={formatMessage({ id: `userAccount.userAccountDetails.${PASSWORD_FIELD}` })}
            showPlaceholder={!!passwordValue}
            value={passwordValue}
            onChange={onValueChange(PASSWORD_FIELD)}
            type="password"
            autoComplete="off"
          />
          {!isPasswordValid && <ValidationError message={passwordError} />}
        </div>
        <div className="grid-5">
          <InputWithPlaceholder
            className={cx({ invalid: !isConfirmPasswordValid })}
            placeholder={formatMessage({ id: `userAccount.userAccountDetails.${CONFIRM_PASSWORD_FIELD}` })}
            showPlaceholder={!!confirmPasswordValue}
            value={confirmPasswordValue}
            onChange={onValueChange(CONFIRM_PASSWORD_FIELD)}
            type="password"
            autoComplete="off"
          />
          {!isConfirmPasswordValid && <ValidationError message={confirmPasswordError} />}
        </div>
      </div>
      <Label className={cx('force-password-change', { hide: usernameValue && !dirtyFields.length })}>
        <Input type="checkbox" onClick={() => setForcePassword(!forcePassword)} checked={forcePassword} />
        <FormattedMessage id="userAccount.userAccountDetails.forcePasswordChange" tagName="span" />
      </Label>
    </>
  );
};

export default UserAccountDetails;
