import React from 'react';
import ValidationError from '../common/form/ValidationError';
import cx from 'classnames';
import { connect } from 'react-redux';
import { SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../shared/util/form-util';
import { useIntl } from 'react-intl';
import { differenceBy } from 'lodash';
import { updateReportsConfiguration, removeReport } from '../../redux/reducers/data-visualization-configuration';
import { DEFAULT_REPORT_CONFIGURATION } from '../../shared/constants/data-visualization-configuration';
import { IReportConfiguration, IReportList, IReportsOptions } from '../../shared/models/data-visualization';

interface IStore {
  reports: {
    reportsList: IReportList[];
    reportsConfiguration: IReportConfiguration[];
    showValidationErrors: boolean;
  };
}

interface IDataVisualizationConfigurationHeader extends StateProps, DispatchProps {
  reportConfig: IReportConfiguration;
}

const DataVisualizationConfigurationHeader = ({
  reportConfig,
  reportsList,
  reportsConfiguration,
  showValidationErrors,
  updateReportsConfiguration
}: IDataVisualizationConfigurationHeader) => {
  const { formatMessage } = useIntl();
  const unusedReportsUuid = differenceBy(reportsList, reportsConfiguration, 'uuid') as IReportList[];
  const reportsOptions = unusedReportsUuid.map(({ uuid, name, description }) => ({ label: name, value: uuid, description }));

  const handleReportOnChange = ({ label, value, description }: IReportsOptions) => {
    const updatedReportsConfiguration = reportsConfiguration.map(report =>
      report.uuid === reportConfig?.uuid
        ? {
            ...DEFAULT_REPORT_CONFIGURATION,
            uuid: value,
            title: label,
            name: label,
            description
          }
        : report
    );

    updateReportsConfiguration(updatedReportsConfiguration);
  };

  return (
    <div className="input-container">
      <SelectWithPlaceholder
        showPlaceholder={!!reportConfig.uuid}
        placeholder={formatMessage({ id: 'dataVisualizationConfiguration.report' })}
        options={reportsOptions}
        onChange={handleReportOnChange}
        theme={selectDefaultTheme}
        wrapperClassName={cx({ invalid: showValidationErrors && !reportConfig.uuid })}
        classNamePrefix="default-select"
        value={reportConfig.uuid ? { label: reportConfig.name, value: reportConfig.uuid } : null}
      />
      {showValidationErrors && !reportConfig.uuid && <ValidationError message="common.error.required" />}
    </div>
  );
};

const mapStateToProps = ({ reports: { reportsList, reportsConfiguration, showValidationErrors } }: IStore) => ({
  reportsList,
  reportsConfiguration,
  showValidationErrors
});

const mapDispatchToProps = {
  updateReportsConfiguration,
  removeReport
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataVisualizationConfigurationHeader);
