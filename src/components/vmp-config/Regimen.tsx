import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { InputWithPlaceholder, SortableSelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import _ from 'lodash';
import ValidationError from '../common/form/ValidationError';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';

const EMPTY_REGIMEN = { name: '', manufacturers: [] };

export function Regimen({
  intl,
  config,
  savedRegimen,
  patientLinkedRegimens,
  showValidationErrors,
  isRegimenNameDuplicated,
  openModal,
  closeModal,
  onValueChange
}) {
  const { vaccine, manufacturers } = config;
  const onVaccineChange = (i, fieldName, isMultiselect) => e => {
    vaccine[i][fieldName] = isMultiselect ? e.map(option => option.label) : extractEventValue(e);
    onValueChange('vaccine')(vaccine);
  };

  const removeRegimen = idx => {
    vaccine.splice(idx, 1);
    if (vaccine.length === 0) {
      addRegimen();
    }
    onValueChange('vaccine')(vaccine);
  };

  const onRegimenRemove = idx => {
    const regimenName = !!vaccine[idx] ? vaccine[idx].name : null;
    const linkedRegimen = !!regimenName ? patientLinkedRegimens.find(regimen => regimen.regimenName === regimenName) : null;
    if (!!linkedRegimen && !!linkedRegimen.anyPatientLinkedWithRegimen) {
      openModal('vmpConfig.error.header', 'vmpConfig.error.regimenLinked');
    } else {
      openModal('vmpConfig.warning.header', 'vmpConfig.warning.deleteRegimen', () => removeRegimen(idx), closeModal);
    }
  };

  const addRegimen = () => {
    vaccine.push(_.clone(EMPTY_REGIMEN));
    onValueChange('vaccine')(vaccine);
  };

  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.regimen" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.regimenTooltip' })}
        />
      </Label>
      {(vaccine || []).map((regimen, i) => {
        const isInvalid = !regimen.name;
        const isDuplicateName = isRegimenNameDuplicated(vaccine, regimen, i);
        return (
          <>
            <div key={`regimen-${i}`} className="inline-fields">
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.regimenName' })}
                showPlaceholder={!!regimen.name}
                value={regimen.name}
                onChange={onVaccineChange(i, 'name', false)}
                wrapperClassName="flex-1"
                readOnly={!!regimen.name && savedRegimen.includes(regimen)}
                className={showValidationErrors && (isInvalid || isDuplicateName) ? 'invalid' : ''}
              />
              <SortableSelectWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.manufacturers' })}
                showPlaceholder={!!regimen.manufacturers && regimen.manufacturers.length}
                // value = index so it's possible to remove an option that was selected multiple times
                value={regimen.manufacturers && regimen.manufacturers.map((mf, idx) => ({ label: mf, value: idx }))}
                onChange={onVaccineChange(i, 'manufacturers', true)}
                options={(manufacturers || []).map(manufacturer => ({
                  label: manufacturer.name,
                  value: manufacturer.name
                }))}
                wrapperClassName="flex-2 default-select-multi"
                className="default-select"
                classNamePrefix="default-select"
                isMulti
                isOptionSelected={() => false}
                theme={selectDefaultTheme}
              />
              <PlusMinusButtons
                intl={intl}
                onPlusClick={addRegimen}
                onMinusClick={() => onRegimenRemove(i)}
                isPlusButtonVisible={i === vaccine.length - 1}
              />
            </div>
            {showValidationErrors &&
              (isInvalid ? (
                <ValidationError message="vmpConfig.error.nameRequired" />
              ) : (
                isDuplicateName && <ValidationError message="vmpConfig.error.nameDuplicate" />
              ))}
          </>
        );
      })}
    </>
  );
}
