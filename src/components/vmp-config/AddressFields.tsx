import React from 'react';
import './VmpConfig.scss';
import { FormattedMessage } from 'react-intl';
import { Label } from 'reactstrap';
import { InputWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from '../../shared/util/form-util';
import _ from 'lodash';
import { swapPositions } from '../../shared/util/array-util';
import { getData } from 'country-list';
import { ADDRESS_FIELDS, ADDRESS_FIELD_TYPE } from '../../shared/constants/address';
import { EMPTY_COUNTRY } from 'src/shared/constants/vmp-config';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';

const COUNTRY_OPTIONS = getData().map(country => ({ label: country.name, value: country.name }));

export function AddressFields({ intl, config, onValueChange }) {
  const addressFields = config.addressFields || [];

  const onCountryChange = (countryIdx, fieldIdx, fieldName, isSelect) => e => {
    const value = isSelect ? e.value : extractEventValue(e);
    if (!fieldName) {
      // country name select
      addressFields[countryIdx].countryName = value;
    } else {
      addressFields[countryIdx].fields[fieldIdx][fieldName] = value;
    }
    onValueChange('addressFields')(addressFields);
  };

  const onAddressPartFieldChange = (countryIdx, fieldIdx) => e => {
    const addressPartField = e.value;
    addressFields[countryIdx].fields[fieldIdx].field = addressPartField;
    addressFields[countryIdx].fields[fieldIdx].type = ADDRESS_FIELD_TYPE[addressPartField];
    onValueChange('addressFields')(addressFields);
  };

  const addAddressPart = countryIdx => {
    addressFields[countryIdx].fields.push({});
    onValueChange('addressFields')(addressFields);
  };

  const removeAddressPart = (countryIdx, addressPartIdx) => {
    const fields = addressFields[countryIdx].fields;
    fields.splice(addressPartIdx, 1);
    if (fields.length === 0) {
      fields.push({});
    }
    onValueChange('addressFields')(addressFields);
  };

  const moveAddressPart = (countryIdx, idx, offset) => () => {
    swapPositions(addressFields[countryIdx]?.fields, idx, offset);
    onValueChange('addressFields')(addressFields);
  };

  const deleteCountry = countryIdx => () => {
    addressFields.splice(countryIdx, 1);
    if (addressFields.length === 0) {
      addCountry();
    }
    onValueChange('addressFields')(addressFields);
  };

  const addCountry = () => {
    addressFields.push(_.cloneDeep(EMPTY_COUNTRY));
    onValueChange('addressFields')(addressFields);
  };

  const addressPartOptions = (countryIdx, addressPartIdx) => {
    const selectedAddressParts = (addressFields[countryIdx].fields || [])
      .filter((addressPart, idx) => idx !== addressPartIdx)
      .map(addressPart => addressPart.field);
    return ADDRESS_FIELDS.filter(addressPart => !selectedAddressParts.includes(addressPart)).map(fieldName => ({
      label: fieldName,
      value: fieldName
    }));
  };

  return (
    <>
      <Label className="mb-3">
        <FormattedMessage id="vmpConfig.addressFields" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'vmpConfig.addressFieldsTooltip' })}
        />
      </Label>
      {addressFields.map((country, i) => {
        const addressParts = country.fields || [];
        addressParts.sort((ap1, ap2) => ap1.displayOrder || 0 > ap2.displayOrder || 0);
        return (
          <div key={`addressField-${i}`} className="country">
            <div className="delete-button-container d-flex justify-content-end">
              <button className="btn btn-primary" onClick={deleteCountry(i)}>
                <FormattedMessage id="vmpConfig.delete" />
              </button>
            </div>
            <div className="inline-fields">
              <div className="order-icons" />
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.country' })}
                showPlaceholder={!!country.countryName}
                value={country.countryName && { value: country.countryName, label: country.countryName }}
                onChange={onCountryChange(i, null, null, true)}
                options={COUNTRY_OPTIONS}
                wrapperClassName="flex-1"
                classNamePrefix="cfl-select"
                theme={selectDefaultTheme}
              />
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'vmpConfig.country' })}
                showPlaceholder={!!country.countryName}
                value={country.countryName}
                onChange={onCountryChange(i, null, null, false)}
                wrapperClassName="flex-1"
              />
              <div className="action-icons" />
            </div>
            {addressParts.map((addressPart, j) => {
              const { name, field } = addressPart;
              return (
                <div key={`addressField-${i}-${j}`} className="inline-fields">
                  <div className="d-flex flex-column order-icons">
                    <span
                      className={`glyphicon glyphicon-chevron-up ${j === 0 ? 'disabled' : ''}`}
                      title={intl.formatMessage({ id: 'vmpConfig.moveUp' })}
                      aria-hidden="true"
                      onClick={moveAddressPart(i, j, -1)}
                    />
                    <span
                      className={`glyphicon glyphicon-chevron-down ${j === addressParts.length - 1 ? 'disabled' : ''}`}
                      title={intl.formatMessage({ id: 'vmpConfig.moveDown' })}
                      aria-hidden="true"
                      onClick={moveAddressPart(i, j, 1)}
                    />
                  </div>
                  <SelectWithPlaceholder
                    placeholder={intl.formatMessage({ id: 'vmpConfig.addressField' })}
                    showPlaceholder={!!field}
                    value={field ? { value: field, label: field } : null}
                    onChange={onAddressPartFieldChange(i, j)}
                    options={addressPartOptions(i, j)}
                    wrapperClassName="flex-1"
                    classNamePrefix="cfl-select"
                    theme={selectDefaultTheme}
                  />
                  <InputWithPlaceholder
                    placeholder={intl.formatMessage({ id: 'vmpConfig.addressName' })}
                    showPlaceholder={!!name}
                    value={name || ''}
                    onChange={onCountryChange(i, j, 'name', false)}
                    wrapperClassName="flex-1"
                  />
                  <PlusMinusButtons
                    intl={intl}
                    onPlusClick={() => addAddressPart(i)}
                    onMinusClick={() => removeAddressPart(i, j)}
                    isPlusButtonVisible={j === addressParts.length - 1}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <div className="d-flex justify-content-end mt-2 mb-2">
        <button className="btn btn-primary" onClick={addCountry}>
          <FormattedMessage id="vmpConfig.addNewCountry" />
        </button>
      </div>
    </>
  );
}
