import React from 'react';
import { connect } from 'react-redux';
import './VmpConfig.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  DEFAULT_AUTH_STEPS,
  DEFAULT_REGIMEN_UPDATE_PERMITTED,
  DEFAULT_SYNC_SCOPES,
  DEFAULT_VMP_CONFIG,
  SETTING_KEY as VMP_CONFIG_SETTING_KEY,
  ORDERED_ADDRESS_FIELD_PARTS
} from '../../shared/constants/vmp-config';
import { VMP_VACCINATION_SCHEDULE_SETTING_KEY } from '../../shared/constants/vmp-vaccination-schedule';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { parseJson } from '../../shared/util/json-util';
import '../Inputs.scss';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { IVmpConfig } from '../../shared/models/vmp-config';
import { extractEventValue, getPlaceholder, validateRegex } from '../../shared/util/form-util';
import _ from 'lodash';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import { TEN, ZERO } from '../../shared/constants/input';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { getPatientLinkedRegimens } from '../../redux/reducers/patient';
import { SyncScope } from './SyncScope';
import { OperatorCredentialsOfflineRetentionTime, OperatorSessionTimeout } from './OperatorTimeout';
import { CanUseDifferentManufacturers, Manufacturers } from './Manufacturer';
import { Regimen } from './Regimen';
import { PersonLanguages } from './PersonLanguages';
import { AuthSteps } from './AuthSteps';
import { IrisScore } from './IrisScore';
import { AddressFields } from './AddressFields';
import { AllowManualParticipantIDEntry, ParticipantIDRegex } from './ParticipantId';
import { EnableBiometricOnlySearchWithoutPhone } from './SearchWithoutPhone';
import { IVmpVaccinationSchedule } from 'src/shared/models/vmp-vaccination-schedule';
import { scrollToTop } from 'src/shared/util/window-util';

export interface IVmpConfigProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IVmpConfigState {
  vmpConfig: IVmpConfig;
  vmpConfigSetting: {};
  vmpVaccinationSchedule: IVmpVaccinationSchedule[];
  vmpVaccinationScheduleSetting: {};
  savedRegimen: any[];
  showValidationErrors: boolean;
  isModalOpen: boolean;
  modalHeader: {};
  modalBody: {};
  onModalConfirm: any;
  onModalCancel: any;
}

const MS_IN_A_MINUTE = 1000 * 60;
const MS_IN_A_DAY = MS_IN_A_MINUTE * 60 * 24;

export class VmpConfig extends React.Component<IVmpConfigProps, IVmpConfigState> {
  state = {
    vmpConfig: {} as IVmpConfig,
    vmpConfigSetting: { uuid: null, value: null },
    vmpVaccinationSchedule: [],
    vmpVaccinationScheduleSetting: { uuid: null, value: null },
    savedRegimen: [],
    showValidationErrors: false,
    isModalOpen: false,
    modalHeader: { id: '', values: {} },
    modalBody: { id: '', values: {} },
    onModalConfirm: null,
    onModalCancel: null
  };

  componentDidMount() {
    this.props.getSettingByQuery(VMP_CONFIG_SETTING_KEY);
    this.props.getSettingByQuery(VMP_VACCINATION_SCHEDULE_SETTING_KEY);
    this.props.getPatientLinkedRegimens();
  }

  componentDidUpdate(prevProps: Readonly<IVmpConfigProps>, prevState: Readonly<IVmpConfigState>, snapshot?: any) {
    const { intl, config, loading, success, error } = this.props;
    if (prevProps.config !== config) {
      this.extractConfigData();
    }
    if (!prevProps.success && success) {
      successToast(intl.formatMessage({ id: 'vmpConfig.success' }));
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    }
  }

  extractConfigData = () => {
    let config = parseJson(this.props.config);

    if (this.props.setting?.property === VMP_CONFIG_SETTING_KEY) {
      config = _.defaults(config, DEFAULT_VMP_CONFIG);
      const addressFields = config.addressFields;

      // make it a list so it's possible to maintain the order while replacing country name
      config.addressFields = Object.keys(addressFields).map(countryName => ({
        countryName,
        fields: addressFields[countryName]
      }));

      config.operatorCredentialsRetentionTime = config.operatorCredentialsRetentionTime / MS_IN_A_DAY;
      config.operatorOfflineSessionTimeout = config.operatorOfflineSessionTimeout / MS_IN_A_MINUTE;

      this.setState({
        vmpConfig: config,
        vmpConfigSetting: this.props.setting,
        savedRegimen: _.clone(config.vaccine),
        showValidationErrors: false
      });
    } else if (this.props.setting?.property === VMP_VACCINATION_SCHEDULE_SETTING_KEY) {
      this.setState({
        vmpVaccinationSchedule: config,
        vmpVaccinationScheduleSetting: this.props.setting
      });
    }
  };

  generateConfig = () => {
    const config = _.cloneDeep(this.state.vmpConfig);
    // revert address fields back to a map
    config.addressFields = !!config.addressFields
      ? config.addressFields.reduce((map, obj) => {
          if (!!obj.countryName) {
            map[obj.countryName] = (obj.fields || []).map((field, i) => {
              field.displayOrder = i + 1;
              return ORDERED_ADDRESS_FIELD_PARTS.reduce((obj, key) => {
                obj[key] = field[key];
                return obj;
              }, {});
            });
          }
          return map;
        }, {})
      : {};
    // revert the timeouts back to ms
    if (!!config.operatorCredentialsRetentionTime) {
      config.operatorCredentialsRetentionTime = config.operatorCredentialsRetentionTime * MS_IN_A_DAY;
    }
    if (!!config.operatorOfflineSessionTimeout) {
      config.operatorOfflineSessionTimeout = config.operatorOfflineSessionTimeout * MS_IN_A_MINUTE;
    }
    // filter out empty rows
    if (!!config.manufacturers) {
      config.manufacturers = config.manufacturers.filter(mf => !!mf.name);
    }
    if (!!config.vaccine) {
      config.vaccine = config.vaccine.filter(vc => !!vc.name);
      config.vaccine.forEach(vc => {
        vc.name = vc.name.trim();
        vc.manufacturers = !!vc.manufacturers ? vc.manufacturers.filter(vcm => !!vcm) : [];
      });
    }
    if (!!config.personLanguages) {
      config.personLanguages = config.personLanguages.filter(pl => !!pl.name);
    }
    if (!!config.authSteps) {
      config.authSteps = config.authSteps.filter(as => !!as.type);
    }
    return config;
  };

  onValueChange = name => e => {
    const { vmpConfig } = this.state;
    vmpConfig[name] = extractEventValue(e);
    this.setState({
      vmpConfig
    });
  };

  onVaccinationScheduleChange = vmpVaccinationSchedule => this.setState({ vmpVaccinationSchedule });

  onNumberValueChange = (name, min?, max?) => e => {
    const { vmpConfig } = this.state;
    const extractedEventValue = extractEventValue(e);
    const value = !!extractedEventValue ? Number.parseInt(extractedEventValue, TEN) : !!min ? min : ZERO;
    if (Number.isInteger(value)) {
      if ((min !== null && value < min) || (max !== null && value > max)) return;
      vmpConfig[name] = value;
      this.setState({
        vmpConfig
      });
    }
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  isFormValid = () => {
    const { manufacturers, vaccine } = this.state.vmpConfig;
    return (
      !manufacturers.some(manufacturer => !manufacturer.name || !validateRegex(manufacturer.barcodeRegex) || !manufacturer.barcodeRegex) &&
      !vaccine.some(regimen => !regimen.name || !regimen.manufacturers.length) &&
      !vaccine.some((regimen, idx) => this.isRegimenNameDuplicated(vaccine, regimen, idx))
    );
  };

  save = () => {
    const { vmpVaccinationSchedule, vmpConfigSetting, vmpVaccinationScheduleSetting } = this.state;
    if (this.isFormValid()) {
      const config = this.generateConfig();
      const configJson = JSON.stringify(config);
      if (vmpConfigSetting?.uuid) {
        vmpConfigSetting.value = configJson;
        this.props.updateSetting(vmpConfigSetting);
      } else {
        this.props.createSetting(VMP_CONFIG_SETTING_KEY, configJson);
      }
      if (vmpVaccinationScheduleSetting?.uuid) {
        vmpVaccinationScheduleSetting.value = JSON.stringify(vmpVaccinationSchedule);
        this.props.updateSetting(vmpVaccinationScheduleSetting);
      }
    } else {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.error.header' },
        modalBody: { id: 'vmpConfig.error.configurationInvalid' },
        onModalConfirm: () => {
          this.closeModal();
          scrollToTop();
        },
        onModalCancel: null,
        showValidationErrors: true
      });
    }
  };

  isRegimenNameDuplicated = (vaccine, regimen, idx) =>
    !!regimen.name && !this.state.savedRegimen.includes(regimen) && !!vaccine.find((r, j) => idx !== j && r.name === regimen.name);

  modal = () => (
    <ConfirmationModal
      header={this.state.modalHeader}
      body={this.state.modalBody}
      onYes={this.state.onModalConfirm}
      onNo={this.state.onModalCancel}
      isOpen={this.state.isModalOpen}
    />
  );

  openModal = (modalHeader, modalBody, onModalConfirm = null, onModalCancel = null) => {
    this.setState({
      isModalOpen: true,
      modalHeader: { id: modalHeader },
      modalBody: { id: modalBody },
      onModalConfirm: () => {
        if (!!onModalConfirm) {
          onModalConfirm();
        }
        this.closeModal();
      },
      onModalCancel
    });
  };

  closeModal = () => this.setState({ isModalOpen: false });

  render() {
    const { intl, appError, appLoading, loading, patientLinkedRegimens, syncScopes, authSteps, regimenUpdatePermitted } = this.props;
    const { vmpConfig, vmpVaccinationSchedule, savedRegimen, showValidationErrors } = this.state;
    return (
      <div className="vmp-config">
        {this.modal()}
        <h2>
          <FormattedMessage id="vmpConfig.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || (loading && !vmpConfig) ? (
            <Spinner />
          ) : (
            <>
              <div className="section" data-testid="syncScopeSection">
                <SyncScope intl={intl} syncScopes={syncScopes} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="inline-sections">
                <div className="section" data-testid="operatorCredentialsOfflineRetentionTimeSection">
                  <OperatorCredentialsOfflineRetentionTime
                    intl={intl}
                    config={vmpConfig}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
                <div className="section" data-testid="operatorSessionTimeoutSection">
                  <OperatorSessionTimeout
                    intl={intl}
                    config={vmpConfig}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
              </div>
              <div className="section" data-testid="manufacturersSection">
                <Manufacturers
                  intl={intl}
                  config={vmpConfig}
                  showValidationErrors={showValidationErrors}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                />
              </div>
              <div className="section" data-testid="regimenSection">
                <Regimen
                  intl={intl}
                  config={vmpConfig}
                  vaccinationSchedule={vmpVaccinationSchedule}
                  savedRegimen={savedRegimen}
                  patientLinkedRegimens={patientLinkedRegimens}
                  showValidationErrors={showValidationErrors}
                  isRegimenNameDuplicated={this.isRegimenNameDuplicated}
                  readOnly={!regimenUpdatePermitted}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                  onVaccinationScheduleChange={this.onVaccinationScheduleChange}
                />
              </div>
              <div className="section" data-testid="canUseDifferentManufacturersSection">
                <CanUseDifferentManufacturers intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="personLanguagesSection">
                <PersonLanguages intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="authStepsSection">
                <AuthSteps intl={intl} config={vmpConfig} options={authSteps} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="allowManualParticipantIDEntrySection">
                <AllowManualParticipantIDEntry intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="enableBiometricOnlySearchWithoutPhoneSection">
                <EnableBiometricOnlySearchWithoutPhone intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="participantIDRegexSection">
                <ParticipantIDRegex intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="section" data-testid="irisScoreSection">
                <IrisScore intl={intl} config={vmpConfig} onNumberValueChange={this.onNumberValueChange} />
              </div>
              <div className="section" data-testid="addressFieldsSection">
                <AddressFields intl={intl} config={vmpConfig} onValueChange={this.onValueChange} />
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return} data-testid="cancelButton">
                    <FormattedMessage id="common.return" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.save} disabled={loading} data-testid="saveButton">
                    <FormattedMessage id="common.save" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ apps, settings, cflPatient }) => ({
  syncScopes: apps?.vmpConfig?.syncScopes ?? DEFAULT_SYNC_SCOPES,
  authSteps: apps?.vmpConfig?.authSteps ?? DEFAULT_AUTH_STEPS,
  regimenUpdatePermitted: apps?.vmpConfig?.regimenUpdatePermitted ?? DEFAULT_REGIMEN_UPDATE_PERMITTED,
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  patientLinkedRegimens: cflPatient.patientLinkedRegimens
});

const mapDispatchToProps = { getSettingByQuery, updateSetting, createSetting, getPatientLinkedRegimens };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(VmpConfig)));
