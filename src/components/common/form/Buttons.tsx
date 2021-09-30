import { Button, FormGroup } from 'reactstrap';
import React from 'react';
import _ from 'lodash';

export interface IButtonsProps {
  options: any[];
  entity: any;
  fieldName: any;
  onChange: (value) => void;
  onKeyDown?: () => void;
}

export const Buttons = (props: IButtonsProps) => {
  const { options, entity, fieldName, onKeyDown, onChange } = props;
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
              {label}
            </Button>
          </FormGroup>
        );
      })}
    </>
  );
};
