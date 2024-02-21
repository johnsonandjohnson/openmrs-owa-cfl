/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { useEffect, useState } from 'react';
import Select from './Select';
import Input from './Input';
import { connect } from 'react-redux';
import { IConceptState } from '../../../shared/models/concept';
import { GLOBAL_PROPERTY } from '../../../shared/constants/concept';
import { INPUT_COUNTRY_NAME } from '../../../shared/constants/input';
import { uniq } from 'lodash';
import './AddressFields.scss';

interface IAddressFieldsProps extends StateProps, DispatchProps {
  inputRef: (element: { focus: () => void }) => void,
  field: {
    label: string,
    name: string,
    optionKey: string,
    optionSource: string,
    optionUuid: string,
    allAddressFieldsRequired: boolean
  },
  patient: { country: string },
  onPatientChange: (patient) => void,
  isInvalid: boolean,
  isDirty: boolean,
  isEdit: boolean
};

interface IStore {
  concept: IConceptState;
  settings: {
    settings: [{
      property: string,
      value: string
    }]
    setting: { value: string },
    isSettingExist: {
      settingPropertyUrl: string,
      value: boolean
    }
  };
};

const AddressFields = (props: IAddressFieldsProps) => {
  const {
    settings: { settings },
    patient: { country },
    field: {
      label,
      optionKey,
      optionSource,
      optionUuid,
      allAddressFieldsRequired
    }
  } = props;
  const isGlobalPropertyOptionSource = optionSource === GLOBAL_PROPERTY;
  const foundGlobalProperty = settings.find(({ property }) => property === optionUuid);

  const [addressFields, setAddresFields] = useState([]);
  const [dirtyFields, setDirtyFields] = useState([]);

  useEffect(() => {
    if (isGlobalPropertyOptionSource && foundGlobalProperty?.value) {
      const configParsed = JSON.parse(foundGlobalProperty.value);

      if (country) {
        setAddresFields(configParsed[optionKey][country]);
      }

    }
  },[country, foundGlobalProperty, isGlobalPropertyOptionSource, optionKey]);


  const selectProps = {
    ...props, // inc. inputRef
    className: 'col-sm-6 address-field-country',
    field: {
      ...props.field,
      label: INPUT_COUNTRY_NAME,
      name: INPUT_COUNTRY_NAME,
      required: allAddressFieldsRequired
    },
    isInvalid: !country,
    onPatientChange: () => {
      addressFields?.forEach(({ field }) => props.patient[field] = '');

      setDirtyFields([]);
      props.onPatientChange(props.patient);
    }
  }

  return (
    <div className="address-fields-container">
      {label && <h1>{label}</h1>}
      <Select {...selectProps}/>

      <div className="inline-fields address-fields">
        {!!addressFields?.length && addressFields.map(addressField => {
          const inputProps = {
            ...props,
            // prevent inputRef, it's passed to country Select only
            inputRef: undefined,
            onPatientChange: () => {
              setDirtyFields(uniq([...dirtyFields, addressField.field]));
              props.onPatientChange(props.patient);
            },
            field: {
              name: addressField.field,
              label: addressField.name,
              field: addressField.field,
              type: 'text',
              required: allAddressFieldsRequired,
            },
            isInvalid: !props.patient[addressField.field],
            isDirty: dirtyFields.find(field => field === addressField.field)
          };

          return <Input {...inputProps} />
        })}
      </div>
    </div>
  )
};

const mapStateToProps = ({
  concept,
  settings
}: IStore) => ({
  concept,
  settings
});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AddressFields);
