import React from 'react';
import { injectIntl } from 'react-intl';

export interface IValidationErrorProps {
  intl: any;
  hasValue: boolean;
}

function ValidationError(props: IValidationErrorProps) {
  const { intl, hasValue } = props;
  return (
    <span className="error field-error">
      {intl.formatMessage({
        id: hasValue ? `registerPatient.invalid` : `registerPatient.required`
      })}
    </span>
  );
}

export default injectIntl(ValidationError);
