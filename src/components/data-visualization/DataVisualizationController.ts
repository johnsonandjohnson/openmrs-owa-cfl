import { useMemo } from 'react';
import * as d3 from 'd3';
import { IGroupedDataByXAxis, IReportData } from '../../shared/models/data-visualization';

interface IControler {
  data: IGroupedDataByXAxis[] | IReportData[] | [];
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
  const colorsScaleOrdinal = useMemo(() => {
    return d3.scaleOrdinal(colors.split(','));
  }, [colors]);

  const groupedByLegend = useMemo(() => {
    return d3.group(data, d => d[legend]);
  }, [data, legend]);

  const barChartMax = useMemo(() => {
    return (d3.max(data, ({ legendData = [] }) => d3.max(legendData, d => d.legendSum)) as unknown) as number;
  }, [data]);

  const lineChartMax = useMemo(() => {
    return d3.max(groupedByLegend, d =>
      d3.max(d[1], (_, idx, legends) => {
        const agg = legends.slice(0, idx + 1);

        return d3.sum(agg, d => d[yAxis]);
      })
    );
  }, [groupedByLegend, yAxis]);

  const max = chartType === 'Line Chart' ? lineChartMax : barChartMax;

  const yScale = useMemo(() => {
    return d3.scaleLinear().domain([0, max]).range([chartHeight, marginTop]);
  }, [chartHeight, marginTop, max]);

  const xScaleBarChart = useMemo(() => {
    return d3.scaleBand().domain(d3.range(data.length)).range([marginLeft, chartWidth]).padding(0.1);
  }, [chartWidth, data.length, marginLeft]);

  const xScaleLineChart = useMemo(() => {
    return d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d[xAxis])))
      .range([marginLeft, chartWidth])
      .nice();
  }, [chartWidth, data, marginLeft, xAxis]);

  const xScale = chartType === 'Line Chart' ? xScaleLineChart : xScaleBarChart;

  const xSubgroup = useMemo(() => {
    return d3.scaleBand().domain(legendTypes).range([0, xScaleBarChart.bandwidth()]).padding(0.3);
  }, [legendTypes, xScaleBarChart]);

  return {
    groupedByLegend,
    yScale,
    xScale,
    xSubgroup,
    colorsScaleOrdinal
  };
};

export default useController;
