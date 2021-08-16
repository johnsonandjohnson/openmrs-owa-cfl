import React from 'react';
import { TimePicker as ReactTimePicker } from 'antd';
import { DEFAULT_TIME_FORMAT, EMPTY_STRING } from '../../../shared/constants/input';
import 'antd/dist/antd.min.css';
import './TimePicker.scss';
import '../../Inputs.scss';

export default function TimePicker({
  format = DEFAULT_TIME_FORMAT,
  placeholder = null,
  showPlaceholder = false,
  showNow = false,
  value,
  onChange
}) {
  return (
    <div className="input-container">
      <ReactTimePicker
        format={format}
        placeholder={placeholder}
        showNow={showNow}
        value={value}
        onChange={onChange}
        className="default-time-picker"
      />
      {!!showPlaceholder && <span className="placeholder">{placeholder || EMPTY_STRING}</span>}
    </div>
  );
}
