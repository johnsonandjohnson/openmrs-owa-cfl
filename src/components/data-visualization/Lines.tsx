import React, { useEffect } from 'react';
import * as d3 from 'd3';

interface ILines {
  chartRef: SVGAElement;
  filterByLegend: string[];
  groupedByLegend: any;
  chartWidth: number;
  colors: d3.ScaleOrdinal<string, string, never>;
  xScale: d3.ScaleTime<number, number, never> | d3.ScaleBand<string>;
  yScale: d3.ScaleLinear<number, number, never>;
  xAxis: string;
  yAxis: string;
}

const Lines = ({ chartRef, filterByLegend, groupedByLegend, chartWidth, colors, xScale, yScale, xAxis, yAxis }: ILines) => {
  useEffect(() => {
    if (chartWidth) {
      const selection = d3
        .select(chartRef)
        .selectAll('.line')
        .data(groupedByLegend)
        .attr('fill', 'none')
        .attr('stroke', d => colors(d[0]))
        .attr('stroke-width', 0);

      selection
        .data(groupedByLegend)
        .transition()
        .delay((_, i) => i * 100)
        .attr('fill', 'none')
        .attr('stroke', d => colors(d[0]))
        .attr('stroke-width', 2)
        .attr('d', d =>
          d3
            .line()
            //@ts-ignore
            .x(d => xScale(new Date(d[xAxis])))
            .y((_, idx, b) => {
              const agg = b.slice(0, idx + 1);
              const sum = d3.sum(agg, d => d[yAxis]);

              return yScale(sum);
            })(d[1])
        );
    }
  }, [chartRef, chartWidth, colors, filterByLegend, groupedByLegend, xAxis, xScale, yAxis, yScale]);

  return (
    <g className="lines">
      {filterByLegend.map(line => (
        <path key={line} className="line" />
      ))}
    </g>
  );
};

export default Lines;
