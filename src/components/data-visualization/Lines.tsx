/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useEffect } from 'react';
import { line, sum, select } from 'd3';

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
      const selection = select(chartRef)
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
          line()
            //@ts-ignore
            .x(datum => xScale(new Date(datum[xAxis])))
            .y((_, idx, b) => {
              const agg = b.slice(0, idx + 1);
              const total = sum(agg, datum => datum[yAxis]);

              return yScale(total);
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
