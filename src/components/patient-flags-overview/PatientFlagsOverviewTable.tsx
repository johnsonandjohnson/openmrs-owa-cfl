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
import { IFlaggedPatient } from '../../shared/models/patient-flags-overview';
import { PATIENT_PAGE_URL } from '../../shared/constants/openmrs';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, DEFAULT_COLUMNS } from '../../shared/constants/patient-flags-overview';
import { ZERO } from '../../shared/constants/input';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

interface IPatientFlagsOverviewTableProps {
  flaggedPatientsLoading: boolean,
  showMessageError: boolean,
  flaggedPatients: IFlaggedPatient[],
  totalCount: number,
  setPage: (page: number) => void,
  setPageSize: (pageSize: number) => void,
  pageSize: number,
  app: any,
  patientFlagsOverviewTableColumns: any
}

const PatientFlagsOverviewTable = ({
  flaggedPatientsLoading,
  showMessageError,
  flaggedPatients,
  totalCount,
  setPage,
  setPageSize,
  pageSize,
  app,
  intl,
  patientFlagsOverviewTableColumns
}: PropsWithIntl<IPatientFlagsOverviewTableProps>) => {

  const fetchData = ({ page, pageSize }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onRowClick = patientUuid => {
    window.location.href = `${PATIENT_PAGE_URL}?patientId=${patientUuid}`
  };

  const getColumnsToDisplay = () => {
    if (patientFlagsOverviewTableColumns) {
      return Object.keys(patientFlagsOverviewTableColumns).map(obj => {
        return {
          label: intl.formatMessage({ id: `${obj}` }),
          value: patientFlagsOverviewTableColumns[obj]
        }
      });
    } else {
      return DEFAULT_COLUMNS;
    }
  }

  const tableColumns = getColumnsToDisplay().map(({ label, value }) => ({
    Header: label,
    accessor: value,
    Cell: ({ value }) => {
      return <div className="td-cell">{value}</div>;
    }
  }));

  const helperText = (loading: boolean, totalCount: number, showMessageError: boolean) => {
    if (totalCount > 0) {
      return (
        <span>
          {totalCount} {intl.formatMessage({ id: 'patientFlagsOverview.recordsFound' })}
        </span>
      );
    } else if (showMessageError) {
      return intl.formatMessage({ id: 'patientFlagsOverview.somethingWentWrong' });
    } else if (!loading && totalCount === 0) {
      return intl.formatMessage({ id: 'patientFlagsOverview.noRecords' });
    }
  };

  const previousText = intl.formatMessage({ id: 'common.table.previousLabel' });
  const nextText = intl.formatMessage({ id: 'common.table.nextLabel' });
  const loadingText = intl.formatMessage({ id: 'common.table.loadingLabel' });
  const pageText = intl.formatMessage({ id: 'common.table.pageLabel' });
  const ofText = intl.formatMessage({ id: 'common.table.ofLabel' });
  const rowsText = intl.formatMessage({ id: 'common.table.resultsLabel' });

  return (
    <>
      <div className="helper-text">
        {flaggedPatientsLoading ? (
            <div className="spinner-border spinner-border-sm" />
        ) : (
            helperText(flaggedPatientsLoading, totalCount, showMessageError)
        )}
      </div>
      <ReactTable
        className="-striped -highlight"
        manual={true}
        loading={flaggedPatientsLoading}
        data={flaggedPatients[0]?.patientUuid ? flaggedPatients : []}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        minRows={ZERO}
        NoDataComponent={() => <div></div>}
        showPagination={!!totalCount && !flaggedPatientsLoading}
        onFetchData={fetchData}
        pages={Math.ceil(totalCount / pageSize)}
        getTrProps={(_, { original: { patientUuid } }) => ({
          onClick: () => onRowClick(patientUuid)
        })}
        columns={tableColumns}
        nextText={nextText}
        previousText={previousText}
        pageText={pageText}
        ofText={ofText}
        rowsText={rowsText}
        loadingText={loadingText}
      />
    </>
  )
};

const mapStateToProps = ({ apps: { app } }) => ({
  app
});

export default injectIntl(connect(mapStateToProps)(PatientFlagsOverviewTable));