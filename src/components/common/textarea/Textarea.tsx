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
