/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { ChangeEvent } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import { difference } from 'lodash';
import { updateReportsConfiguration, removeReport } from '../../redux/reducers/data-visualization-configuration';
import { ZERO } from '../../shared/constants/input';
import { SelectWithPlaceholder, InputWithPlaceholder, TextareaAutosizeWithPlaceholder } from '../common/form/withPlaceholder';
import { selectDefaultTheme } from '../../shared/util/form-util';
import {
  CHART_TITLE_KEY,
  CHART_TYPE_KEY,
  CHART_X_AXIS_KEY,
  CHART_Y_AXIS_KEY,
  CHART_LEGEND_KEY,
  CHART_DESCRIPTION_KEY,
  CHART_MARGIN_TOP_KEY,
  CHART_MARGIN_BOTTOM_KEY,
  CHART_MARGIN_RIGHT_KEY,
  CHART_MARGIN_LEFT_KEY,
  CHART_COLORS_KEY,
  CHART_TYPE_OPTIONS
} from '../../shared/constants/data-visualization-configuration';
import { IReportConfiguration, IReportList } from '../../shared/models/data-visualization';
import { IOption } from 'src/shared/models/option';
import ValidationError from '../common/form/ValidationError';

interface IStore {
  reports: {
    reportsConfiguration: IReportConfiguration[];
    showValidationErrors: boolean;
  };
}

interface IDataVisualizationConfigurationBody extends StateProps, DispatchProps {
  reportConfig: IReportConfiguration;
  reportData: IReportList;
  reportIdx: number;
}

const DataVisualizationConfigurationBody = ({
  reportData,
  reportConfig,
  reportsConfiguration,
  showValidationErrors
}: IDataVisualizationConfigurationBody) => {
  const { formatMessage } = useIntl();
  const { title, description, marginTop, marginBottom, marginRight, marginLeft, colors, xAxis, yAxis, legend } = reportConfig;

  const getOptions = () => {
    const { columns = [] } = reportData || {};
    const usedOptions = [xAxis, yAxis, legend].filter(Boolean);
    const unusedOptions = difference(columns, usedOptions) as IOption[] | [];

    return unusedOptions.map(option => ({ label: option, value: option }));
  };

  const getValue = (value: string) => {
    const option = reportConfig[value];

    return option ? { label: option, value: option } : null;
  };

  const handleOptionOnChange = (selectValue: IOption, selectOption: { name: string }) => {
    const key = selectOption?.name;
    const value = selectValue?.value;

    updateConfiguration(key, value);
  };

  const handleInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.name;
    const eventValue = event?.target?.value;
    const keys = [CHART_MARGIN_TOP_KEY, CHART_MARGIN_BOTTOM_KEY, CHART_MARGIN_RIGHT_KEY, CHART_MARGIN_LEFT_KEY];
    const value = keys.includes(key) ? Number(eventValue) : eventValue;

    updateConfiguration(key, value);
  };

  const updateConfiguration = (key: string, value: string | number) => {
    const updatedReportsConfiguration = reportsConfiguration.map(report =>
      report.uuid === reportConfig?.uuid
        ? {
            ...report,
            [key]: value
          }
        : report
    );

    updateReportsConfiguration(updatedReportsConfiguration);
  };

  return (
    <>
      <div className="inline-fields">
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.title' })}
            showPlaceholder={!!title}
            className={cx({ invalid: showValidationErrors && !title })}
            defaultValue={title}
            name={CHART_TITLE_KEY}
            onBlur={handleInputOnChange}
          />
          {showValidationErrors && !title && <ValidationError message="common.error.required" />}
        </div>
        <div className="input-container">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.type' })}
            showPlaceholder={!!getValue(CHART_TYPE_KEY)}
            options={CHART_TYPE_OPTIONS}
            value={getValue(CHART_TYPE_KEY)}
            onChange={handleOptionOnChange}
            theme={selectDefaultTheme}
            name={CHART_TYPE_KEY}
            wrapperClassName={cx({ invalid: showValidationErrors && !getValue(CHART_TYPE_KEY) })}
            classNamePrefix="default-select"
          />
          {showValidationErrors && !getValue(CHART_TYPE_KEY) && <ValidationError message="common.error.required" />}
        </div>
      </div>
      <div className="inline-fields">
        <div className="input-container">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.xAxis' })}
            showPlaceholder={!!getValue(CHART_X_AXIS_KEY)}
            options={getOptions()}
            value={getValue(CHART_X_AXIS_KEY)}
            onChange={handleOptionOnChange}
            name={CHART_X_AXIS_KEY}
            wrapperClassName={cx({ invalid: showValidationErrors && !getValue(CHART_X_AXIS_KEY) })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
          {showValidationErrors && !getValue(CHART_X_AXIS_KEY) && <ValidationError message="common.error.required" />}
        </div>
        <div className="input-container">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.yAxis' })}
            showPlaceholder={!!getValue(CHART_Y_AXIS_KEY)}
            options={getOptions()}
            onChange={handleOptionOnChange}
            value={getValue(CHART_Y_AXIS_KEY)}
            name={CHART_Y_AXIS_KEY}
            wrapperClassName={cx({ invalid: showValidationErrors && !getValue(CHART_Y_AXIS_KEY) })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
          {showValidationErrors && !getValue(CHART_Y_AXIS_KEY) && <ValidationError message="common.error.required" />}
        </div>
      </div>
      <div className="inline-fields">
        <div className="input-container">
          <SelectWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.legend' })}
            showPlaceholder={!!getValue(CHART_LEGEND_KEY)}
            options={getOptions()}
            onChange={handleOptionOnChange}
            value={getValue(CHART_LEGEND_KEY)}
            name={CHART_LEGEND_KEY}
            wrapperClassName={cx({ invalid: showValidationErrors && !getValue(CHART_LEGEND_KEY) })}
            classNamePrefix="default-select"
            theme={selectDefaultTheme}
          />
          {showValidationErrors && !getValue(CHART_LEGEND_KEY) && <ValidationError message="common.error.required" />}
        </div>
        <div className="input-container">
          <TextareaAutosizeWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.description' })}
            showPlaceholder={!!getValue(CHART_DESCRIPTION_KEY)}
            onBlur={handleInputOnChange}
            defaultValue={description}
            name={CHART_DESCRIPTION_KEY}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <div className="inline-fields">
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.marginTop' })}
            showPlaceholder
            value={marginTop}
            type="number"
            min={ZERO}
            onChange={handleInputOnChange}
            name={CHART_MARGIN_TOP_KEY}
          />
        </div>
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.marginBottom' })}
            showPlaceholder
            value={marginBottom}
            type="number"
            min={ZERO}
            onChange={handleInputOnChange}
            name={CHART_MARGIN_BOTTOM_KEY}
          />
        </div>
      </div>
      <div className="inline-fields">
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.marginRight' })}
            showPlaceholder
            value={marginRight}
            type="number"
            min={ZERO}
            onChange={handleInputOnChange}
            name={CHART_MARGIN_RIGHT_KEY}
          />
        </div>
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.marginLeft' })}
            showPlaceholder
            value={marginLeft}
            type="number"
            min={ZERO}
            onChange={handleInputOnChange}
            name={CHART_MARGIN_LEFT_KEY}
          />
        </div>
      </div>
      <div className="inline-fields">
        <div className="input-container">
          <InputWithPlaceholder
            placeholder={formatMessage({ id: 'dataVisualizationConfiguration.chart.colors' })}
            showPlaceholder={!!colors}
            defaultValue={colors}
            className={cx({ invalid: showValidationErrors && !colors })}
            type="text"
            onBlur={handleInputOnChange}
            name={CHART_COLORS_KEY}
          />
          {showValidationErrors && !colors && <ValidationError message="common.error.required" />}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ reports: { reportsConfiguration, showValidationErrors } }: IStore) => ({
  reportsConfiguration,
  showValidationErrors
});

const mapDispatchToProps = {
  updateReportsConfiguration,
  removeReport
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(DataVisualizationConfigurationBody);
