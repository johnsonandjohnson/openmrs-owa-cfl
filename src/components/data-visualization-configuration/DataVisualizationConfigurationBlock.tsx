import React from 'react';
import { connect } from 'react-redux';
import ExpandableSection from '../common/expandable-section/ExpandableSection';
import { removeReport } from '../../redux/reducers/data-visualization-configuration';
import DataVisualizationConfigurationBody from './DataVisualizationConfigurationBody';
import DataVisualizationConfigurationHeader from './DataVisualizationConfigurationHeader';
import { IReportConfiguration, IReportList } from '../../shared/models/data-visualization';

interface IReportConfigurationBlockProps extends DispatchProps {
  reportConfig: IReportConfiguration;
  reportData: IReportList;
  reportIdx: number;
}

const DataVisualizationConfigurationBlock = ({ reportConfig, reportData, reportIdx, removeReport }: IReportConfigurationBlockProps) => {
  return (
    <div className="section">
      <ExpandableSection
        headerComponent={<DataVisualizationConfigurationHeader reportConfig={reportConfig} />}
        bodyComponent={<DataVisualizationConfigurationBody reportConfig={reportConfig} reportData={reportData} reportIdx={reportIdx} />}
        isRemovable={true}
        onRemove={() => removeReport(reportIdx)}
      />
    </div>
  );
};

const mapDispatchToProps = { removeReport };

type DispatchProps = typeof mapDispatchToProps;

export default connect(null, mapDispatchToProps)(DataVisualizationConfigurationBlock);
