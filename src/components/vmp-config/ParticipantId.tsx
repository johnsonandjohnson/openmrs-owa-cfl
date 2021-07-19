import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { validateRegex, yesNoOptions } from '../../shared/util/form-util';
import { Buttons } from '../common/form/Buttons';

export function ParticipantIDRegex({ intl, config, onValueChange }) {
  const { participantIDRegex } = config;
  return (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.participantIDRegex" />
      </Label>
      <div className="d-inline-block">
        <InputWithPlaceholder
          placeholder={intl.formatMessage({ id: 'vmpConfig.participantIDRegex' })}
          showPlaceholder={!!participantIDRegex}
          value={participantIDRegex}
          onChange={onValueChange('participantIDRegex')}
          className={validateRegex(participantIDRegex) ? 'id-regex' : 'invalid id-regex'}
        />
      </div>
    </>
  );
}

export function AllowManualParticipantIDEntry({ intl, config, onValueChange }) {
  return (
    <>
      <Label className="mr-4">
        <FormattedMessage id="vmpConfig.allowManualParticipantIDEntry" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.allowManualParticipantIDEntryTooltip' })}
        />
      </Label>
      <Buttons
        options={yesNoOptions(intl)}
        entity={config}
        fieldName="allowManualParticipantIDEntry"
        onChange={onValueChange('allowManualParticipantIDEntry')}
      />
    </>
  );
}
