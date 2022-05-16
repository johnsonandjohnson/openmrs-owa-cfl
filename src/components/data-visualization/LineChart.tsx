import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import SummaryChartTable from './SummaryChartTable';
import ChartLegend from './ChartLegend';
import useController from './DataVisualizationController';
import YScale from './YScale';
import XScale from './XScale';
import Lines from './Lines';
import { Button, Spinner } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { RETURN_LOCATION } from '../../shared/constants/data-visualization-configuration';
import { sumBy, chain } from 'lodash';
import { IReportConfiguration, IReportData, IGroupedDataByXAxis, IGroupedDataByLegend } from '../../shared/models/data-visualization';
import ChartDescription from './ChartDescription';
import ChartTitle from './ChartTitle';

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

  const groupedDataByXAxis = useMemo(
    () =>
      report?.length &&
      chain(report)
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
    [report, xAxis, legend, yAxis]
  ) as IGroupedDataByXAxis[];

  const groupedDataByLegend = useMemo(
    () =>
      report?.length &&
      chain(report)
        .groupBy(legend)
        .map((legendValue: IReportData[], legendKey: string) => {
          const legendSum = sumBy(legendValue, (data: IReportData) => data[yAxis]);

          return { legendKey, legendSum };
        })
        .value(),
    [report, legend, yAxis]
  ) as IGroupedDataByLegend[];

  useEffect(() => {
    if (report?.length) {
      setDataToDisplay(report);
      const legendTypes = [...new Set(report.map(data => data[legend]))].sort() as string[];

      setLegendTypes(legendTypes);
      setFilterByLegend(legendTypes);
    }
  }, [legend, report]);

  useEffect(() => {
    if (dataToDisplay?.length && isActive) {
      const width = parseInt(d3.select('.chart').style('width')) - marginLeft - marginRight;
      const height = parseInt(d3.select('.chart').style('height')) - marginTop - marginBottom;
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

  const { groupedByLegend, yScale, xScale, colorsScaleOrdinal } = controller;

  const handleLegendClick = (value: string) => {
    let filteredLegend = [...filterByLegend];
    let filteredClonedDataToDisplay = dataToDisplay.filter(data => data[legend] !== value);

    if (filteredLegend.includes(value)) {
      filteredLegend = filteredLegend.filter(data => data !== value);
    } else {
      filteredClonedDataToDisplay = [...dataToDisplay, ...report.filter(data => data[legend] === value)];
      filteredLegend.push(value);
    }

    if (!filteredLegend.length) {
      filteredLegend = legendTypes;
      filteredClonedDataToDisplay = report;
    }

    setDataToDisplay(filteredClonedDataToDisplay);
    setFilterByLegend(filteredLegend);
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
            legendTypes={legendTypes}
            groupedDataByXAxis={groupedDataByXAxis}
            groupedDataByLegend={groupedDataByLegend}
          />
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={() => (window.location.href = RETURN_LOCATION)}>
                <FormattedMessage id="common.return" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LineChart;
