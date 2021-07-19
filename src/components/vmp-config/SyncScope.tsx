import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { Buttons } from '../common/form/Buttons';

export function SyncScope({ intl, config, syncScopes, onValueChange }) {
  return (
    <>
      <Label className="mr-5 mb-0">
        <FormattedMessage id="vmpConfig.syncScope" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.syncScopeTooltip' })}
        />
      </Label>
      <Buttons options={syncScopes} entity={config} fieldName="syncScope" onChange={onValueChange('syncScope')} />
    </>
  );
}
