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
import { select, axisLeft } from 'd3';

interface IYScale {
  chartRef: SVGAElement;
  yScale: d3.ScaleLinear<number, number, never>;
  chartWidth: number;
  marginLeft: number;
}

const YScale = ({ chartRef, yScale, chartWidth, marginLeft }: IYScale) => {
  useEffect(() => {
    if (chartWidth) {
      select(chartRef)
        .select('.yScale')
        .attr('transform', `translate(${marginLeft},0)`)
        //@ts-ignore
        .call(axisLeft(yScale))
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
