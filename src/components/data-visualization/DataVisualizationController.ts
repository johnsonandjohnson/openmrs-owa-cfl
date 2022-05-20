/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { useMemo } from 'react';
import * as d3 from 'd3';
import { IGroupedAndSummedDataByXAxis, IGroupedAndSummedDataByLegend, IReportData } from '../../shared/models/data-visualization';
import { chain, sumBy, sortBy } from 'lodash';
import { LINE_CHART } from '../../shared/constants/data-visualization-configuration';

interface IControler {
  data: IReportData[] | [];
  chartWidth: number;
  chartHeight: number;
  chartType: string;
  xAxis: string;
  yAxis: string;
  legend: string;
  legendTypes: string[];
  colors: string;
  marginTop: number;
  marginLeft: number;
}

const useController = ({
  data,
  chartWidth,
  chartHeight,
  chartType,
  xAxis,
  yAxis,
  legend,
  legendTypes,
  colors,
  marginTop,
  marginLeft
}: IControler) => {
  const groupedAndSummedDataByXAxis = useMemo(
    () =>
      chain(data)
        .groupBy(xAxis)
        .map((xAxisValue: IReportData[], xAxisKey: string) => {
          const legendData = chain(xAxisValue)
            .groupBy(legend)
            .map((legendValue: IReportData[], legendKey: string) => {
              const legendSum = sumBy(legendValue, (data: IReportData) => data[yAxis]);

              return { legendSum, legendKey: `${legendKey}` };
            })
            .value();

          return { xAxisKey, legendData };
        })
        .value(),
    [data, xAxis, legend, yAxis]
  ) as IGroupedAndSummedDataByXAxis[];

  const groupedAndSummedDataByLegend = useMemo(
    () =>
      sortBy(
        chain(data)
          .groupBy(legend)
          .map((legendValue: IReportData[], legendKey: string) => {
            const legendSum = sumBy(legendValue, (data: IReportData) => data[yAxis]);

            return { legendKey, legendSum };
          })
          .value(),
        ({ legendKey }) => legendKey
      ),
    [data, legend, yAxis]
  ) as IGroupedAndSummedDataByLegend[];

  const colorsScaleOrdinal = useMemo(() => {
    return d3.scaleOrdinal(colors.split(','));
  }, [colors]);

  const groupedByLegend = useMemo(() => {
    return d3.group(data, d => `${d[legend]}`);
  }, [data, legend]);

  const barChartMax = useMemo(() => {
    return (d3.max(groupedAndSummedDataByXAxis, ({ legendData = [] }) => d3.max(legendData, d => d.legendSum)) as unknown) as number;
  }, [groupedAndSummedDataByXAxis]);

  const lineChartMax = useMemo(() => {
    return d3.max(groupedByLegend, d =>
      d3.max(d[1], (_, idx, legends: IReportData[]) => {
        const agg = legends.slice(0, idx + 1);

        return d3.sum(agg, d => d[yAxis]);
      })
    );
  }, [groupedByLegend, yAxis]);

  const max = chartType === LINE_CHART ? lineChartMax : barChartMax;

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, max]).range([chartHeight, marginTop]);
  }, [chartHeight, marginTop, max]);

  const xScaleBarChart = useMemo(() => {
    //@ts-ignore
    return d3.scaleBand().domain(d3.range(groupedAndSummedDataByXAxis.length)).range([marginLeft, chartWidth]).padding(0.1);
  }, [chartWidth, groupedAndSummedDataByXAxis.length, marginLeft]);

  const xScaleLineChart = useMemo(() => {
    return d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d[xAxis])))
      .range([marginLeft, chartWidth])
      .nice();
  }, [chartWidth, data, marginLeft, xAxis]);

  const xScale = chartType === LINE_CHART ? xScaleLineChart : xScaleBarChart;

  const xSubgroup = useMemo(() => {
    return d3.scaleBand().domain(legendTypes).range([0, xScaleBarChart.bandwidth()]).padding(0.3);
  }, [legendTypes, xScaleBarChart]);

  return {
    groupedByLegend,
    groupedAndSummedDataByXAxis,
    groupedAndSummedDataByLegend,
    yScale,
    xScale,
    xSubgroup,
    colorsScaleOrdinal
  };
};

export default useController;
