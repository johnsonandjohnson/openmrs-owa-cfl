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
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { withPlaceholder } from '../form/withPlaceholder';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/velocity/velocity';
import 'codemirror/addon/display/placeholder';
import './VelocityCodeEditor.scss';

export const VelocityCodeEditor = ({ value, lineNumbers = false, placeholder, onChange }) => (
  <CodeMirror
    value={value}
    options={{
      mode: 'velocity',
      theme: 'default',
      lineNumbers,
      placeholder
    }}
    autoCursor={false}
    onChange={(editor, data, newValue) => onChange(newValue)}
  />
);

export const VelocityCodeEditorWithPlaceholder = withPlaceholder(VelocityCodeEditor);
