import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { IGroupedDataByLegend, IGroupedDataByXAxis } from '../../shared/models/data-visualization';

interface IBars {
  chartRef: SVGAElement;
  dataToDisplay: IGroupedDataByXAxis[];
  xScale: d3.ScaleTime<number, number, never> | (string[] & d3.ScaleBand<string>);
  yScale: d3.ScaleLinear<number, number, never>;
  xSubgroup: d3.ScaleBand<string>;
  colors: d3.ScaleOrdinal<string, string, never>;
  chartHeight: number;
}

const Bars = ({ chartRef, dataToDisplay, xScale, xSubgroup, yScale, colors, chartHeight }: IBars) => {
  useEffect(() => {
    if (chartHeight) {
      const selection = d3
        .select(chartRef)
        .selectAll('g.xAxisKey')
        .data(dataToDisplay)
        .attr('transform', (_, idx) => `translate(${xScale(idx)},0)`);

      selection
        .selectAll('.bar')
        .data(({ legendData }) => legendData.map(key => key))
        .attr('x', d => xSubgroup(d.legendKey))
        .attr('y', () => yScale(0))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', 0);

      selection
        .selectAll('.bar-value')
        .data(({ legendData }) => legendData.map(key => key))
        .attr('x', d => xSubgroup(d.legendKey) + xSubgroup.bandwidth() / 2)
        .attr('y', d => yScale(d.legendSum) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.legendSum);

      selection
        .selectAll('.bar')
        .transition()
        .delay((_, i) => i * 100)
        .duration(500)
        .attr('y', (d: IGroupedDataByLegend) => yScale(d.legendSum))
        .attr('height', (d: IGroupedDataByLegend) => yScale(0) - yScale(d.legendSum))
        .style('fill', (d: IGroupedDataByLegend) => colors(d.legendKey));
    }
  }, [chartHeight, chartRef, colors, dataToDisplay, xScale, xSubgroup, yScale]);

  return (
    <g className="bars">
      {dataToDisplay.map(({ xAxisKey, legendData }) => (
        <g className="xAxisKey" key={xAxisKey}>
          {legendData.map(({ legendKey }) => (
            <g key={legendKey}>
              <rect className="bar" />
              <text className="bar-value" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
};

export default Bars;
