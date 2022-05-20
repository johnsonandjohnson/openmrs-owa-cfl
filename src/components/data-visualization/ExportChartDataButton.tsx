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
import downloadCsv from 'download-csv';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import { unparse } from 'papaparse';
import { IReportData } from '../../shared/models/data-visualization';

interface IExportChartDataButton {
  data: IReportData[];
  chartType: string;
  filterByLegend?: string[];
  filterByXAxsis?: string[];
  legend: string;
  xAxis: string;
}

const ExportChartDataButton = ({ data, chartType, filterByLegend, filterByXAxsis, legend, xAxis }: IExportChartDataButton) => {
  const exportDataToCsv = () => {
    const addFilterToCsv = data.map(d => ({
      ...d,
      ...(filterByLegend && { [`filtered by ${legend}`]: filterByLegend.join(',') }),
      ...(filterByXAxsis && { [`filtered by ${xAxis}`]: filterByXAxsis.join(',') })
    }));
    const convertData = unparse(addFilterToCsv);

    return downloadCsv(convertData, null, `${chartType.replace(' ', '-')}.csv`);
  };

  return (
    <div className="d-inline pull-right confirm-button-container">
      <Button className="save" onClick={exportDataToCsv}>
        <FormattedMessage id="common.downloadCsv" />
      </Button>
    </div>
  );
};

export default ExportChartDataButton;
