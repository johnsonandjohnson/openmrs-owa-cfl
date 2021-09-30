import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { yesNoOptions } from '../../shared/util/form-util';
import { Buttons } from '../common/form/Buttons';

export function EnableBiometricOnlySearchWithoutPhone({ intl, config, onValueChange }) {
  return (
    <>
      <Label className="mr-4">
        <FormattedMessage id="vmpConfig.enableBiometricOnlySearchWithoutPhone" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.enableBiometricOnlySearchWithoutPhoneTooltip' })}
        />
      </Label>
      <Buttons
        options={yesNoOptions(intl)}
        entity={config}
        fieldName="isBiometricOnlySearchWithoutPhone"
        onChange={onValueChange('isBiometricOnlySearchWithoutPhone')}
      />
    </>
  );
}
