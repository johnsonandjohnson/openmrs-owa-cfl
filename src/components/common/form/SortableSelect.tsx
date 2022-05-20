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

import Select, { components } from 'react-select';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { swapPositions } from '../../../shared/util/array-util';

const NONE = 'none';
const READONLY_VALUE_LABEL_PADDING_RIGHT = 6;

export const SortableMultiValue = SortableElement(props => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu
  const onMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };
  return <components.MultiValue {...props} innerProps={innerProps} />;
});

export const SortableMultiValueLabel = SortableHandle(props => <components.MultiValueLabel {...props} />);

export const SortableSelect = SortableContainer(Select);

const SortableMultiSelect = props => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = swapPositions(props.value, oldIndex, newIndex - oldIndex);
    props.onChange(newValue);
  };

  return (
    <SortableSelect
      useDragHandle
      // react-sortable-hoc props:
      axis="xy"
      onSortEnd={onSortEnd}
      distance={4}
      // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
      getHelperDimensions={({ node }) => node.getBoundingClientRect()}
      // react-select props:
      {...props}
      isMulti
      components={{
        MultiValue: SortableMultiValue,
        MultiValueLabel: SortableMultiValueLabel
      }}
      closeMenuOnSelect={false}
      {...(props.isDisabled && {
        styles: {
          ...props.styles,
          indicatorsContainer: base => ({
            ...base,
            display: NONE
          }),
          multiValueLabel: base => ({
            ...base,
            paddingRight: READONLY_VALUE_LABEL_PADDING_RIGHT
          }),
          multiValueRemove: base => ({
            ...base,
            display: NONE
          })
        }
      })}
    />
  );
};

export default SortableMultiSelect;
