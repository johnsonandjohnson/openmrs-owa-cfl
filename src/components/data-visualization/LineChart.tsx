/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3';
import SummaryChartTable from './SummaryChartTable';
import ChartLegend from './ChartLegend';
import useController from './DataVisualizationController';
import YScale from './YScale';
import XScale from './XScale';
import Lines from './Lines';
import { Button, Spinner } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { RETURN_LOCATION } from '../../shared/constants/data-visualization-configuration';
import { IReportConfiguration, IReportData } from '../../shared/models/data-visualization';
import ChartDescription from './ChartDescription';
import ChartTitle from './ChartTitle';
import ExportChartDataButton from './ExportChartDataButton';

interface ILineChart {
  chartIdx: number;
  isActive: boolean;
  report: IReportData[];
  config: IReportConfiguration;
}

const LineChart = ({
  report,
  config: { xAxis, yAxis, legend, description, chartType, colors, marginTop, marginBottom, marginLeft, marginRight, title },
  isActive
}: ILineChart) => {
  const chartRef = useRef();
  const chartRefCurrent = chartRef.current;

  const [dataToDisplay, setDataToDisplay] = useState<IReportData[]>([]);
  const [legendTypes, setLegendTypes] = useState<string[]>([]);
  const [filterByLegend, setFilterByLegend] = useState<string[]>([]);
  const [chartWidth, setChartWidth] = useState<number>(null);
  const [chartHeight, setChartHeight] = useState<number>(null);

  useEffect(() => {
    if (report?.length) {
      setDataToDisplay(report);
      const newLegendTypes = [...new Set(report.map(data => `${data[legend]}`))].sort() as string[];

      setLegendTypes(newLegendTypes);
      setFilterByLegend(newLegendTypes);
    }
  }, [legend, report]);

  useEffect(() => {
    if (dataToDisplay?.length && isActive) {
      const width = parseInt(select('.chart').style('width')) - marginLeft - marginRight;
      const height = parseInt(select('.chart').style('height')) - marginTop - marginBottom;
      setChartWidth(width);
      setChartHeight(height);
    }
  }, [dataToDisplay, isActive, marginBottom, marginLeft, marginRight, marginTop]);

  const controller = useController({
    data: dataToDisplay,
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
  });

  const { groupedByLegend, yScale, xScale, colorsScaleOrdinal, groupedAndSummedDataByXAxis, groupedAndSummedDataByLegend } = controller;

  const handleLegendClick = (value: string) => {
    let filteredLegend = [...filterByLegend];
    let filteredClonedDataToDisplay = dataToDisplay.filter(data => `${data[legend]}` !== value);

    if (filteredLegend.includes(value)) {
      filteredLegend = filteredLegend.filter(data => data !== value);
    } else {
      filteredClonedDataToDisplay = [...dataToDisplay, ...report.filter(data => `${data[legend]}` === value)];
      filteredLegend.push(value);
    }

    if (!filteredLegend.length) {
      filteredLegend = legendTypes;
      filteredClonedDataToDisplay = report;
    }

    setDataToDisplay(filteredClonedDataToDisplay);
    setFilterByLegend(filteredLegend.sort());
  };

  return (
    <>
      {!legendTypes.length && !chartWidth ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <div className="chart">
          <svg width={chartWidth + marginLeft + marginRight} height={chartHeight + marginTop + marginBottom} ref={chartRef}>
            <ChartTitle chartRef={chartRefCurrent} chartWidth={chartWidth} marginTop={marginTop} title={title} />
            <YScale chartRef={chartRefCurrent} yScale={yScale} chartWidth={chartWidth} marginLeft={marginLeft} />
            <XScale chartRef={chartRefCurrent} xScale={xScale} chartHeight={chartHeight} chartType={chartType} />
            <ChartLegend
              legendTypes={legendTypes}
              filterByLegend={filterByLegend}
              handleLegendClick={handleLegendClick}
              colors={colorsScaleOrdinal}
              chartWidth={chartWidth}
              chartRef={chartRefCurrent}
              marginLeft={marginLeft}
              marginRight={marginRight}
            />
            <Lines
              chartRef={chartRefCurrent}
              filterByLegend={filterByLegend}
              groupedByLegend={groupedByLegend}
              chartWidth={chartWidth}
              colors={colorsScaleOrdinal}
              xScale={xScale}
              yScale={yScale}
              xAxis={xAxis}
              yAxis={yAxis}
            />
          </svg>
          {description && <ChartDescription description={description} />}
          <SummaryChartTable
            xAxis={xAxis}
            legendTypes={filterByLegend}
            groupedAndSummedDataByXAxis={groupedAndSummedDataByXAxis}
            groupedAndSummedDataByLegend={groupedAndSummedDataByLegend}
          />
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={() => (window.location.href = RETURN_LOCATION)}>
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <ExportChartDataButton
              data={dataToDisplay}
              chartType={chartType}
              filterByLegend={filterByLegend}
              legend={legend}
              xAxis={xAxis}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LineChart;
