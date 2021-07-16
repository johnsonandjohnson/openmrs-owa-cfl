import React from 'react';
import { connect } from 'react-redux';
import './VmpConfig.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DEFAULT_AUTH_STEPS, DEFAULT_SYNC_SCOPES, DEFAULT_VMP_CONFIG, SETTING_KEY } from '../../shared/constants/vmp-config';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { parseJson } from '../../shared/util/json-util';
import '../Inputs.scss';
import { InputWithPlaceholder, SelectWithPlaceholder, SortableSelectWithPlaceholder } from '../common/form/withPlaceholder';
import { Button, Input, Label, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { IVmpConfig } from '../../shared/models/vmp-config';
import { Buttons } from '../common/form/Buttons';
import ISO6391 from 'iso-639-1';
import { extractEventValue, validateRegex, selectDefaultTheme, getPlaceholder } from '../../shared/util/form-util';
import { getData } from 'country-list';
import _ from 'lodash';
import Plus from '../../assets/img/plus.png';
import Minus from '../../assets/img/minus.png';
import { ADDRESS_FIELDS, ADDRESS_FIELD_TYPE } from '../../shared/constants/address';
import { swapPositions } from '../../shared/util/array-util';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import ValidationError from '../common/form/ValidationError';
import { HUNDRED, ONE, TEN, ZERO } from 'src/shared/constants/input';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { getPatientLinkedRegimens } from '../../redux/reducers/patient';

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

const LANGUAGE_OPTIONS = ISO6391.getAllNames().map(name => ({ label: name, value: name }));
const COUNTRY_OPTIONS = getData().map(country => ({ label: country.name, value: country.name }));
const MS_IN_A_MINUTE = 1000 * 60;
const MS_IN_A_DAY = MS_IN_A_MINUTE * 60 * 24;
const EMPTY_COUNTRY = { fields: [{}] };
const EMPTY_MANUFACTURER = { name: '', barcodeRegex: '' };
const EMPTY_REGIMEN = { name: '', manufacturers: [] };

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
            const fields = obj.fields || [];
            fields.forEach((field, i) => (field.displayOrder = i + 1));
            map[obj.countryName] = fields;
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

  onPersonLanguagesChange = name => selectedOptions => {
    // person languages has a form of [{ name: value }, ...]
    this.onValueChange(name)(selectedOptions.map(option => ({ name: option.value })));
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  scrollToTop = () => window.scrollTo({ top: ZERO, behavior: 'smooth' });

  isFormValid = () => {
    const { manufacturers, vaccine } = this.state.config;
    return (
      !manufacturers.some(manufacturer => !manufacturer.name) &&
      !vaccine.some(regimen => !regimen.name) &&
      !vaccine.some((regimen, idx) => this.isRegimenNameDuplicated(vaccine, regimen, idx))
    );
  };

  closeModal = () => this.setState({ isModalOpen: false });

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

  yesNoOptions = () => {
    const { intl } = this.props;
    return [
      {
        label: intl.formatMessage({ id: 'common.yes' }),
        value: true
      },
      {
        label: intl.formatMessage({ id: 'common.no' }),
        value: false
      }
    ];
  };

  syncScope = () => (
    <>
      <Label className="mr-5 mb-0">
        <FormattedMessage id="vmpConfig.syncScope" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={this.props.intl.formatMessage({ id: 'vmpConfig.syncScopeTooltip' })}
        />
      </Label>
      <Buttons
        options={this.props.syncScopes}
        entity={this.state.config}
        fieldName="syncScope"
        onChange={this.onValueChange('syncScope')}
      />
    </>
  );

  operatorCredentialsRetentionTime = () => {
    const operatorCredentialsRetentionTime = this.state.config.operatorCredentialsRetentionTime;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.operatorCredentialsOfflineRetentionTime" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.operatorCredentialsOfflineRetentionTimeTooltip' })}
          />
        </Label>
        <InputWithPlaceholder
          placeholder={getPlaceholder(this.props.intl, 'vmpConfig.days', true)}
          showPlaceholder={!!operatorCredentialsRetentionTime}
          value={operatorCredentialsRetentionTime}
          onChange={this.onNumberValueChange('operatorCredentialsRetentionTime', ONE)}
          type="number"
          pattern="[1-9]"
          min={ONE}
        />
      </>
    );
  };

  operatorOfflineSessionTimeout = () => {
    const operatorOfflineSessionTimeout = this.state.config.operatorOfflineSessionTimeout;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.operatorSessionTimeout" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.operatorSessionTimeoutTooltip' })}
          />
        </Label>
        <InputWithPlaceholder
          placeholder={getPlaceholder(this.props.intl, 'vmpConfig.minutes', true)}
          showPlaceholder={!!operatorOfflineSessionTimeout}
          value={operatorOfflineSessionTimeout}
          onChange={this.onNumberValueChange('operatorOfflineSessionTimeout', ONE)}
          type="number"
          pattern="[1-9]"
          min={ONE}
        />
      </>
    );
  };

  canUseDifferentManufacturers = () => (
    <>
      <Label className="mr-4 mb-0">
        <FormattedMessage id="vmpConfig.canUseDifferentManufacturers" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={this.props.intl.formatMessage({ id: 'vmpConfig.canUseDifferentManufacturersTooltip' })}
        />
      </Label>
      <Buttons
        options={this.yesNoOptions()}
        entity={this.state.config}
        fieldName="canUseDifferentManufacturers"
        onChange={this.onValueChange('canUseDifferentManufacturers')}
      />
    </>
  );

  removeManufacturer = idx => {
    const { manufacturers, vaccine } = this.state.config;
    const manufacturerName = manufacturers[idx].name;
    manufacturers.splice(idx, 1);
    if (manufacturers.length === 0) {
      this.addManufacturer();
    }
    this.onValueChange('manufacturers')(manufacturers);
    // remove manufacturer from regimen
    vaccine.forEach(v => {
      if (!!v.manufacturers) {
        v.manufacturers = v.manufacturers.filter(mf => mf !== manufacturerName);
      }
    });
    this.onValueChange('vaccine')(vaccine);
  };

  onManufacturerRemove = idx => {
    const { manufacturers, vaccine } = this.state.config;
    const manufacturerName = manufacturers[idx].name;
    if (vaccine.some(regimen => !!regimen.manufacturers && regimen.manufacturers.includes(manufacturerName))) {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.error.header' },
        modalBody: { id: 'vmpConfig.error.manufacturerAssigned' },
        onModalConfirm: this.closeModal,
        onModalCancel: null
      });
    } else {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.warning.header' },
        modalBody: { id: 'vmpConfig.warning.deleteManufacturer' },
        onModalConfirm: () => {
          this.removeManufacturer(idx);
          this.closeModal();
        },
        onModalCancel: this.closeModal
      });
    }
  };

  addManufacturer = () => {
    const { manufacturers } = this.state.config;
    manufacturers.push(_.clone(EMPTY_MANUFACTURER));
    this.onValueChange('manufacturers')(manufacturers);
  };

  onManufacturerChange = (i, fieldName) => e => {
    const { manufacturers, vaccine } = this.state.config;
    const value = extractEventValue(e);
    if (fieldName === 'name') {
      // update regimen's manufacturers when the name has changed
      const name = manufacturers[i].name;
      vaccine.forEach(v => {
        if (!!v.manufacturers && !!v.manufacturers.length) {
          v.manufacturers = v.manufacturers.map(mf => (mf === name ? value : mf));
        }
      });
      this.onValueChange('vaccine')(vaccine);
    }
    manufacturers[i][fieldName] = value;
    this.onValueChange('manufacturers')(manufacturers);
  };

  manufacturers = () => {
    const manufacturers = this.state.config.manufacturers || [];
    const { showValidationErrors } = this.state;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.manufacturers" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.manufacturersTooltip' })}
          />
        </Label>
        {manufacturers.map((manufacturer, i) => {
          const isInvalid = !manufacturer.name;
          return (
            <>
              <div key={`manufacturers-${i}`} className="inline-fields">
                <InputWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.manufacturersName' })}
                  showPlaceholder={!!manufacturer.name}
                  value={manufacturer.name}
                  onChange={this.onManufacturerChange(i, 'name')}
                  wrapperClassName="flex-1"
                  className={showValidationErrors && isInvalid ? 'invalid' : ''}
                />
                <InputWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.barcodeRegex' })}
                  showPlaceholder={!!manufacturer.barcodeRegex}
                  value={manufacturer.barcodeRegex}
                  onChange={this.onManufacturerChange(i, 'barcodeRegex')}
                  wrapperClassName="flex-2"
                  className={validateRegex(manufacturer.barcodeRegex) ? '' : 'invalid'}
                />
                <div className="align-items-center justify-content-center d-flex action-icons">
                  <div className="action-icons-inner">
                    <img
                      src={Minus}
                      title={this.props.intl.formatMessage({ id: 'vmpConfig.delete' })}
                      alt="remove"
                      className="remove-item"
                      onClick={() => this.onManufacturerRemove(i)}
                    />
                    {i === manufacturers.length - 1 && (
                      <img
                        src={Plus}
                        title={this.props.intl.formatMessage({ id: 'vmpConfig.addNew' })}
                        alt="add"
                        className="mx-2 add-item"
                        onClick={this.addManufacturer}
                      />
                    )}
                  </div>
                </div>
              </div>
              {showValidationErrors && isInvalid && <ValidationError message="vmpConfig.error.nameRequired" />}
            </>
          );
        })}
      </>
    );
  };

  onVaccineChange = (i, fieldName, isMultiselect) => e => {
    const { vaccine } = this.state.config;
    vaccine[i][fieldName] = isMultiselect ? e.map(option => option.label) : extractEventValue(e);
    this.onValueChange('vaccine')(vaccine);
  };

  isRegimenNameDuplicated = (vaccine, regimen, idx) =>
    !!regimen.name && !this.state.savedRegimen.includes(regimen) && !!vaccine.find((r, j) => idx !== j && r.name === regimen.name);

  removeRegimen = idx => {
    const { vaccine } = this.state.config;
    vaccine.splice(idx, 1);
    if (vaccine.length === 0) {
      this.addRegimen();
    }
    this.onValueChange('vaccine')(vaccine);
  };

  onRegimenRemove = idx => {
    const { vaccine } = this.state.config;
    const regimenName = !!vaccine[idx] ? vaccine[idx].name : null;
    const linkedRegimen = !!regimenName ? this.props.patientLinkedRegimens.find(regimen => regimen.regimenName === regimenName) : null;
    if (!!linkedRegimen && !!linkedRegimen.anyPatientLinkedWithRegimen) {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.error.header' },
        modalBody: { id: 'vmpConfig.error.regimenLinked' },
        onModalConfirm: this.closeModal,
        onModalCancel: null
      });
    } else {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpConfig.warning.header' },
        modalBody: { id: 'vmpConfig.warning.deleteRegimen' },
        onModalConfirm: () => {
          this.removeRegimen(idx);
          this.closeModal();
        },
        onModalCancel: this.closeModal
      });
    }
  };

  addRegimen = () => {
    const { vaccine } = this.state.config;
    vaccine.push(_.clone(EMPTY_REGIMEN));
    this.onValueChange('vaccine')(vaccine);
  };

  regimen = () => {
    const { savedRegimen, showValidationErrors } = this.state;
    const { vaccine, manufacturers } = this.state.config;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.regimen" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.regimenTooltip' })}
          />
        </Label>
        {(vaccine || []).map((regimen, i) => {
          const isInvalid = !regimen.name;
          const isDuplicateName = this.isRegimenNameDuplicated(vaccine, regimen, i);
          return (
            <>
              <div key={`regimen-${i}`} className="inline-fields">
                <InputWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.regimenName' })}
                  showPlaceholder={!!regimen.name}
                  value={regimen.name}
                  onChange={this.onVaccineChange(i, 'name', false)}
                  wrapperClassName="flex-1"
                  readOnly={!!regimen.name && savedRegimen.includes(regimen)}
                  className={showValidationErrors && (isInvalid || isDuplicateName) ? 'invalid' : ''}
                />
                <SortableSelectWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.manufacturers' })}
                  showPlaceholder={!!regimen.manufacturers && regimen.manufacturers.length}
                  // value = index so it's possible to remove an option that was selected multiple times
                  value={regimen.manufacturers && regimen.manufacturers.map((mf, idx) => ({ label: mf, value: idx }))}
                  onChange={this.onVaccineChange(i, 'manufacturers', true)}
                  options={(manufacturers || []).map(manufacturer => ({
                    label: manufacturer.name,
                    value: manufacturer.name
                  }))}
                  wrapperClassName="flex-2 cfl-select-multi"
                  className="cfl-select"
                  classNamePrefix="cfl-select"
                  isMulti
                  isOptionSelected={() => false}
                  theme={selectDefaultTheme}
                />
                <div className="align-items-center justify-content-center d-flex action-icons">
                  <div className="action-icons-inner">
                    <img
                      src={Minus}
                      title={this.props.intl.formatMessage({ id: 'vmpConfig.delete' })}
                      alt="remove"
                      className="remove-item"
                      onClick={() => this.onRegimenRemove(i)}
                    />
                    {i === vaccine.length - 1 && (
                      <img
                        src={Plus}
                        title={this.props.intl.formatMessage({ id: 'vmpConfig.addNew' })}
                        alt="add"
                        className="mx-2 add-item"
                        onClick={this.addRegimen}
                      />
                    )}
                  </div>
                </div>
              </div>
              {showValidationErrors &&
                (isInvalid ? (
                  <ValidationError message="vmpConfig.error.nameRequired" />
                ) : (
                  isDuplicateName && <ValidationError message="vmpConfig.error.nameDuplicate" />
                ))}
            </>
          );
        })}
      </>
    );
  };

  personLanguages = () => {
    const personLanguages = this.state.config.personLanguages || [];
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.personLanguages" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.personLanguagesTooltip' })}
          />
        </Label>
        <SelectWithPlaceholder
          placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.personLanguages' })}
          showPlaceholder={!!personLanguages && personLanguages.length > 0}
          value={personLanguages.map(lang => ({ label: lang.name, value: lang.name }))}
          onChange={this.onPersonLanguagesChange('personLanguages')}
          options={LANGUAGE_OPTIONS}
          classNamePrefix="cfl-select"
          wrapperClassName="cfl-select-multi"
          isMulti
          theme={selectDefaultTheme}
        />
      </>
    );
  };

  onAuthStepsChange = (i, fieldName, isSelect) => e => {
    const { authSteps } = this.state.config;
    authSteps[i][fieldName] = isSelect ? e.value : extractEventValue(e);
    this.onValueChange('authSteps')(authSteps);
  };

  removeAuthStep = idx => () => {
    const { authSteps } = this.state.config;
    authSteps.splice(idx, 1);
    if (authSteps.length === 0) {
      this.addAuthStep();
    }
    this.onValueChange('authSteps')(authSteps);
  };

  addAuthStep = () => {
    const { authSteps } = this.state.config;
    authSteps.push({ mandatory: false });
    this.onValueChange('authSteps')(authSteps);
  };

  moveAuthStep = (idx, offset) => () => {
    const { authSteps } = this.state.config;
    swapPositions(authSteps, idx, offset);
    this.onValueChange('authSteps')(authSteps);
  };

  authSteps = () => {
    const authSteps = this.state.config.authSteps || [];
    const options = this.props.authSteps;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.authSteps" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.authStepsTooltip' })}
          />
        </Label>
        {authSteps.map((authStep, i) => (
          <div key={`authStep-${i}`} className="inline-fields">
            <div className="d-flex flex-column order-icons">
              <span
                className={`glyphicon glyphicon-chevron-up ${i === 0 ? 'disabled' : ''}`}
                title={this.props.intl.formatMessage({ id: 'vmpConfig.moveUp' })}
                aria-hidden="true"
                onClick={this.moveAuthStep(i, -1)}
              />
              <span
                className={`glyphicon glyphicon-chevron-down ${i === authSteps.length - 1 ? 'disabled' : ''}`}
                title={this.props.intl.formatMessage({ id: 'vmpConfig.moveDown' })}
                aria-hidden="true"
                onClick={this.moveAuthStep(i, 1)}
              />
            </div>
            <div className="input-container d-flex align-items-center justify-content-center">
              <Label>
                <Input
                  checked={authStep.mandatory}
                  onClick={() => this.onAuthStepsChange(i, 'mandatory', false)(!authStep.mandatory)}
                  type="checkbox"
                />
                <span>
                  <FormattedMessage id="vmpConfig.mandatoryField" />
                </span>
              </Label>
            </div>
            <SelectWithPlaceholder
              placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.authStepType' })}
              showPlaceholder={!!authStep.type}
              value={options.find(opt => opt.value === authStep.type) || null}
              onChange={this.onAuthStepsChange(i, 'type', true)}
              options={options.filter(opt => !authSteps.find(as => as.type === opt.value))}
              wrapperClassName="flex-2"
              classNamePrefix="cfl-select"
              theme={selectDefaultTheme}
            />
            <div className="align-items-center justify-content-center d-flex action-icons">
              <div className="action-icons-inner">
                <img
                  src={Minus}
                  title={this.props.intl.formatMessage({ id: 'vmpConfig.delete' })}
                  alt="remove"
                  className="remove-item"
                  onClick={this.removeAuthStep(i)}
                />
                {i === authSteps.length - 1 && (
                  <img
                    src={Plus}
                    title={this.props.intl.formatMessage({ id: 'vmpConfig.addNew' })}
                    alt="add"
                    className="mx-2 add-item"
                    onClick={this.addAuthStep}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  irisScore = () => {
    const irisScore = this.state.config.irisScore;
    return (
      <>
        <Label className="mr-4 mb-0">
          <FormattedMessage id="vmpConfig.irisScore" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.irisScoreTooltip' })}
          />
        </Label>
        <div className="d-inline-block">
          <InputWithPlaceholder
            placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.irisScore' })}
            showPlaceholder={irisScore !== null}
            value={irisScore}
            onChange={this.onNumberValueChange('irisScore', ZERO, HUNDRED)}
            type="number"
            pattern="[1-9]"
            className="iris-score"
            min={ZERO}
            max={HUNDRED}
          />
        </div>
      </>
    );
  };

  onCountryChange = (countryIdx, fieldIdx, fieldName, isSelect) => e => {
    const { addressFields } = this.state.config;
    const value = isSelect ? e.value : extractEventValue(e);
    if (!fieldName) {
      // country name select
      addressFields[countryIdx].countryName = value;
    } else {
      addressFields[countryIdx].fields[fieldIdx][fieldName] = value;
    }
    this.onValueChange('addressFields')(addressFields);
  };

  onAddressPartFieldChange = (countryIdx, fieldIdx) => e => {
    const { addressFields } = this.state.config;
    const addressPartField = e.value;
    addressFields[countryIdx].fields[fieldIdx].field = addressPartField;
    addressFields[countryIdx].fields[fieldIdx].type = ADDRESS_FIELD_TYPE[addressPartField];
    this.onValueChange('addressFields')(addressFields);
  };

  addAddressPart = countryIdx => () => {
    const { addressFields } = this.state.config;
    addressFields[countryIdx].fields.push({});
    this.onValueChange('addressFields')(addressFields);
  };

  removeAddressPart = (countryIdx, addressPartIdx) => () => {
    const { addressFields } = this.state.config;
    const fields = addressFields[countryIdx].fields;
    fields.splice(addressPartIdx, 1);
    if (fields.length === 0) {
      fields.push({});
    }
    this.onValueChange('addressFields')(addressFields);
  };

  moveAddressPart = (countryIdx, idx, offset) => () => {
    const { addressFields } = this.state.config;
    swapPositions(addressFields[countryIdx]?.fields, idx, offset);
    this.onValueChange('addressFields')(addressFields);
  };

  deleteCountry = countryIdx => () => {
    const { addressFields } = this.state.config;
    addressFields.splice(countryIdx, 1);
    if (addressFields.length === 0) {
      this.addCountry();
    }
    this.onValueChange('addressFields')(addressFields);
  };

  addCountry = () => {
    const { addressFields } = this.state.config;
    addressFields.push(_.cloneDeep(EMPTY_COUNTRY));
    this.onValueChange('addressFields')(addressFields);
  };

  addressPartOptions = (countryIdx, addressPartIdx) => {
    const addressFields = this.state.config.addressFields || [];
    const selectedAddressParts = (addressFields[countryIdx].fields || [])
      .filter((addressPart, idx) => idx !== addressPartIdx)
      .map(addressPart => addressPart.field);
    return ADDRESS_FIELDS.filter(addressPart => !selectedAddressParts.includes(addressPart)).map(fieldName => ({
      label: fieldName,
      value: fieldName
    }));
  };

  addressFields = () => {
    const addressFields = this.state.config.addressFields || [];
    return (
      <>
        <Label className="mb-3">
          <FormattedMessage id="vmpConfig.addressFields" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.addressFieldsTooltip' })}
          />
        </Label>
        {addressFields.map((country, i) => {
          const addressParts = country.fields || [];
          addressParts.sort((ap1, ap2) => ap1.displayOrder || 0 > ap2.displayOrder || 0);
          return (
            <div key={`addressField-${i}`} className="country">
              <div className="delete-button-container d-flex justify-content-end">
                <button className="btn btn-primary" onClick={this.deleteCountry(i)}>
                  <FormattedMessage id="vmpConfig.delete" />
                </button>
              </div>
              <div className="inline-fields">
                <div className="order-icons" />
                <SelectWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.country' })}
                  showPlaceholder={!!country.countryName}
                  value={country.countryName && { value: country.countryName, label: country.countryName }}
                  onChange={this.onCountryChange(i, null, null, true)}
                  options={COUNTRY_OPTIONS}
                  wrapperClassName="flex-1"
                  classNamePrefix="cfl-select"
                  theme={selectDefaultTheme}
                />
                <InputWithPlaceholder
                  placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.country' })}
                  showPlaceholder={!!country.countryName}
                  value={country.countryName}
                  onChange={this.onCountryChange(i, null, null, false)}
                  wrapperClassName="flex-1"
                />
                <div className="action-icons" />
              </div>
              {addressParts.map((addressPart, j) => {
                const { name, field } = addressPart;
                return (
                  <div key={`addressField-${i}-${j}`} className="inline-fields">
                    <div className="d-flex flex-column order-icons">
                      <span
                        className={`glyphicon glyphicon-chevron-up ${j === 0 ? 'disabled' : ''}`}
                        title={this.props.intl.formatMessage({ id: 'vmpConfig.moveUp' })}
                        aria-hidden="true"
                        onClick={this.moveAddressPart(i, j, -1)}
                      />
                      <span
                        className={`glyphicon glyphicon-chevron-down ${j === addressParts.length - 1 ? 'disabled' : ''}`}
                        title={this.props.intl.formatMessage({ id: 'vmpConfig.moveDown' })}
                        aria-hidden="true"
                        onClick={this.moveAddressPart(i, j, 1)}
                      />
                    </div>
                    <SelectWithPlaceholder
                      placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.addressField' })}
                      showPlaceholder={!!field}
                      value={field ? { value: field, label: field } : null}
                      onChange={this.onAddressPartFieldChange(i, j)}
                      options={this.addressPartOptions(i, j)}
                      wrapperClassName="flex-1"
                      classNamePrefix="cfl-select"
                      theme={selectDefaultTheme}
                    />
                    <InputWithPlaceholder
                      placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.addressName' })}
                      showPlaceholder={!!name}
                      value={name || ''}
                      onChange={this.onCountryChange(i, j, 'name', false)}
                      wrapperClassName="flex-1"
                    />
                    <div className="align-items-center justify-content-center d-flex action-icons">
                      <div className="action-icons-inner">
                        <img
                          src={Minus}
                          title={this.props.intl.formatMessage({ id: 'vmpConfig.delete' })}
                          alt="remove"
                          className="remove-item"
                          onClick={this.removeAddressPart(i, j)}
                        />
                        {j === addressParts.length - 1 && (
                          <img
                            src={Plus}
                            title={this.props.intl.formatMessage({ id: 'vmpConfig.addNew' })}
                            alt="add"
                            className="mx-2 add-item"
                            onClick={this.addAddressPart(i)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className="d-flex justify-content-end mt-2 mb-2">
          <button className="btn btn-primary" onClick={this.addCountry}>
            <FormattedMessage id="vmpConfig.addNewCountry" />
          </button>
        </div>
      </>
    );
  };

  allowManualParticipantIDEntry = () => (
    <>
      <Label className="mr-4">
        <FormattedMessage id="vmpConfig.allowManualParticipantIDEntry" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={this.props.intl.formatMessage({ id: 'vmpConfig.allowManualParticipantIDEntryTooltip' })}
        />
      </Label>
      <Buttons
        options={this.yesNoOptions()}
        entity={this.state.config}
        fieldName="allowManualParticipantIDEntry"
        onChange={this.onValueChange('allowManualParticipantIDEntry')}
      />
    </>
  );

  participantIDRegex = () => {
    const participantIDRegex = this.state.config.participantIDRegex;
    return (
      <>
        <Label className="mr-4 mb-0">
          <FormattedMessage id="vmpConfig.participantIDRegex" />
        </Label>
        <div className="d-inline-block">
          <InputWithPlaceholder
            placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.participantIDRegex' })}
            showPlaceholder={!!participantIDRegex}
            value={participantIDRegex}
            onChange={this.onValueChange('participantIDRegex')}
            className={validateRegex(participantIDRegex) ? 'id-regex' : 'invalid id-regex'}
          />
        </div>
      </>
    );
  };

  modal = () => (
    <ConfirmationModal
      header={this.state.modalHeader}
      body={this.state.modalBody}
      onYes={this.state.onModalConfirm}
      onNo={this.state.onModalCancel}
      isOpen={this.state.isModalOpen}
    />
  );

  render() {
    const { appError, appLoading, loading, config } = this.props;
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
              <div className="section">{this.syncScope()}</div>
              <div className="inline-sections">
                <div className="section">{this.operatorCredentialsRetentionTime()}</div>
                <div className="section">{this.operatorOfflineSessionTimeout()}</div>
              </div>
              <div className="section">{this.manufacturers()}</div>
              <div className="section">{this.regimen()}</div>
              <div className="section">{this.canUseDifferentManufacturers()}</div>
              <div className="section">{this.personLanguages()}</div>
              <div className="section">{this.authSteps()}</div>
              <div className="section">{this.allowManualParticipantIDEntry()}</div>
              <div className="section">{this.participantIDRegex()}</div>
              <div className="section">{this.irisScore()}</div>
              <div className="section">{this.addressFields()}</div>
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
  syncScopes: (apps.vmpConfig && apps.vmpConfig.syncScopes) || DEFAULT_SYNC_SCOPES,
  authSteps: (apps.vmpConfig && apps.vmpConfig.authSteps) || DEFAULT_AUTH_STEPS,
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
