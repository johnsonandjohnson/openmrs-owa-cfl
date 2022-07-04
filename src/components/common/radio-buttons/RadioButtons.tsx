/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { FormEvent } from 'react';
import './RadioButtons.scss';

interface IRadioButtonOption {
  value: string;
  label: string;
}

export interface IRadioButtonsProps {
  name: string;
  options: Array<IRadioButtonOption>;
  value: string;
  onChange: (event: FormEvent) => void;
}

const RadioButtons = (props: IRadioButtonsProps) => (
  <div onChange={props.onChange} className="input-container radio-buttons">
    {props.options.map(option => (
      <div className="radio-button-wrapper" key={option.label}>
        <input
          type="radio"
          id={`${option.value}-${props.name}`}
          name={props.name}
          value={option.value}
          className="radio-button"
          checked={props.value === option.value}
        />
        <label htmlFor={`${option.value}-${props.name}`}>{option.label}</label>
      </div>
    ))}
  </div>
);

export default RadioButtons;
