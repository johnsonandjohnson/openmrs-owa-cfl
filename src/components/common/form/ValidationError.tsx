import React from 'react';
import { injectIntl } from 'react-intl';

export interface IValidationErrorProps {
  intl: any;
  message?: string;
  required?: boolean;
}

function ValidationError(props: IValidationErrorProps) {
  const { intl, message, required } = props;
  return (
    <span className="error field-error">
      {intl.formatMessage({
        id: required ? 'common.error.required' : message
      })}
    </span>
  );
}

export default injectIntl(ValidationError);
