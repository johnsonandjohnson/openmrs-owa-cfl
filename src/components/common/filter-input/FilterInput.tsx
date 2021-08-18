import React from 'react';
import { Input } from 'reactstrap';
import searchIcon from '../../../assets/img/search.png';
import './FilterInput.scss';

export const FilterInput = ({ intl, value, placeholderId, onChange }) => (
  <div className="filter-input-wrapper">
    <img src={searchIcon} alt="search" className="search-icon" />
    <Input value={value} onChange={onChange} placeholder={intl.formatMessage({ id: placeholderId })} className="filter-input" />
  </div>
);
