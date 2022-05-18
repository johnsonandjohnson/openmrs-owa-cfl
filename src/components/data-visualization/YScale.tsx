import React, { useEffect } from 'react';
import * as d3 from 'd3';

interface IYScale {
  chartRef: SVGAElement;
  yScale: d3.ScaleLinear<number, number, never>;
  chartWidth: number;
  marginLeft: number;
}

const YScale = ({ chartRef, yScale, chartWidth, marginLeft }: IYScale) => {
  useEffect(() => {
    if (chartWidth) {
      d3.select(chartRef)
        .select('.yScale')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(d3.axisLeft(yScale))
        .call(g => g.selectAll('.tick .grid-line').remove())
        .call(g =>
          g
            .selectAll('.tick line')
            .clone()
            .attr('class', 'grid-line')
            .attr('x2', chartWidth - marginLeft)
            .attr('stroke-opacity', 0.1)
        );
    }
  }, [chartRef, chartWidth, marginLeft, yScale]);

  return <g className="yScale" />;
};

export default YScale;
