/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { Button, FormGroup } from 'reactstrap';
import React from 'react';
import _ from 'lodash';

export interface IButtonsProps {
  options: any[];
  entity: any;
  fieldName: any;
  intl: any;
  onChange: (value) => void;
  onKeyDown?: () => void;
}

export const Buttons = (props: IButtonsProps) => {
  const { options, entity, fieldName, onKeyDown, onChange, intl } = props;
  const handleOnChange = value => evt => onChange(value);

  return (
    <>
      {_.map(options || [], (option, i) => {
        const value = option.value !== undefined ? option.value : option;
        const label = option.label !== undefined ? option.label : option;
        return (
          <FormGroup check inline key={`button-${value}`} className="mb-2">
            <Button
              onClick={handleOnChange(value)}
              className={`select-button w-100 ${entity[fieldName] === value ? 'active' : ''}`}
              {...(!!onKeyDown &&
                i === options.length - 1 && {
                  onKeyDown
                })}
            >
              {label ? intl.formatMessage({ id: `${label}` }) : ''}
            </Button>
          </FormGroup>
        );
      })}
    </>
  );
};
