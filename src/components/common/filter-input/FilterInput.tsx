import React from 'react';
import { Input } from 'reactstrap';
import searchIcon from '../../../assets/img/search.png';
import './FilterInput.scss';

export function FilterInput({ intl, value, placeholderId, wrapperClassName, onChange }) {
  return (
    <div className="filter-input-wrapper">
      <img src={searchIcon} alt="search" className="search-icon" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={intl.formatMessage({ id: placeholderId })}
        wrapperClassName={wrapperClassName}
        className="filter-input"
      />
    </div>
  );
}
