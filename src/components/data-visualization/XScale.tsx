import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { IGroupedDataByXAxis } from '../../shared/models/data-visualization';

interface IXScale {
  chartRef: SVGAElement;
  xScale: (Date[] & d3.ScaleTime<number, number, never>) | (string[] & d3.ScaleBand<string>);
  chartHeight: number;
  chartType: string;
  data?: IGroupedDataByXAxis[];
}

const XScale = ({ chartRef, xScale, chartHeight, chartType, data = [] }: IXScale) => {
  useEffect(() => {
    if (chartHeight) {
      const xScaleSelection = d3.select(chartRef).select('.xScale').attr('transform', `translate(0, ${chartHeight})`);

      if (chartType === 'Bar Chart') {
        xScaleSelection.call(
          d3
            .axisBottom(xScale)
            .tickFormat(i => data[i].xAxisKey)
            .tickSizeOuter(0)
        );
      } else {
        xScaleSelection.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%d-%m-%Y')));
      }

      xScaleSelection
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');
    }
  }, [chartHeight, chartRef, chartType, data, xScale]);

  return <g className="xScale" />;
};

export default XScale;
