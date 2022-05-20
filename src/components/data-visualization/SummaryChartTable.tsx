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
import moment from 'moment';
import { Table } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { IGroupedAndSummedDataByXAxis, IGroupedAndSummedDataByLegend } from '../../shared/models/data-visualization';

interface ISummaryChartTable {
  xAxis: string;
  legendTypes: string[];
  groupedAndSummedDataByXAxis: IGroupedAndSummedDataByXAxis[];
  groupedAndSummedDataByLegend: IGroupedAndSummedDataByLegend[];
}

const SummaryChartTable = ({ xAxis, legendTypes, groupedAndSummedDataByXAxis, groupedAndSummedDataByLegend }: ISummaryChartTable) => (
  <Table hover striped responsive size="sm">
    <thead>
      <tr className="sticky sticky-top">
        <th>{xAxis}</th>
        {legendTypes.map(legend => (
          <th key={`${legend}`}>{`${legend}`}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {groupedAndSummedDataByXAxis.map(({ xAxisKey, legendData }) => (
        <tr key={xAxisKey}>
          <td className="sticky sticky-left">{moment(xAxisKey).format('DD-MM-YYYY')}</td>
          {legendTypes.map(legend => {
            const value = legendData.find(({ legendKey }) => `${legendKey}` === `${legend}`)?.legendSum || '-';

            return <td key={`${legend}`}>{value}</td>;
          })}
        </tr>
      ))}
      <tr className="sticky sticky-bottom">
        <td className="sticky sticky-left">
          <FormattedMessage id="common.grandTotal" tagName="span" />
        </td>
        {groupedAndSummedDataByLegend.map(({ legendKey, legendSum }) => (
          <td key={`${legendKey}`}>{legendSum}</td>
        ))}
      </tr>
    </tbody>
  </Table>
);

export default SummaryChartTable;
