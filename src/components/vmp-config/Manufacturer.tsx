import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { Buttons } from '../common/form/Buttons';
import { extractEventValue, validateRegex, yesNoOptions } from '../../shared/util/form-util';
import _ from 'lodash';
import ValidationError from '../common/form/ValidationError';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';

const EMPTY_MANUFACTURER = { name: '', barcodeRegex: '' };

export function CanUseDifferentManufacturers({ intl, config, onValueChange }) {
  return (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.canUseDifferentManufacturers" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.canUseDifferentManufacturersTooltip' })}
        />
      </Label>
      <Buttons
        options={yesNoOptions(intl)}
        entity={config}
        fieldName="canUseDifferentManufacturers"
        onChange={onValueChange('canUseDifferentManufacturers')}
      />
    </>
  );
}

export function Manufacturers({ intl, config, showValidationErrors, openModal, closeModal, onValueChange }) {
  const manufacturers = config.manufacturers || [];
  const vaccine = config.vaccine || [];

  const removeManufacturer = idx => {
    const manufacturerName = manufacturers[idx].name;
    manufacturers.splice(idx, 1);
    if (manufacturers.length === 0) {
      addManufacturer();
    }
    onValueChange('manufacturers')(manufacturers);
    // remove manufacturer from regimen
    vaccine.forEach(v => {
      if (!!v.manufacturers) {
        v.manufacturers = v.manufacturers.filter(mf => mf !== manufacturerName);
      }
    });
    onValueChange('vaccine')(vaccine);
  };

  const onManufacturerRemove = idx => {
    const manufacturerName = manufacturers[idx].name;
    if (vaccine.some(regimen => !!regimen.manufacturers && regimen.manufacturers.includes(manufacturerName))) {
      openModal('vmpConfig.error.header', 'vmpConfig.error.manufacturerAssigned');
    } else {
      openModal('vmpConfig.warning.header', 'vmpConfig.warning.deleteManufacturer', () => removeManufacturer(idx), closeModal);
    }
  };

  const addManufacturer = () => {
    manufacturers.push(_.clone(EMPTY_MANUFACTURER));
    onValueChange('manufacturers')(manufacturers);
  };

  const onManufacturerChange = (i, fieldName) => e => {
    const value = extractEventValue(e);
    if (fieldName === 'name') {
      // update regimen's manufacturers when the name has changed
      const name = manufacturers[i].name;
      vaccine.forEach(v => {
        if (!!v.manufacturers && !!v.manufacturers.length) {
          v.manufacturers = v.manufacturers.map(mf => (mf === name ? value : mf));
        }
      });
      onValueChange('vaccine')(vaccine);
    }
    manufacturers[i][fieldName] = value;
    onValueChange('manufacturers')(manufacturers);
  };

  return (
    <>
      <Label>
        <FormattedMessage id="vmpConfig.manufacturers" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.manufacturersTooltip' })}
        />
      </Label>
      {(manufacturers || []).map((manufacturer, i) => {
        const isInvalid = !manufacturer.name;
        return (
          <>
            <div key={`manufacturers-${i}`} className="inline-fields">
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.manufacturersName' })}
                showPlaceholder={!!manufacturer.name}
                value={manufacturer.name}
                onChange={onManufacturerChange(i, 'name')}
                wrapperClassName="flex-1"
                className={showValidationErrors && isInvalid ? 'invalid' : ''}
              />
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.barcodeRegex' })}
                showPlaceholder={!!manufacturer.barcodeRegex}
                value={manufacturer.barcodeRegex}
                onChange={onManufacturerChange(i, 'barcodeRegex')}
                wrapperClassName="flex-2"
                className={validateRegex(manufacturer.barcodeRegex) ? '' : 'invalid'}
              />
              <PlusMinusButtons
                intl={intl}
                onPlusClick={addManufacturer}
                onMinusClick={() => onManufacturerRemove(i)}
                isPlusButtonVisible={i === manufacturers.length - 1}
              />
            </div>
            {showValidationErrors && isInvalid && <ValidationError message="vmpConfig.error.nameRequired" />}
          </>
        );
      })}
    </>
  );
}
