import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { getSettingByQuery } from '../../redux/reducers/setttings';
import { ISettingsState } from '../../shared/models/settings';
import { LINE_CHART, REPORTS_CONFIGURATION } from '../../shared/constants/data-visualization-configuration';
import { IDataVisualizationConfigurationState, IReportConfiguration } from '../../shared/models/data-visualization';
import { initialUpdateReportsConfiguration, getReports } from '../../redux/reducers/data-visualization-configuration';
import '../Inputs.scss';
import './DataVisualization.scss';

interface IStore {
  settings: ISettingsState;
  reports: IDataVisualizationConfigurationState;
}

const DataVisualization = ({
  configurationSetting,
  loading,
  initialUpdate,
  reportsConfiguration,
  reportsList,
  errorMessage,
  getReports,
  getSettingByQuery,
  initialUpdateReportsConfiguration
}: StateProps & DispatchProps) => {
  const [activeTab, setActiveTab] = useState('0');

  useEffect(() => {
    getSettingByQuery(REPORTS_CONFIGURATION);
  }, [getSettingByQuery]);

  useEffect(() => {
    if (!loading && configurationSetting.length && !initialUpdate) initialUpdateReportsConfiguration(configurationSetting);
  }, [loading, configurationSetting, initialUpdate, initialUpdateReportsConfiguration]);

  useEffect(() => {
    if (initialUpdate && !reportsList.length) {
      const configuredReportsUuidList = reportsConfiguration.map(({ uuid }) => uuid);

      getReports(configuredReportsUuidList);
    }
  }, [initialUpdate, reportsList, reportsConfiguration, getReports]);

  const navItems = configurationSetting.map((config: IReportConfiguration, idx: number) => {
    return (
      <NavItem key={`${config.uuid}-${idx}`}>
        <NavLink className={cx({ active: activeTab === `${idx}` })} onClick={() => setActiveTab(`${idx}`)}>
          {config.title}
        </NavLink>
      </NavItem>
    );
  });

  const tabPanes = configurationSetting.map((config: IReportConfiguration, idx: number) => {
    const { uuid, chartType } = config;
    const reportData = reportsList.find(({ uuid: reportUuid }) => reportUuid === uuid)?.reportData;
    let chartComponent;

    switch (chartType) {
      case LINE_CHART:
        chartComponent = <LineChart report={reportData} config={config} chartIdx={idx} isActive={activeTab === `${idx}`} />;
        break;
      default:
        chartComponent = <BarChart report={reportData} config={config} isActive={activeTab === `${idx}`} />;
        break;
    }

    return (
      <TabPane key={`${uuid}-${idx}`} tabId={`${idx}`}>
        {chartComponent}
      </TabPane>
    );
  });

  return (
    <div className="data-visualization">
      <FormattedMessage id="dataVisualization.title" tagName="h1" />
      {errorMessage ? (
        <div className="error">{errorMessage}</div>
      ) : loading && !reportsList.length ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <Nav tabs>{navItems}</Nav>
          <TabContent activeTab={activeTab}>{tabPanes}</TabContent>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  settings: { setting, loading },
  reports: { initialUpdate, reportsConfiguration, reportsList, errorMessage }
}: IStore) => ({
  loading,
  configurationSetting: setting?.value ? JSON.parse(setting.value) : [],
  initialUpdate,
  reportsConfiguration,
  reportsList,
  errorMessage
});

const mapDispatchToProps = {
  getReports,
  getSettingByQuery,
  initialUpdateReportsConfiguration
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataVisualization);
