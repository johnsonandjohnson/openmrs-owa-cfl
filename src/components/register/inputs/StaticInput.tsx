/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, {useEffect} from 'react';
import {IFieldProps} from "./Field";

const StaticInput = (props: IFieldProps) => {
  const {field, patient, onPatientChange} = props;
  const {name, staticValue} = field;

  useEffect(() => {
    if (!patient[name]) {
      onPatientChange({...patient, [name]: staticValue});
    }
  }, [staticValue, name, onPatientChange, patient]);

  return null;
};

export default StaticInput;
