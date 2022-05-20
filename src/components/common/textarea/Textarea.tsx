/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { EMPTY_STRING } from 'src/shared/constants/input';
import { withPlaceholder } from '../form/withPlaceholder';
import './Textarea.scss';

const TextareaAutosizeWithPlaceholder = withPlaceholder(TextareaAutosize);

export const TextareaWithPlaceholder = ({
  value,
  placeholder,
  showPlaceholder,
  minRows = undefined,
  maxRows = undefined,
  isResizable = false,
  className = EMPTY_STRING,
  onChange
}) => (
  <TextareaAutosizeWithPlaceholder
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    showPlaceholder={showPlaceholder}
    minRows={minRows}
    maxRows={maxRows}
    className={`form-control default-textarea ${isResizable ? 'resizable' : EMPTY_STRING} ${className}`}
  />
);
