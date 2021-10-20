import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { IDetails } from '../../shared/models/user-account';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import ValidationError from '../common/form/ValidationError';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import cx from 'classnames';
import { EMAIL_FIELD, FAMILY_NAME_FIELD, GIVEN_NAME_FIELD, PHONE_FIELD } from '../../shared/constants/user-account';

const RersonDetails = ({
  intl: { formatMessage },
  onValueChange,
  fields: {
    familyName: { value: familyNameValue, isValid: isFamilyNameValid, error: familyNameError },
    givenName: { value: givenNameValue, isValid: isGivenNameValid, error: givenNameError },
    phone: { value: phoneValue, isValid: isPhoneValid, error: phoneError },
    email: { value: emailValue, isValid: isEmailValid, error: emailError }
  }
}: IDetails) => (
  <>
    <Label className="mb-3">
      <FormattedMessage id="userAccount.personDetails.title" tagName="span" />
    </Label>
    <div className="details">
      <div className="grid-1">
        <InputWithPlaceholder
          placeholder={formatMessage({ id: `userAccount.personDetails.${FAMILY_NAME_FIELD}` })}
          showPlaceholder={!!familyNameValue}
          value={familyNameValue}
          onChange={onValueChange(FAMILY_NAME_FIELD)}
          type="text"
          className={cx({ invalid: !isFamilyNameValid })}
        />
        {!isFamilyNameValid && <ValidationError message={familyNameError} />}
      </div>
      <div className="grid-2">
        <InputWithPlaceholder
          placeholder={formatMessage({ id: `userAccount.personDetails.${GIVEN_NAME_FIELD}` })}
          showPlaceholder={!!givenNameValue}
          value={givenNameValue}
          onChange={onValueChange(GIVEN_NAME_FIELD)}
          type="text"
          className={cx({ invalid: !isGivenNameValid })}
        />
        {!isGivenNameValid && <ValidationError message={givenNameError} />}
      </div>
      <div className="grid-3 input-container">
        <PhoneInput
          placeholder={formatMessage({ id: `userAccount.personDetails.${PHONE_FIELD}` })}
          onChange={onValueChange(PHONE_FIELD)}
          value={phoneValue}
          international
          numberInputProps={{ className: cx('form-control', { invalid: !isPhoneValid }) }}
          type="tel"
        />
        {!!phoneValue && <span className="placeholder">{formatMessage({ id: `userAccount.personDetails.${PHONE_FIELD}` })}</span>}
        {!isPhoneValid && <ValidationError message={phoneError} />}
      </div>
      <div className="grid-4">
        <InputWithPlaceholder
          placeholder={formatMessage({ id: `userAccount.personDetails.${EMAIL_FIELD}` })}
          showPlaceholder={!!emailValue}
          value={emailValue}
          onChange={onValueChange(EMAIL_FIELD)}
          type="text"
          className={cx({ invalid: !isEmailValid })}
        />
        {!isEmailValid && <ValidationError message={emailError} />}
      </div>
    </div>
  </>
);

export default RersonDetails;
