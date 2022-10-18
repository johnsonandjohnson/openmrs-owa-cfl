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
import './PatientFlagsOverview.scss'

interface IStore {
  openmrs: {
    session: {
      sessionLocation: { uuid: string } }
  },
  patientFlagsOverview: IPatientFlagsOverviewState
};

const PatientFlagsOverview = ({
  sessionLocation,
  flagsLoading,
  flags,
  flaggedPatientsLoading,
  flaggedPatients,
  totalCount,
  getPatientFlags,
  getFlaggedPatientsOverview
}: StateProps & DispatchProps) => {
  const usePrevious = value => {
    const ref = useRef();

    useEffect(() => {
      ref.current = value
    }, [value]);

    return ref.current;
  };
  const prevSessionLocationUuid = usePrevious(sessionLocation?.uuid);
  const [patientName, setPatientName] = useState(EMPTY_STRING);
  const [flagName, setFlagName] = useState(EMPTY_STRING);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  useEffect(() => {
    getPatientFlags();
  }, [getPatientFlags]);

  useEffect(() => {
    if (sessionLocation?.uuid && (patientName || flagName)) {
      let pageToSend = page + 1;
      if (prevSessionLocationUuid !== sessionLocation.uuid) {
        pageToSend = 1;
        setPage(0);
      }
      getFlaggedPatientsOverview(sessionLocation.uuid, patientName, flagName, pageToSend, pageSize);
    }
  }, [getFlaggedPatientsOverview, sessionLocation?.uuid, patientName, flagName, page, pageSize, prevSessionLocationUuid]);


  return (
    <div className="patient-flags-overview">
      {flagsLoading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <PatientFlagsOverviewSearch
            patientName={patientName}
            setPatientName={setPatientName}
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
            showNoDataComponent={!!(patientName || flagName)}
          />
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
  }
}: IStore) => ({
  sessionLocation,
  flags,
  flagsLoading,
  flagsSuccess,
  flaggedPatientsLoading,
  flaggedPatients,
  totalCount
});

const mapDispatchToProps = { getPatientFlags, getFlaggedPatientsOverview };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PatientFlagsOverview);