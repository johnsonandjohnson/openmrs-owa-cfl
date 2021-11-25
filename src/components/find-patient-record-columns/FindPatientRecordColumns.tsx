import React, { useCallback, useEffect, useState } from 'react';
import ColumnRow from './ColumnRow';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Button, Spinner } from 'reactstrap';
import { isNil, uniqWith, isEqual, cloneDeep } from 'lodash';
import { setAllPossibleColumns, setColumnsConfiguration } from '../../redux/reducers/columns-configuration';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { IRegistrationStep } from '../../shared/models/registration-steps';
import { COLUMNS_CONFIGURATION_SETTING_KEY, FIXED_COLUMNS, RETURN_LOCATION } from '../../shared/constants/columns-configuration';
import { IColumnConfiguration } from '../../shared/models/columns-configuration';
import { EMPTY_STRING } from '../../shared/constants/input';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import '../Inputs.scss';
import './FindPatientRecordColumns.scss';

interface IStore {
  apps: {
    loading: boolean;
    patientRegistrationSteps: IRegistrationStep[];
  };
  findPatientRecordColumns: {
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

interface IFindPatientRecordColumnsProps extends StateProps, DispatchProps {
  intl: IntlShape;
}

const FindPatientRecordColumns = ({
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
  updateSetting
}: IFindPatientRecordColumnsProps) => {
  useEffect(() => {
    getSettingByQuery(COLUMNS_CONFIGURATION_SETTING_KEY);
  }, [getSettingByQuery]);
  useEffect(() => {
    settingValue && setColumnsConfiguration(JSON.parse(settingValue));
  }, [setColumnsConfiguration, settingValue]);
  useEffect(() => {
    settingsSaved && successToast(formatMessage({ id: 'findPatientRecordColumns.configurationSaved' }));
  }, [formatMessage, settingsSaved]);
  useEffect(() => {
    if (!isNil(patientRegistrationSteps)) {
      const columns = [...FIXED_COLUMNS];

      patientRegistrationSteps.map(({ fields }) =>
        fields.map(({ name: fieldName }) => {
          if (!fieldName) {
            return false;
          }

          const name = fieldName.replace(/\w\S*/g, str => str.charAt(0).toUpperCase() + str.substr(1)).replace(/([a-z])([A-Z])/g, '$1 $2');

          return columns.push({ label: name, value: fieldName });
        })
      );

      setAllPossibleColumns(uniqWith(columns, isEqual));
    }
  }, [patientRegistrationSteps, setAllPossibleColumns]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onReturnHandler = useCallback(() => (window.location.href = RETURN_LOCATION), []);
  const onSaveHandler = useCallback(() => setIsModalOpen(true), []);
  const validationEmptyConfiguration = useCallback(() => {
    const clonedColumnsConfiguration = cloneDeep(columnsConfiguration);

    clonedColumnsConfiguration[0].isValid = false;

    errorToast(formatMessage({ id: 'findPatientRecordColumns.configurationNotSaved' }));
    setColumnsConfiguration(clonedColumnsConfiguration);
    setIsModalOpen(false);
  }, [columnsConfiguration, formatMessage, setColumnsConfiguration]);
  const onNoHandler = useCallback(() => setIsModalOpen(false), []);
  const onYesHandler = useCallback(() => {
    const omitEmptyColumnsConfiguration = columnsConfiguration.filter(({ value }) => value);

    if (!omitEmptyColumnsConfiguration.length) {
      return validationEmptyConfiguration();
    }

    const config = omitEmptyColumnsConfiguration.map(({ label, value }) => ({ label, value }));
    const configJson = JSON.stringify(config);

    if (isSettingExist) {
      updateSetting({ uuid: settingUuid, value: configJson });
    } else {
      createSetting(COLUMNS_CONFIGURATION_SETTING_KEY, configJson);
    }

    setIsModalOpen(false);
  }, [columnsConfiguration, createSetting, isSettingExist, settingUuid, updateSetting, validationEmptyConfiguration]);

  return (
    <div id="columns-configuration" data-testid="columnsConfiguration">
      <ConfirmationModal
        header={{ id: 'findPatientRecordColumns.modal.header' }}
        body={{ id: 'findPatientRecordColumns.modal.body' }}
        onYes={onYesHandler}
        onNo={onNoHandler}
        isOpen={isModalOpen}
      />
      <div className="title">
        <FormattedMessage id="findPatientRecordColumns.title" tagName="h2" />
      </div>
      {isAppLoading ? (
        <div className="spinner" data-testid="spinner">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="section">
            <div className="title">
              <FormattedMessage id="findPatientRecordColumns.configureColumns" tagName="h4" />
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
                <FormattedMessage id="common.return" />
              </Button>
            </div>
            <div className="d-inline pull-right confirm-button-container">
              <Button className="save" onClick={onSaveHandler} data-testid="saveButton">
                <FormattedMessage id="common.save" />
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
  findPatientRecordColumns: { columnsConfiguration },
  settings: {
    success: settingsSaved,
    isSettingExist: { value: isSettingExist },
    setting
  }
}: IStore) => ({
  isAppLoading,
  settingsSaved,
  patientRegistrationSteps,
  columnsConfiguration,
  isSettingExist,
  settingUuid: setting?.uuid ?? EMPTY_STRING,
  settingValue: setting?.value ?? EMPTY_STRING
});

const mapDispatchToProps = {
  setAllPossibleColumns,
  setColumnsConfiguration,
  getSettingByQuery,
  createSetting,
  updateSetting
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FindPatientRecordColumns));
