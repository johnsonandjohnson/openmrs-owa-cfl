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
import { Input } from 'reactstrap';
import Select from 'react-select';
import SortableMultiSelect from './SortableSelect';
import TextareaAutosize from 'react-textarea-autosize';
import RadioButtons from '../radio-buttons/RadioButtons';

interface IWithPlaceholderProps {
  placeholder: string;
  showPlaceholder: boolean;
  wrapperClassName?: string;
  // input props
  value?: any;
  onChange?: any;
  onBlur?: any;
  options?: any[];
  isMulti?: boolean;
  isOptionSelected?: any;
  classNamePrefix?: string;
  theme?: any;
  [propName: string]: any;
}

export const withPlaceholder = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
  class extends React.Component<P & IWithPlaceholderProps> {
    render() {
      return (
        <div className={`input-container ${this.props.wrapperClassName || ''}`}>
          <WrappedComponent
            {...this.props}
            placeholder={this.props.placeholder || ''}
            styles={{
              menu: provided => ({ ...provided, zIndex: 9999 })
            }}
          />
          {!!this.props.showPlaceholder && <span className="placeholder">{this.props.placeholder || ''}</span>}
        </div>
      );
    }
  };

export const InputWithPlaceholder = withPlaceholder(Input);
export const SelectWithPlaceholder = withPlaceholder(Select);
export const SortableSelectWithPlaceholder = withPlaceholder(SortableMultiSelect);
export const TextareaAutosizeWithPlaceholder = withPlaceholder(TextareaAutosize);
export const RadioButtonsWithPlaceholder = withPlaceholder(RadioButtons);
