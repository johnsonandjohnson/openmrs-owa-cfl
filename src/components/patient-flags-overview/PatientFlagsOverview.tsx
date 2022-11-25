/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
import React, { useEffect, useState, useRef } from 'react';
import PatientFlagsOverviewSearch from './PatientFlagsOverviewSearch';
import PatientFlagsOverviewTable from './PatientFlagsOverviewTable';
import { connect } from 'react-redux';
import { getFlaggedPatientsOverview, getPatientFlags } from '../../redux/reducers/patient-flags-overview';
import { IPatientFlagsOverviewState } from '../../shared/models/patient-flags-overview';
import { Spinner } from 'reactstrap';
import { EMPTY_STRING } from '../../shared/constants/input';
import { DEFAULT_PAGE_SIZE } from '../../redux/page.util';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_NUMBER_TO_SEND, PATIENT_FLAGS_OVERVIEW_APP_NAME } from '../../shared/constants/patient-flags-overview';
import './PatientFlagsOverview.scss'
import { useIntl } from 'react-intl';
import { getAppById } from '../../redux/reducers/apps';

interface IStore {
  openmrs: {
    session: {
      sessionLocation: { uuid: string } }
  },
  patientFlagsOverview: IPatientFlagsOverviewState,
  apps
};

const PatientFlagsOverview = ({
  sessionLocation,
  flags,
  flaggedPatientsLoading,
  flaggedPatients,
  totalCount,
  getPatientFlags,
  getFlaggedPatientsOverview,
  getAppById,
  isLoading
}: StateProps & DispatchProps) => {
  const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
      ref.current = value
    }, [value]);

    return ref.current;
  };

  const { formatMessage } = useIntl();
  const prevSessionLocationUuid = usePrevious(sessionLocation?.uuid);
  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [flagName, setFlagName] = useState(EMPTY_STRING);
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isSelectFilterTextEnabled, setInitialTextEnabled] = useState(true);

  useEffect(() => {
    getAppById(PATIENT_FLAGS_OVERVIEW_APP_NAME);
  }, [])

  useEffect(() => {
    getPatientFlags();
  }, [getPatientFlags]);

  useEffect(() => {
    if (sessionLocation?.uuid && (inputValue || flagName)) {
      let pageToSend = page + 1;
      if (prevSessionLocationUuid !== sessionLocation.uuid) {
        pageToSend = DEFAULT_PAGE_NUMBER_TO_SEND;
        setPage(DEFAULT_PAGE_NUMBER);
      }
      getFlaggedPatientsOverview(sessionLocation.uuid, inputValue, flagName, pageToSend, pageSize);
    }

    if (inputValue || flagName) {
      setInitialTextEnabled(false);
    }
  }, [getFlaggedPatientsOverview, sessionLocation?.uuid, inputValue, flagName, page, pageSize, prevSessionLocationUuid]);

  return (
    <div className="patient-flags-overview">
      {isLoading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div>
            <h2 className="title-header">{formatMessage({ id: 'patientFlagsOverview.title' })}</h2>
            <div className="helper-text">{formatMessage({ id: 'patientFlagsOverview.description' })}</div>
          </div>
          <PatientFlagsOverviewSearch
            setFlagName={setFlagName}
            flags={flags}
          />
          <PatientFlagsOverviewTable
            setPage={setPage}
            setPageSize={setPageSize}
            flaggedPatients={flaggedPatients}
            flaggedPatientsLoading={flaggedPatientsLoading}
            pageSize={pageSize}
            totalCount={totalCount}
            showNoDataComponent={null}
          />
          <div className="td-cell select-filter-text">
            {isSelectFilterTextEnabled ? formatMessage({ id: 'patientFlagsOverview.pleaseSelectFilter' }) : ''}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  openmrs: {
    session: {
      sessionLocation
    }
  },
  patientFlagsOverview: {
    flags,
    flagsLoading,
    flagsSuccess,
    flaggedPatientsLoading,
    flaggedPatients: {
      flaggedPatients,
      totalCount
    }
  },
  apps: { 
    appLoading
  }
}: IStore) => ({
  sessionLocation,
  flags,
  flagsLoading,
  flagsSuccess,
  flaggedPatientsLoading,
  flaggedPatients,
  totalCount,
  isLoading: appLoading || flagsLoading
});

const mapDispatchToProps = { getPatientFlags, getFlaggedPatientsOverview, getAppById };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PatientFlagsOverview);