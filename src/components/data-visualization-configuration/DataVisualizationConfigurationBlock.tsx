/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
