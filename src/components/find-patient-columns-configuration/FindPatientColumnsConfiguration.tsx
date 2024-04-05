/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { useCallback, useEffect, useState } from "react";
import ColumnRow from "./ColumnRow";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl, IntlShape } from "react-intl";
import { Button, Spinner } from "reactstrap";
import { uniqWith, isEqual, cloneDeep } from "lodash";
import { setAllPossibleColumns, setColumnsConfiguration } from "../../redux/reducers/columns-configuration";
import { createSetting, getSettingByQuery, updateSetting } from "../../redux/reducers/settings";
import { IRegistrationStep } from "../../shared/models/registration-steps";
import {
  ADJACENT_LOWER_AND_UPPER_LETTERS_REGEX,
  COLUMNS_CONFIGURATION_SETTING_KEY,
  FIRST_COLUMN_NAME_LETTERS_REGEX,
  FIXED_COLUMNS,
  RETURN_LOCATION,
} from "../../shared/constants/columns-configuration";
import { IColumnConfiguration } from "../../shared/models/columns-configuration";
import { EMPTY_STRING } from "../../shared/constants/input";
import { ConfirmationModal } from "../common/form/ConfirmationModal";
import { successToast, errorToast } from "../toast-handler/toast-handler";
import "../Inputs.scss";
import "./FindPatientColumnsConfiguration.scss";
import { addBreadcrumbs } from "src/redux/reducers/breadcrumbs";
import {
  CONFIGURE_METADATA_BREADCRUMB_ELEMENT,
  SYSTEM_ADMINISTRATION_BREADCRUMB_ELEMENT,
} from "src/shared/constants/breadcrumbs";

interface IStore {
  apps: {
    loading: boolean;
    patientRegistrationSteps: IRegistrationStep[];
  };
  findPatientColumnsConfiguration: {
    columnsConfiguration: IColumnConfiguration[];
  };
  settings: {
    success: boolean;
    isSettingExist: { value: boolean };
    setting: {
      uuid: string;
      value: string;
    } | null;
  };
}

interface IFindPatientColumnsConfigurationProps extends StateProps, DispatchProps {
  intl: IntlShape;
}

const FindPatientColumnsConfiguration = ({
  intl: { formatMessage },
  isAppLoading,
  patientRegistrationSteps,
  columnsConfiguration,
  isSettingExist,
  settingUuid,
  settingValue,
  settingsSaved,
  setAllPossibleColumns,
  setColumnsConfiguration,
  getSettingByQuery,
  createSetting,
  updateSetting,
  addBreadcrumbs,
}: IFindPatientColumnsConfigurationProps) => {
  useEffect(() => {
    addBreadcrumbs([SYSTEM_ADMINISTRATION_BREADCRUMB_ELEMENT, CONFIGURE_METADATA_BREADCRUMB_ELEMENT]);
  }, []);

  useEffect(() => {
    getSettingByQuery(COLUMNS_CONFIGURATION_SETTING_KEY);
  }, [getSettingByQuery]);

  useEffect(() => {
    settingValue && setColumnsConfiguration(JSON.parse(settingValue));
  }, [setColumnsConfiguration, settingValue]);

  useEffect(() => {
    settingsSaved && successToast(formatMessage({ id: "findPatientColumnsConfiguration.configurationSaved" }));
  }, [formatMessage, settingsSaved]);

  useEffect(() => {
    if (patientRegistrationSteps) {
      const columns = [...FIXED_COLUMNS];

      patientRegistrationSteps.map(({ fields }) =>
        fields.forEach(({ name: fieldName }) => {
          if (fieldName) {
            const capitalizedFirstColumnNameLetter = fieldName.replace(
              FIRST_COLUMN_NAME_LETTERS_REGEX,
              (str) => str.charAt(0).toUpperCase() + str.substring(1),
            );
            const name = capitalizedFirstColumnNameLetter.replace(ADJACENT_LOWER_AND_UPPER_LETTERS_REGEX, "$1 $2");

            columns.push({ label: name, value: fieldName });
          }
        }),
      );

      setAllPossibleColumns(uniqWith(columns, isEqual));
    }
  }, [patientRegistrationSteps, setAllPossibleColumns]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onReturnHandler = useCallback(() => (window.location.href = RETURN_LOCATION), []);
  const onSaveHandler = useCallback(() => setIsModalOpen(true), []);
  const markConfigurationAsInvalid = useCallback(() => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);

    clonedColumnsConfiguration[0].isValid = false;

    errorToast(formatMessage({ id: "findPatientColumnsConfiguration.configurationNotSaved" }));
    setColumnsConfiguration(clonedColumnsConfiguration);
    setIsModalOpen(false);
  }, [columnsConfiguration, formatMessage, setColumnsConfiguration]);
  const onNoHandler = useCallback(() => setIsModalOpen(false), []);
  const onYesHandler = useCallback(() => {
    const omittedEmptyColumnsConfiguration = columnsConfiguration.filter(({ value }) => value);

    if (!omittedEmptyColumnsConfiguration.length) {
      return markConfigurationAsInvalid();
    }

    const config = omittedEmptyColumnsConfiguration.map((column) => ({ label: column.label, value: column.value }));
    const configJson = JSON.stringify(config);

    if (isSettingExist) {
      updateSetting({ uuid: settingUuid, value: configJson });
    } else {
      createSetting(COLUMNS_CONFIGURATION_SETTING_KEY, configJson);
    }

    setIsModalOpen(false);
  }, [columnsConfiguration, createSetting, isSettingExist, settingUuid, updateSetting, markConfigurationAsInvalid]);

  return (
    <div id="find-patient-columns-configuration" data-testid="findPatientColumnsConfiguration">
      <ConfirmationModal
        header={{ id: "findPatientColumnsConfiguration.modal.header" }}
        body={{ id: "findPatientColumnsConfiguration.modal.body" }}
        onYes={onYesHandler}
        onNo={onNoHandler}
        isOpen={isModalOpen}
      />
      <div className="title">
        <FormattedMessage id="findPatientColumnsConfiguration.title" tagName="h2" />
      </div>
      {isAppLoading ? (
        <div className="spinner" data-testid="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="section">
            <div className="title">
              <FormattedMessage id="findPatientColumnsConfiguration.configureColumns" tagName="h4" />
            </div>
            <div className="columns">
              {columnsConfiguration.map((column, idx) => (
                <ColumnRow key={`${column.value}-${idx}`} column={column} columnIdx={idx} />
              ))}
            </div>
          </div>
          <div className="mt-5 pb-5">
            <div className="d-inline">
              <Button className="cancel" onClick={onReturnHandler} data-testid="returnButton">
                <FormattedMessage id="common.cancel" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSaveHandler} data-testid="saveButton">
                <FormattedMessage id="common.confirm" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = ({
  apps: { loading: isAppLoading, patientRegistrationSteps },
  findPatientColumnsConfiguration: { columnsConfiguration },
  settings: {
    success: settingsSaved,
    isSettingExist: { value: isSettingExist },
    setting,
  },
}: IStore) => ({
  isAppLoading,
  settingsSaved,
  patientRegistrationSteps,
  columnsConfiguration,
  isSettingExist,
  settingUuid: setting?.uuid ?? EMPTY_STRING,
  settingValue: setting?.value ?? EMPTY_STRING,
});

const mapDispatchToProps = {
  setAllPossibleColumns,
  setColumnsConfiguration,
  getSettingByQuery,
  createSetting,
  updateSetting,
  addBreadcrumbs,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FindPatientColumnsConfiguration));
