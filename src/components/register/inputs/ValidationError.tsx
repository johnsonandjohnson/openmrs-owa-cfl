import React from 'react';
import { injectIntl } from 'react-intl';

export interface IValidationErrorProps {
  intl: any;
  hasValue: boolean;
  message?: string;
  field: any;
}

function ValidationError(props: IValidationErrorProps) {
  const { intl, hasValue, message, field } = props;
  return (
    <span className="error field-error">
      {intl.formatMessage({
        id: message || (hasValue ? field.errorMessage || `registerPatient.invalid` : `registerPatient.required`)
      })}
    </span>
  );
}

export default injectIntl(ValidationError);
