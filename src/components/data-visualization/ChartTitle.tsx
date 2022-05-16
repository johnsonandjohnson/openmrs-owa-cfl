import React, { useEffect } from 'react';
import * as d3 from 'd3';

interface IChartTitle {
  chartRef: SVGAElement;
  title: string;
  chartWidth: number;
  marginTop: number;
}

const ChartTitle = ({ chartRef, title, chartWidth, marginTop }: IChartTitle) => {
  useEffect(() => {
    d3.select(chartRef)
      .select('.chart-title')
      .attr('x', chartWidth / 2)
      .attr('y', marginTop / 5 - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', 'black');
  }, [chartRef, chartWidth, marginTop]);

  return <text className="chart-title">{title}</text>;
};

export default ChartTitle;
