import React from 'react';
import { FormattedMessage } from 'react-intl';

interface IChartDescription {
  description: string;
}

const ChartDescription = ({ description }: IChartDescription) => (
  <div className="chart-description">
    <FormattedMessage id="dataVisualizationConfiguration.chart.description" tagName="h5" />
    <p>{description}</p>
  </div>
);

export default ChartDescription;
