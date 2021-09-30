import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { Label } from 'reactstrap';
import { HUNDRED, ZERO } from 'src/shared/constants/input';

export function IrisScore({ intl, config, onNumberValueChange }) {
  const { irisScore } = config;
  return (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.irisScore" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.irisScoreTooltip' })}
        />
      </Label>
      <div className="d-inline-block">
        <InputWithPlaceholder
          placeholder={intl.formatMessage({ id: 'vmpConfig.irisScore' })}
          showPlaceholder={irisScore !== null}
          value={irisScore}
          onChange={onNumberValueChange('irisScore', ZERO, HUNDRED)}
          type="number"
          pattern="[1-9]"
          className="iris-score"
          min={ZERO}
          max={HUNDRED}
          data-testid="irisScoreInput"
        />
      </div>
    </>
  );
}
