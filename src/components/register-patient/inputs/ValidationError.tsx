import React from 'react';
import { injectIntl } from 'react-intl';

export interface IValidationErrorProps {
  intl: any;
  hasValue: boolean;
  message?: string;
}

function ValidationError(props: IValidationErrorProps) {
  const { intl, hasValue, message } = props;
  return (
    <span className="error field-error">
      {intl.formatMessage({
        id: message || (hasValue ? `registerPatient.invalid` : `registerPatient.required`)
      })}
    </span>
  );
}

export default injectIntl(ValidationError);
