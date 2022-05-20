/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import {
  CHART_COLORS_KEY,
  CHART_DESCRIPTION_KEY,
  CHART_LEGEND_KEY,
  CHART_MARGIN_BOTTOM_KEY,
  CHART_MARGIN_LEFT_KEY,
  CHART_MARGIN_RIGHT_KEY,
  CHART_MARGIN_TOP_KEY,
  CHART_TITLE_KEY,
  CHART_TYPE_KEY,
  CHART_X_AXIS_KEY,
  CHART_Y_AXIS_KEY
} from '../constants/data-visualization-configuration';
import { IOption } from './option';

interface IDataSetsDefinition {
  name: string;
  description: string;
}

interface IDataSetsColumns {
  name: string;
}

interface IDataSets {
  metadata: {
    columns: IDataSetsColumns[];
  };
  rows: {}[];
}

export interface IReportData {
  uuid: string;
  name: string;
  [CHART_TITLE_KEY]: string;
  [CHART_TYPE_KEY]: string;
  [CHART_X_AXIS_KEY]: string;
  [CHART_Y_AXIS_KEY]: string;
  [CHART_LEGEND_KEY]: string;
  [CHART_DESCRIPTION_KEY]: string;
}

export interface IReportList {
  uuid: string;
  name: string;
  description: string;
  columns: string[];
  reportData: IReportData[];
}

export interface IReportConfiguration {
  uuid: string;
  name: string;
  [CHART_TITLE_KEY]: string;
  [CHART_TYPE_KEY]: string;
  [CHART_X_AXIS_KEY]: string;
  [CHART_Y_AXIS_KEY]: string;
  [CHART_LEGEND_KEY]: string;
  [CHART_DESCRIPTION_KEY]: string;
  [CHART_MARGIN_TOP_KEY]: number;
  [CHART_MARGIN_BOTTOM_KEY]: number;
  [CHART_MARGIN_RIGHT_KEY]: number;
  [CHART_MARGIN_LEFT_KEY]: number;
  [CHART_COLORS_KEY]: string;
}

export interface IDataVisualizationConfigurationState {
  loading: boolean;
  reportsList: IReportList[];
  initialUpdate: boolean;
  reportsConfiguration: IReportConfiguration[];
  errorMessage: string;
  success: {
    getReport: boolean;
    getAllReports: boolean;
  };
  showValidationErrors: boolean;
}

export interface IGroupedAndSummedDataByXAxis {
  xAxisKey: string;
  legendData: IGroupedAndSummedDataByLegend[];
}

export interface IGroupedAndSummedDataByLegend {
  legendKey: string;
  legendSum: number;
}

export interface IGetReportsActionPayload {
  data: {
    uuid: string;
    dataSets: IDataSets[];
    definition: IDataSetsDefinition;
  };
}

export interface IReportsOptions extends IOption {
  description: string;
}
