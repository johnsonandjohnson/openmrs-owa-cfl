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
import ReactTable from 'react-table';
import { useIntl } from 'react-intl';
import { IFlaggedPatient } from '../../shared/models/patient-flags-overview';
import { PATIENT_PAGE_URL } from '../../shared/constants/openmrs';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, COLUMNS } from '../../shared/constants/patient-flags-overview';
import { ZERO } from '../../shared/constants/input';

interface IPatientFlagsOverviewTableProps {
  flaggedPatientsLoading: boolean,
  flaggedPatients: IFlaggedPatient[],
  totalCount: number,
  setPage: (page: number) => void,
  setPageSize: (pageSize: number) => void,
  pageSize: number,
  showNoDataComponent: boolean
}

const PatientFlagsOverviewTable = ({
  flaggedPatientsLoading,
  flaggedPatients,
  totalCount,
  setPage,
  setPageSize,
  pageSize,
  showNoDataComponent
}: IPatientFlagsOverviewTableProps) => {
  const { formatMessage } = useIntl();

  const fetchData = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onRowClick = patientUuid => {
    window.location.href = `${PATIENT_PAGE_URL}?patientId=${patientUuid}`
  };

  const tableColumns = COLUMNS.map(({ label, value }) => ({
    Header: label,
    accessor: value,
    Cell: ({ value }) => {
      return <div className="td-cell">{value}</div>;
    }
  }));
  
  return (
    <ReactTable
      className="-striped -highlight"
      manual={true}
      loading={flaggedPatientsLoading}
      data={flaggedPatients[0]?.patientUuid ? flaggedPatients : []}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      pageSizeOptions={PAGE_SIZE_OPTIONS}
      minRows={ZERO}
      NoDataComponent={() => showNoDataComponent && <div className="td-cell">{formatMessage({ id: 'patientFlagsOverview.noRecordsFound' })}</div>}
      showPagination={!!totalCount && !flaggedPatientsLoading}
      onFetchData={fetchData}
      pages={Math.ceil(totalCount / pageSize)}
      getTrProps={(_, { original: { patientUuid } }) => ({
        onClick: () => onRowClick(patientUuid)
      })}
      columns={tableColumns}
    />
  )
};

export default PatientFlagsOverviewTable;