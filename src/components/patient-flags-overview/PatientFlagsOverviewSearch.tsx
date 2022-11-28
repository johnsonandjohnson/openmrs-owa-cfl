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
import { useIntl } from 'react-intl';
import { IFlag } from '../../shared/models/patient-flags-overview';

interface IPatientFlagsOverviewSearchProps {
  flags: IFlag[],
  setFlagName: (flag: string) => void
}

const PatientFlagsOverviewSearch = ({
  flags,
  setFlagName
}: IPatientFlagsOverviewSearchProps) => {
  const { formatMessage } = useIntl();

  const handleSelectOnChange = ({ name }) => {
    setFlagName(name)
  };

  const flagOptions = flags.map(({ name, uuid, priority }) => ({
    label: priority ? name.concat(" (").concat(priority).concat(")") : name,
    value: uuid,
    name
  }))

  return (
    <div className="patient-flags-overview-search">
      <Select
        className="flags-select"
        classNamePrefix="flags-select"
        options={flagOptions}
        onChange={handleSelectOnChange}
        placeholder={formatMessage({ id: 'patientFlagsOverview.selectPatientFlagsPlaceholder' })}
      />
    </div>
  )
};

export default PatientFlagsOverviewSearch;