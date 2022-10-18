/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
export interface IFlag {
  name: string,
  uuid: string
};

export interface IFlaggedPatient {
  patientIdentifier: string,
  patientName: string,
  phoneNumber: string,
  patientStatus: string,
  patientUuid: string
};

export interface IPatientFlagsOverviewState {
  flagsLoading: boolean,
  flaggedPatientsLoading: boolean,
  flagsSuccess: boolean,
  flaggedPatientsSuccess: boolean,
  flags: IFlag[],
  flaggedPatients: { flaggedPatients: IFlaggedPatient[], totalCount: number }
};