import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { Input, Label } from 'reactstrap';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import { swapPositions } from '../../shared/util/array-util';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';

export function AuthSteps({ intl, config, options, onValueChange }) {
  const { authSteps } = config;

  const onAuthStepsChange = (i, fieldName, isSelect) => e => {
    authSteps[i][fieldName] = isSelect ? e.value : extractEventValue(e);
    onValueChange('authSteps')(authSteps);
  };

  const removeAuthStep = idx => {
    authSteps.splice(idx, 1);
    if (authSteps.length === 0) {
      addAuthStep();
    }
    onValueChange('authSteps')(authSteps);
  };

  const addAuthStep = () => {
    authSteps.push({ mandatory: false });
    onValueChange('authSteps')(authSteps);
  };

  const moveAuthStep = (idx, offset) => () => {
    swapPositions(authSteps, idx, offset);
    onValueChange('authSteps')(authSteps);
  };

  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.authSteps" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.authStepsTooltip' })}
        />
      </Label>
      {(authSteps || []).map((authStep, i) => (
        <div key={`authStep-${i}`} className="inline-fields">
          <div className="d-flex flex-column order-icons">
            <span
              className={`glyphicon glyphicon-chevron-up ${i === 0 ? 'disabled' : ''}`}
              title={intl.formatMessage({ id: 'vmpConfig.moveUp' })}
              aria-hidden="true"
              onClick={moveAuthStep(i, -1)}
            />
            <span
              className={`glyphicon glyphicon-chevron-down ${i === authSteps.length - 1 ? 'disabled' : ''}`}
              title={intl.formatMessage({ id: 'vmpConfig.moveDown' })}
              aria-hidden="true"
              onClick={moveAuthStep(i, 1)}
            />
          </div>
          <div className="input-container d-flex align-items-center justify-content-center">
            <Label>
              <Input
                checked={authStep.mandatory}
                onClick={() => onAuthStepsChange(i, 'mandatory', false)(!authStep.mandatory)}
                type="checkbox"
              />
              <span>
                <FormattedMessage id="vmpConfig.mandatoryField" />
              </span>
            </Label>
          </div>
          <SelectWithPlaceholder
            placeholder={intl.formatMessage({ id: 'vmpConfig.authStepType' })}
            showPlaceholder={!!authStep.type}
            value={options.find(opt => opt.value === authStep.type) || null}
            onChange={onAuthStepsChange(i, 'type', true)}
            options={options.filter(opt => !authSteps.find(as => as.type === opt.value))}
            wrapperClassName="flex-2"
            classNamePrefix="cfl-select"
            theme={selectDefaultTheme}
          />
          <PlusMinusButtons
            intl={intl}
            onPlusClick={addAuthStep}
            onMinusClick={() => removeAuthStep(i)}
            isPlusButtonVisible={i === authSteps.length - 1}
          />
        </div>
      ))}
    </>
  );
}
