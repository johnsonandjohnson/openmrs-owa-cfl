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
import Select from 'react-select';
import searchIcon from '../../assets/img/search.png';
import { useIntl } from 'react-intl';
import { Input } from 'reactstrap';
import { IFlag } from '../../shared/models/patient-flags-overview';

interface IPatientFlagsOverviewSearchProps {
  patientName: string,
  flags: IFlag[],
  setPatientName: (patientName: string) => void,
  setFlagName: (flag: string) => void
}

const PatientFlagsOverviewSearch = ({
  patientName,
  flags,
  setPatientName,
  setFlagName
}: IPatientFlagsOverviewSearchProps) => {
  const { formatMessage } = useIntl();
  const handleInputOnChange = ({ target: { value } }) => {
    setPatientName(value)
  };

  const handleSelectOnChange = ({ label }) => {
    setFlagName(label)
  };

  return (
    <div className="patient-flags-overview-search">
      <div className="search-bar">
        <img src={searchIcon} alt="search" className="search-icon" />
        <Input
          value={patientName}
          onChange={handleInputOnChange}
          placeholder={formatMessage({ id: 'patientFlagsOverview.searchInputPlaceholder' })}
        />
      </div>
      <Select
        className="flags-select"
        classNamePrefix="flags-select"
        options={flags.map(({ name, uuid }) =>({ label: name, value: uuid }))}
        onChange={handleSelectOnChange}
        placeholder={formatMessage({ id: 'patientFlagsOverview.selectPatientFlagsPlaceholder' })}
      />
    </div>
  )
};

export default PatientFlagsOverviewSearch;