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
import { select, axisBottom, timeFormat } from 'd3';
import { IGroupedAndSummedDataByXAxis } from '../../shared/models/data-visualization';
import { BAR_CHART } from '../../shared/constants/data-visualization-configuration';

interface IXScale {
  chartRef: SVGAElement;
  xScale: any;
  chartHeight: number;
  chartType: string;
  data?: IGroupedAndSummedDataByXAxis[];
}

const XScale = ({ chartRef, xScale, chartHeight, chartType, data = [] }: IXScale) => {
  useEffect(() => {
    if (chartHeight) {
      const xScaleSelection = select(chartRef).select('.xScale').attr('transform', `translate(0, ${chartHeight})`);

      if (chartType === BAR_CHART) {
        xScaleSelection.call(
          //@ts-ignore
          axisBottom(xScale)
            .tickFormat((i: number) => data[i].xAxisKey)
            .tickSizeOuter(0)
        );
      } else {
        //@ts-ignore
        xScaleSelection.call(axisBottom(xScale).tickFormat(timeFormat('%d-%m-%Y')));
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
