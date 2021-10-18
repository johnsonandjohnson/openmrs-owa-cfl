import React, { FormEvent } from 'react';
import './RadioButtons.scss';

interface IRadioButtonOption {
  value: string;
  label: string;
}

export interface IRadioButtonsProps {
  name: string;
  options: Array<IRadioButtonOption>;
  onChange: (event: FormEvent) => void;
}

const RadioButtons = (props: IRadioButtonsProps) => (
  <div onChange={props.onChange} className="input-container radio-buttons">
    {props.options.map(option => (
      <div className="radio-button-wrapper" key={option.label}>
        <input type="radio" id={`${option.value}-${props.name}`} name={props.name} value={option.value} className="radio-button" />
        <label htmlFor={`${option.value}-${props.name}`}>{option.label}</label>
      </div>
    ))}
  </div>
);

export default RadioButtons;
