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
import { extractEventValue, validateRegex } from '../../shared/util/form-util';
import { getData } from 'country-list';
import _ from 'lodash';
import Plus from '../../assets/img/plus.png';
import Minus from '../../assets/img/minus.png';
import { ADDRESS_FIELDS } from '../../shared/constants/address';
import { swapPositions } from '../../shared/util/array-util';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';

export interface IVmpConfigProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IVmpConfigState {
  config: IVmpConfig;
}

const LANGUAGE_OPTIONS = ISO6391.getAllNames().map(name => ({ label: name, value: name }));
const COUNTRY_OPTIONS = getData().map(country => ({ label: country.name, value: country.name }));
const ADDRESS_OPTIONS = ADDRESS_FIELDS.map(fieldName => ({ label: fieldName, value: fieldName }));
const MS_IN_A_MINUTE = 1000 * 60;
const MS_IN_A_DAY = MS_IN_A_MINUTE * 60 * 24;
const EMPTY_COUNTRY = { fields: [{}] };

class VmpConfig extends React.Component<IVmpConfigProps, IVmpConfigState> {
  state = {
    config: {} as IVmpConfig
  };

  componentDidMount() {
    this.props.getSettingByQuery(SETTING_KEY);
    this.extractConfigData();
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
      config
    });
  };

  generateConfig = () => {
    const config = _.cloneDeep(this.state.config);
    // revert address fields back to a map
    config.addressFields = !!config.addressFields
      ? config.addressFields.reduce((map, obj) => {
          if (!!obj.countryName) {
            const fields = obj.fields || [];
            fields.forEach((field, i) => (field.mappingPos = i + 1));
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

  onPersonLanguagesChange = name => selectedOptions => {
    // person languages has a form of [{ name: value }, ...]
    this.onValueChange(name)(selectedOptions.map(option => ({ name: option.value })));
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  save = () => {
    const { setting } = this.props;
    const config = this.generateConfig();
    const configJson = JSON.stringify(config);
    if (setting && setting.uuid) {
      setting.value = configJson;
      this.props.updateSetting(setting);
    } else {
      this.props.createSetting(SETTING_KEY, configJson);
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
          <FormattedMessage id="vmpConfig.operatorCredentialsRetentionTime" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.operatorCredentialsRetentionTimeTooltip' })}
          />
        </Label>
        <InputWithPlaceholder
          placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.days' })}
          showPlaceholder={!!operatorCredentialsRetentionTime}
          value={operatorCredentialsRetentionTime}
          onChange={this.onValueChange('operatorCredentialsRetentionTime')}
          type="number"
          pattern="[1-9]"
        />
      </>
    );
  };

  operatorOfflineSessionTimeout = () => {
    const operatorOfflineSessionTimeout = this.state.config.operatorOfflineSessionTimeout;
    return (
      <>
        <Label>
          <FormattedMessage id="vmpConfig.operatorOfflineSessionTimeout" />
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={this.props.intl.formatMessage({ id: 'vmpConfig.operatorOfflineSessionTimeoutTooltip' })}
          />
        </Label>
        <InputWithPlaceholder
          placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.minutes' })}
          showPlaceholder={!!operatorOfflineSessionTimeout}
          value={operatorOfflineSessionTimeout}
          onChange={this.onValueChange('operatorOfflineSessionTimeout')}
          type="number"
          pattern="[1-9]"
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

  removeManufacturer = idx => () => {
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

  addManufacturer = () => {
    const { manufacturers } = this.state.config;
    manufacturers.push({});
    this.onValueChange('manufacturers')(manufacturers);
  };

  onManufacturerChange = (i, fieldName) => e => {
    const { manufacturers, vaccine } = this.state.config;
    const value = extractEventValue(e);
    if (fieldName === 'name') {
      // update regimen's manufacturers when the name has changed
      const name = manufacturers[i].name;
      vaccine.forEach(v => {
        v.manufacturers = v.manufacturers.map(mf => (mf === name ? value : mf));
      });
      this.onValueChange('vaccine')(vaccine);
    }
    manufacturers[i][fieldName] = value;
    this.onValueChange('manufacturers')(manufacturers);
  };

  manufacturers = () => {
    const manufacturers = this.state.config.manufacturers || [];
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
        {manufacturers.map((manufacturer, i) => (
          <div key={`manufacturers-${i}`} className="inline-fields">
            <InputWithPlaceholder
              placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.manufacturersName' })}
              showPlaceholder={!!manufacturer.name}
              value={manufacturer.name}
              onChange={this.onManufacturerChange(i, 'name')}
              wrapperClassName="flex-1"
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
                  onClick={this.removeManufacturer(i)}
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
        ))}
      </>
    );
  };

  onVaccineChange = (i, fieldName, isMultiselect) => e => {
    const { vaccine } = this.state.config;
    vaccine[i][fieldName] = isMultiselect ? e.map(option => option.label) : extractEventValue(e);
    this.onValueChange('vaccine')(vaccine);
  };

  removeRegimen = idx => () => {
    const { vaccine } = this.state.config;
    vaccine.splice(idx, 1);
    if (vaccine.length === 0) {
      this.addRegimen();
    }
    this.onValueChange('vaccine')(vaccine);
  };

  addRegimen = () => {
    const { vaccine } = this.state.config;
    vaccine.push({});
    this.onValueChange('vaccine')(vaccine);
  };

  regimen = () => {
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
        {(vaccine || []).map((regimen, i) => (
          <div key={`regimen-${i}`} className="inline-fields">
            <InputWithPlaceholder
              placeholder={this.props.intl.formatMessage({ id: 'vmpConfig.regimenName' })}
              showPlaceholder={!!regimen.name}
              value={regimen.name}
              onChange={this.onVaccineChange(i, 'name', false)}
              wrapperClassName="flex-1"
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
            />
            <div className="align-items-center justify-content-center d-flex action-icons">
              <div className="action-icons-inner">
                <img
                  src={Minus}
                  title={this.props.intl.formatMessage({ id: 'vmpConfig.delete' })}
                  alt="remove"
                  className="remove-item"
                  onClick={this.removeRegimen(i)}
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
        ))}
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
            showPlaceholder={!!irisScore}
            value={irisScore}
            onChange={this.onValueChange('irisScore')}
            type="number"
            pattern="[1-9]"
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
          addressParts.sort((ap1, ap2) => ap1.mappingPos || 0 > ap2.mappingPos || 0);
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
                      onChange={this.onCountryChange(i, j, 'field', true)}
                      options={ADDRESS_OPTIONS}
                      wrapperClassName="flex-1"
                      classNamePrefix="cfl-select"
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

  render() {
    const { appError, appLoading, loading, config } = this.props;
    return (
      <div className="vmp-config">
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

const mapStateToProps = ({ apps, settings }) => ({
  syncScopes: (apps.vmpConfig && apps.vmpConfig.syncScopes) || DEFAULT_SYNC_SCOPES,
  authSteps: (apps.vmpConfig && apps.vmpConfig.authSteps) || DEFAULT_AUTH_STEPS,
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting
});

const mapDispatchToProps = { getSettingByQuery, updateSetting, createSetting };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(VmpConfig)));
