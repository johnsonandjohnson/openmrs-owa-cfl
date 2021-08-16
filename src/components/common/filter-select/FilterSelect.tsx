import React from 'react';
import Select from 'react-select';
import { selectDefaultTheme } from '../../../shared/util/form-util';
import './FilterSelect.scss';

export function FilterSelect({ intl, value, options, placeholderId, onChange }) {
  return (
    <Select
      placeholder={intl.formatMessage({ id: placeholderId })}
      value={value}
      onChange={onChange}
      options={options}
      classNamePrefix="filter-select"
      className="filter-select"
      theme={selectDefaultTheme}
    />
  );
}
