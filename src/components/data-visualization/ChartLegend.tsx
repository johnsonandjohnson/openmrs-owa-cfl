import React, { useEffect } from 'react';
import cx from 'classnames';
import * as d3 from 'd3';

interface IChartLegend {
  chartRef: SVGAElement;
  legendTypes: string[];
  handleLegendClick: (value: string) => void;
  filterByLegend: string[];
  colors: d3.ScaleOrdinal<string, string, never>;
  chartWidth: number;
  marginLeft: number;
  marginRight: number;
}

const ChartLegend = ({
  legendTypes,
  filterByLegend,
  handleLegendClick,
  colors,
  chartWidth,
  chartRef,
  marginLeft,
  marginRight
}: IChartLegend) => {
  useEffect(() => {
    if (chartWidth) {
      const legend = d3
        .select(chartRef)
        .selectAll('.legend')
        .data(legendTypes)
        .attr('transform', (_, i) => `translate(${marginLeft + marginRight}, ${i * 20 + 5})`)
        .style('cursor', 'pointer');

      legend
        .selectChild('.rect-legend')
        .attr('x', chartWidth - 18)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', colors);

      legend
        .selectChild('.text-legend')
        .attr('x', chartWidth - 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(legendType => `${legendType}`);
    }
  }, [chartRef, chartWidth, colors, legendTypes, marginLeft, marginRight]);

  return (
    <g className="legends">
      {legendTypes.map(legend => (
        <g className={cx('legend', { active: filterByLegend.includes(legend) })} key={legend} onClick={() => handleLegendClick(legend)}>
          <rect className="rect-legend" />
          <text className="text-legend" />
        </g>
      ))}
    </g>
  );
};

export default ChartLegend;
