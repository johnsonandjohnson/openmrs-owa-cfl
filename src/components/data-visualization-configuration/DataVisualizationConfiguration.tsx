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
import DataVisualizationConfigurationBlock from './DataVisualizationConfigurationBlock';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Spinner } from 'reactstrap';
import { getSettingByQuery, getSettings, createSetting, updateSetting } from '../../redux/reducers/setttings';
import {
  getReports,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors
} from '../../redux/reducers/data-visualization-configuration';
import {
  REPORTS_UUID_LIST,
  RETURN_LOCATION,
  REPORTS_CONFIGURATION,
  CHART_DESCRIPTION_KEY
} from '../../shared/constants/data-visualization-configuration';
import { IDataVisualizationConfigurationState } from '../../shared/models/data-visualization';
import { ISettingsState } from '../../shared/models/settings';
import { omit } from 'lodash';
import { EMPTY_STRING } from 'src/shared/constants/input';
import { errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import '../Inputs.scss';

interface IStore {
  settings: ISettingsState;
  reports: IDataVisualizationConfigurationState;
}

const DataVisualizationConfiguration = ({
  reportsUuidList,
  reportsConfiguration,
  reportsList,
  loading,
  getAllReports,
  isConfigurationExist,
  settingUuid,
  configurationSetting,
  initialUpdate,
  success,
  getSettingByQuery,
  getSettings,
  getReports,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors,
  updateSetting,
  createSetting
}: StateProps & DispatchProps) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    getSettingByQuery(REPORTS_CONFIGURATION);
    getSettings(REPORTS_UUID_LIST);
  }, [getSettingByQuery, getSettings]);

  useEffect(() => {
    if (reportsUuidList?.length && !loading && !getAllReports) {
      getReports(reportsUuidList);
    }
  }, [reportsUuidList, loading, getAllReports, getReports]);

  useEffect(() => {
    if (configurationSetting.length && !loading && getAllReports && !initialUpdate) {
      initialUpdateReportsConfiguration(configurationSetting);
    }
  }, [configurationSetting, getAllReports, initialUpdate, loading, initialUpdateReportsConfiguration]);

  useEffect(() => {
    success && onReturn();
  }, [success]);

  const onReturn = () => (window.location.href = RETURN_LOCATION);

  const onSave = () => {
    let showValidationErrors = false;

    reportsConfiguration.forEach(report => {
      const omittedOptional = omit(report, [CHART_DESCRIPTION_KEY]);

      Object.keys(omittedOptional).forEach(key => {
        if (omittedOptional[key] === EMPTY_STRING) {
          showValidationErrors = true;
        }
      });
    });

    setShowValidationErrors(showValidationErrors);

    if (showValidationErrors) {
      return errorToast(formatMessage({ id: 'dataVisualizationConfiguration.configurationNotSaved' }));
    }

    if (isConfigurationExist) {
      const dataToSave = {
        uuid: settingUuid,
        value: JSON.stringify(reportsConfiguration)
      };
      updateSetting(dataToSave);
    } else {
      createSetting(REPORTS_CONFIGURATION, JSON.stringify(reportsConfiguration));
    }
  };

  return (
    <div className="data-visualization-configuration">
      <FormattedMessage id="dataVisualizationConfiguration.title" tagName="h1" />
      {!getAllReports ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <div className="inner-content">
          {reportsConfiguration.map((reportConfig, idx) => {
            const currentReportData = reportsList.find(({ uuid }) => reportConfig.uuid === uuid);

            return (
              <DataVisualizationConfigurationBlock
                key={`${reportConfig?.uuid}-${idx}`}
                reportIdx={idx}
                reportConfig={reportConfig}
                reportData={currentReportData}
              />
            );
          })}
          <div className="d-flex justify-content-end mt-4 mb-2">
            <Button className="btn btn-primary" onClick={addReportConfigurationBlock}>
              <FormattedMessage id="dataVisualizationConfiguration.addNewReport" />
            </Button>
          </div>
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={onReturn}>
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSave}>
                <FormattedMessage id="common.save" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({
  settings: {
    settings,
    setting,
    loading: settingLoading,
    isSettingExist: { value: isConfigurationExist },
    success
  },
  reports: {
    reportsList,
    loading: reportsLoading,
    reportsConfiguration,
    success: { getAllReports },
    initialUpdate
  }
}: IStore) => ({
  loading: settingLoading || reportsLoading,
  reportsUuidList: settings[0]?.value ? JSON.parse(settings[0].value) : [],
  reportsList,
  reportsConfiguration,
  getAllReports,
  settings,
  isConfigurationExist,
  settingUuid: setting?.uuid,
  configurationSetting: setting?.value ? JSON.parse(setting.value) : [],
  initialUpdate,
  success
});

const mapDispatchToProps = {
  getSettingByQuery,
  getSettings,
  getReports,
  addReportConfigurationBlock,
  initialUpdateReportsConfiguration,
  setShowValidationErrors,
  updateSetting,
  createSetting
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataVisualizationConfiguration);
