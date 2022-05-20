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
