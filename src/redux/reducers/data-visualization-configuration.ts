/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import axios from 'axios';
import { AnyAction } from 'redux';
import { WS_REST_V1_URL } from '../../shared/constants/openmrs';
import { DEFAULT_REPORT_CONFIGURATION } from '../../shared/constants/data-visualization-configuration';
import { REQUEST, SUCCESS, FAILURE } from '../action-type.util';
import {
  IDataVisualizationConfigurationState,
  IReportConfiguration,
  IGetReportsActionPayload
} from '../../shared/models/data-visualization';

const ACTION_TYPES = {
  GET_REPORT: 'report/GET_REPORT',
  GET_REPORTS: 'report/GET_REPORTS',
  ADD_REPORT_CONFIGURATION_BLOCK: 'report/ADD_REPORT_CONFIGURATION_BLOCK',
  UPDATE_REPORTS_CONFIGURATION: 'report/UPDATE_REPORTS_CONFIGURATION',
  INITIAL_REPORTS_CONFIGURATION: 'report/INITIAL_REPORTS_CONFIGURATION',
  REMOVE_REPORT: 'report/REMOVE_REPORT',
  VALIDATION: 'report/VALIDATION'
};

const initialState: IDataVisualizationConfigurationState = {
  loading: false,
  reportsList: [],
  initialUpdate: false,
  reportsConfiguration: [DEFAULT_REPORT_CONFIGURATION],
  errorMessage: '',
  success: {
    getReport: false,
    getAllReports: false
  },
  showValidationErrors: false
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_REPORTS):
      return {
        ...state,
        loading: true
      };
    case FAILURE(ACTION_TYPES.GET_REPORTS): {
      const {
        response: {
          data: {
            error: { message: errorMessage }
          }
        }
      } = action.payload;

      return {
        ...state,
        errorMessage,
        loading: false
      };
    }
    case SUCCESS(ACTION_TYPES.GET_REPORTS): {
      const reportsList = action.payload.map(
        ({
          data: {
            dataSets,
            definition: { name, description },
            uuid
          }
        }: IGetReportsActionPayload) => {
          const [report] = dataSets;
          const {
            metadata: { columns },
            rows
          } = report;

          return {
            uuid,
            name,
            description,
            columns: columns.map(({ name: columnName }) => columnName),
            reportData: rows
          };
        }
      );
      return {
        ...state,
        loading: false,
        success: {
          ...state.success,
          getAllReports: true
        },
        reportsList
      };
    }
    case ACTION_TYPES.ADD_REPORT_CONFIGURATION_BLOCK:
      return {
        ...state,
        reportsConfiguration: [...state.reportsConfiguration, DEFAULT_REPORT_CONFIGURATION]
      };
    case ACTION_TYPES.UPDATE_REPORTS_CONFIGURATION:
      return {
        ...state,
        reportsConfiguration: action.reportsConfiguration
      };
    case ACTION_TYPES.INITIAL_REPORTS_CONFIGURATION:
      return {
        ...state,
        reportsConfiguration: action.reportsConfiguration,
        initialUpdate: true
      };
    case ACTION_TYPES.REMOVE_REPORT: {
      const filteredReportsConfiguration = state.reportsConfiguration.filter((_, idx) => idx !== action.reportIdx);

      return {
        ...state,
        reportsConfiguration: filteredReportsConfiguration.length ? filteredReportsConfiguration : initialState.reportsConfiguration
      };
    }
    case ACTION_TYPES.VALIDATION:
      return {
        ...state,
        showValidationErrors: action.showValidationErrors
      };
    default:
      return state;
  }
};

export default reducer;

export const getReports = (uuids?: string[]) => ({
  type: ACTION_TYPES.GET_REPORTS,
  payload: Promise.all(uuids.map(uuid => axios.get(`${WS_REST_V1_URL}reportingrest/reportdata/${uuid}`)))
});

export const addReportConfigurationBlock = () => ({
  type: ACTION_TYPES.ADD_REPORT_CONFIGURATION_BLOCK
});

export const updateReportsConfiguration = (reportsConfiguration: IReportConfiguration[]) => ({
  type: ACTION_TYPES.UPDATE_REPORTS_CONFIGURATION,
  reportsConfiguration
});

export const initialUpdateReportsConfiguration = (reportsConfiguration: IReportConfiguration[]) => ({
  type: ACTION_TYPES.INITIAL_REPORTS_CONFIGURATION,
  reportsConfiguration
});

export const removeReport = (reportIdx: number) => ({
  type: ACTION_TYPES.REMOVE_REPORT,
  reportIdx
});

export const setShowValidationErrors = (showValidationErrors: boolean) => ({
  type: ACTION_TYPES.VALIDATION,
  showValidationErrors
});
