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
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_NUMBER_TO_SEND } from '../../shared/constants/patient-flags-overview';
import './PatientFlagsOverview.scss';
import { injectIntl } from 'react-intl';

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
  showMessageError,
  flaggedPatients,
  totalCount,
  getPatientFlags,
  getFlaggedPatientsOverview,
  isLoading,
  intl,
  patientFlagsOverviewTableColumns
}: PropsWithIntl<StateProps & DispatchProps>) => {
  const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
      ref.current = value
    }, [value]);

    return ref.current;
  };

  const prevSessionLocationUuid = usePrevious(sessionLocation?.uuid);
  const [inputValue, setInputValue] = useState(EMPTY_STRING);
  const [flagName, setFlagName] = useState(EMPTY_STRING);
  const [page, setPage] = useState(DEFAULT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isSelectFilterTextEnabled, setInitialTextEnabled] = useState(true);

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
            <h2 className="title-header">{intl.formatMessage({ id: 'patientFlagsOverview.title' })}</h2>
            <div className="helper-text">{intl.formatMessage({ id: 'patientFlagsOverview.description' })}</div>
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
            showMessageError={showMessageError}
            pageSize={pageSize}
            totalCount={totalCount}
            patientFlagsOverviewTableColumns={patientFlagsOverviewTableColumns}
          />
          <div className="td-cell select-filter-text">
            {isSelectFilterTextEnabled ? intl.formatMessage({ id: 'patientFlagsOverview.pleaseSelectFilter' }) : ''}
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
    showMessageError,
    flaggedPatients: {
      flaggedPatients,
      totalCount
    }
  },
  apps: {
    appLoading,
    patientFlagsOverviewTableColumns
  }
}: IStore) => ({
  sessionLocation,
  flags,
  flagsLoading,
  flagsSuccess,
  flaggedPatientsLoading,
  showMessageError,
  flaggedPatients,
  totalCount,
  isLoading: appLoading || flagsLoading,
  patientFlagsOverviewTableColumns
});

const mapDispatchToProps = { getPatientFlags, getFlaggedPatientsOverview };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PatientFlagsOverview));