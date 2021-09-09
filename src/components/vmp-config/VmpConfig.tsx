import React from 'react';
import { connect } from 'react-redux';
import './VmpConfig.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  DEFAULT_AUTH_STEPS,
  DEFAULT_REGIMEN_UPDATE_PERMITTED,
  DEFAULT_SYNC_SCOPES,
  DEFAULT_VMP_CONFIG,
  EMPTY_COUNTRY,
  SETTING_KEY,
  ORDERED_ADDRESS_FIELD_PARTS
} from '../../shared/constants/vmp-config';
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

export interface IVmpConfigProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IVmpConfigState {
  config: IVmpConfig;
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

class VmpConfig extends React.Component<IVmpConfigProps, IVmpConfigState> {
  state = {
    config: {} as IVmpConfig,
    savedRegimen: [],
    showValidationErrors: false,
    isModalOpen: false,
    modalHeader: { id: '', values: {} },
    modalBody: { id: '', values: {} },
    onModalConfirm: null,
    onModalCancel: null
  };

  componentDidMount() {
    this.props.getSettingByQuery(SETTING_KEY);
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
    if (!config || config.length === 0) {
      config = _.cloneDeep(DEFAULT_VMP_CONFIG);
      if (!!this.props.syncScopes && this.props.syncScopes.length > 0) {
        config.syncScope = this.props.syncScopes[0].value;
      }
    }
    if (!!config.operatorCredentialsRetentionTime) {
      config.operatorCredentialsRetentionTime = config.operatorCredentialsRetentionTime / MS_IN_A_DAY;
    }
    if (!!config.operatorOfflineSessionTimeout) {
      config.operatorOfflineSessionTimeout = config.operatorOfflineSessionTimeout / MS_IN_A_MINUTE;
    }
    const addressFields = config.addressFields || {};
    // make it a list so it's possible to maintain the order while replacing country name
    config.addressFields = Object.keys(addressFields).map(countryName => ({
      countryName,
      fields: addressFields[countryName]
    }));
    if (config.addressFields.length === 0) {
      config.addressFields = [_.cloneDeep(EMPTY_COUNTRY)];
    }
    if (!config.manufacturers || config.manufacturers.length === 0) {
      config.manufacturers = [{}];
    }
    if (!config.vaccine || config.vaccine.length === 0) {
      config.vaccine = [{}];
    }
    if (!config.authSteps || config.authSteps.length === 0) {
      config.authSteps = [{}];
    }
    this.setState({
      config,
      savedRegimen: _.clone(config.vaccine),
      showValidationErrors: false
    });
  };

  generateConfig = () => {
    const config = _.cloneDeep(this.state.config);
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
    const { config } = this.state;
    config[name] = extractEventValue(e);
    this.setState({
      config
    });
  };

  onNumberValueChange = (name, min?, max?) => e => {
    const { config } = this.state;
    const extractedEventValue = extractEventValue(e);
    const value = !!extractedEventValue ? Number.parseInt(extractedEventValue, TEN) : !!min ? min : ZERO;
    if (Number.isInteger(value)) {
      if ((min !== null && value < min) || (max !== null && value > max)) return;
      config[name] = value;
      this.setState({
        config
      });
    }
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  scrollToTop = () => window.scrollTo({ top: ZERO, behavior: 'smooth' });

  isFormValid = () => {
    const { manufacturers, vaccine } = this.state.config;
    return (
      !manufacturers.some(manufacturer => !manufacturer.name || !validateRegex(manufacturer.barcodeRegex) || !manufacturer.barcodeRegex) &&
      !vaccine.some(regimen => !regimen.name || !regimen.manufacturers.length) &&
      !vaccine.some((regimen, idx) => this.isRegimenNameDuplicated(vaccine, regimen, idx))
    );
  };

  save = () => {
    const { setting } = this.props;
    if (this.isFormValid()) {
      const config = this.generateConfig();
      const configJson = JSON.stringify(config);
      if (setting && setting.uuid) {
        setting.value = configJson;
        this.props.updateSetting(setting);
      } else {
        this.props.createSetting(SETTING_KEY, configJson);
      }
    } else {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.error.header' },
        modalBody: { id: 'vmpConfig.error.configurationInvalid' },
        onModalConfirm: () => {
          this.closeModal();
          this.scrollToTop();
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
    const { config, savedRegimen, showValidationErrors } = this.state;
    return (
      <div className="vmp-config">
        {this.modal()}
        <h2>
          <FormattedMessage id="vmpConfig.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || (loading && !config) ? (
            <Spinner />
          ) : (
            <>
              <div className="section">
                <SyncScope intl={intl} syncScopes={syncScopes} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="inline-sections">
                <div className="section">
                  <OperatorCredentialsOfflineRetentionTime
                    intl={intl}
                    config={config}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
                <div className="section">
                  <OperatorSessionTimeout
                    intl={intl}
                    config={config}
                    getPlaceholder={getPlaceholder}
                    onNumberValueChange={this.onNumberValueChange}
                  />
                </div>
              </div>
              <div className="section">
                <Manufacturers
                  intl={intl}
                  config={config}
                  showValidationErrors={showValidationErrors}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                />
              </div>
              <div className="section">
                <Regimen
                  intl={intl}
                  config={config}
                  savedRegimen={savedRegimen}
                  patientLinkedRegimens={patientLinkedRegimens}
                  showValidationErrors={showValidationErrors}
                  isRegimenNameDuplicated={this.isRegimenNameDuplicated}
                  openModal={this.openModal}
                  closeModal={this.closeModal}
                  onValueChange={this.onValueChange}
                  readOnly={!regimenUpdatePermitted}
                />
              </div>
              <div className="section">
                <CanUseDifferentManufacturers intl={intl} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="section">
                <PersonLanguages intl={intl} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="section">
                <AuthSteps intl={intl} config={config} options={authSteps} onValueChange={this.onValueChange} />
              </div>
              <div className="section">
                <AllowManualParticipantIDEntry intl={intl} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="section">
                <ParticipantIDRegex intl={intl} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="section">
                <IrisScore intl={intl} config={config} onNumberValueChange={this.onNumberValueChange} />
              </div>
              <div className="section">
                <AddressFields intl={intl} config={config} onValueChange={this.onValueChange} />
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return}>
                    <FormattedMessage id="vmpConfig.return" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.save} disabled={loading}>
                    <FormattedMessage id="vmpConfig.save" />
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
