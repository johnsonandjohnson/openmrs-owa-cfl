import React from 'react';

import Select, { components } from 'react-select';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { swapPositions } from '../../../shared/util/array-util';

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
    />
  );
};

export default SortableMultiSelect;
