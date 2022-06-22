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
import { select } from 'd3';
import { IGroupedAndSummedDataByLegend, IGroupedAndSummedDataByXAxis } from '../../shared/models/data-visualization';

interface IBars {
  chartRef: SVGAElement;
  dataToDisplay: IGroupedAndSummedDataByXAxis[];
  xScale: d3.ScaleTime<number, number, never> | (string[] & d3.ScaleBand<number | string>);
  yScale: d3.ScaleLinear<number, number, never>;
  xSubgroup: d3.ScaleBand<string>;
  colors: d3.ScaleOrdinal<string, string, never>;
  chartHeight: number;
}

const Bars = ({ chartRef, dataToDisplay, xScale, xSubgroup, yScale, colors, chartHeight }: IBars) => {
  useEffect(() => {
    if (chartHeight) {
      const selection = select(chartRef)
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
        .attr('y', (d: IGroupedAndSummedDataByLegend) => yScale(d.legendSum))
        .attr('height', (d: IGroupedAndSummedDataByLegend) => yScale(0) - yScale(d.legendSum))
        .style('fill', (d: IGroupedAndSummedDataByLegend) => colors(d.legendKey));
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
