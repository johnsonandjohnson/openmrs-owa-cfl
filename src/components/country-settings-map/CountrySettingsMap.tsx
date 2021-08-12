import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { getCallflowsProviders, getSmsProviders } from '../../redux/reducers/provider';
import { Button, Label, Spinner } from 'reactstrap';
import ExpandableSection from '../common/expandable-section/ExpandableSection';
import { InputWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue, selectDefaultTheme } from 'src/shared/util/form-util';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import _ from 'lodash';
import { parseJson } from 'src/shared/util/json-util';
import Switch from '../common/switch/Switch';
import Divider from '../common/divider/Divider';
import TimePicker from '../common/time-picker/TimePicker';
import moment from 'moment';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import './CountrySettingsMap.scss';
import '../Inputs.scss';
import { COUNTRY_OPTIONS } from 'src/shared/constants/vmp-config';
import {
  COUNTRY_SETTINGS_MAP_SETTING_KEY,
  DEFAULT_COUNTRY_SETTINGS_MAP,
  DEFAULT_COUNTRY_CONFIGURATION_NAME,
  DEFAULT_COUNTRY_CONFIGURATION,
  CONFIGURATION_NAME_PROPERTY_NAME,
  NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME,
  NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME,
  BEST_CONTACT_TIME_PROPERTY_NAME,
  VISIT_REMINDER_PROPERTY_NAME,
  SMS_PROPERTY_NAME,
  SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME,
  SEND_SMS_REMINDER_PROPERTY_NAME,
  CALL_PROPERTY_NAME,
  PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME,
  SEND_CALL_REMINDER_PROPERTY_NAME
} from 'src/shared/constants/country-settings-map';
import { DEFAULT_TIME_FORMAT, ONE, TEN, ZERO } from 'src/shared/constants/input';
import { ROOT_URL } from 'src/shared/constants/openmrs';

interface ICountrySettingsMapProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

interface ICountrySettingsMapState {
  countrySettingsMap: any[];
  isAllSectionsExpanded: boolean;
  isConfirmationModalOpen: boolean;
}

class CountrySettingsMap extends React.Component<ICountrySettingsMapProps, ICountrySettingsMapState> {
  state = {
    countrySettingsMap: [],
    isAllSectionsExpanded: false,
    isConfirmationModalOpen: false
  };

  componentDidMount() {
    this.props.getSettingByQuery(COUNTRY_SETTINGS_MAP_SETTING_KEY);
    this.props.getCallflowsProviders();
    this.props.getSmsProviders();
  }

  componentDidUpdate(prevProps: Readonly<ICountrySettingsMapProps>, prevState: Readonly<ICountrySettingsMapState>, snapshot?: any) {
    const { intl, config, loading, success, error } = this.props;
    if (prevProps.config !== config) {
      this.extractConfigData();
    }
    if (!prevProps.success && success) {
      successToast(intl.formatMessage({ id: 'countrySettingsMap.success' }));
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    }
  }

  extractConfigData = () => {
    let config = parseJson(this.props.config);
    config = !!config[ZERO] ? config[ZERO] : _.cloneDeep(DEFAULT_COUNTRY_SETTINGS_MAP);
    const countrySettingsMap = [];
    Object.keys(config).forEach(configurationName => {
      const configuration = !!configurationName ? config[configurationName] : null;
      if (!!configuration) {
        configuration[CONFIGURATION_NAME_PROPERTY_NAME] = configurationName;
        if (configuration.hasOwnProperty(NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME)) {
          configuration[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME] = moment(
            configuration[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME],
            DEFAULT_TIME_FORMAT
          );
        }
        if (configuration.hasOwnProperty(NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME)) {
          configuration[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME] = moment(
            configuration[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME],
            DEFAULT_TIME_FORMAT
          );
        }
        if (configuration.hasOwnProperty(BEST_CONTACT_TIME_PROPERTY_NAME)) {
          configuration[BEST_CONTACT_TIME_PROPERTY_NAME] = moment(configuration[BEST_CONTACT_TIME_PROPERTY_NAME], DEFAULT_TIME_FORMAT);
        }
        if (
          !configuration.hasOwnProperty(VISIT_REMINDER_PROPERTY_NAME) ||
          !Array.isArray(configuration[VISIT_REMINDER_PROPERTY_NAME]) ||
          !configuration[VISIT_REMINDER_PROPERTY_NAME].length
        ) {
          configuration[VISIT_REMINDER_PROPERTY_NAME] = [ZERO];
        }
        countrySettingsMap.push(configuration);
      }
    });
    this.setState({ countrySettingsMap });
  };

  onSave = () => this.setState({ isConfirmationModalOpen: true });

  save = () => {
    const { setting } = this.props;
    const { countrySettingsMap } = this.state;
    const settingValue = [{}];
    countrySettingsMap.forEach(configuration => {
      const { name, ...configurationProps } = configuration;
      if (
        configurationProps.hasOwnProperty(NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME) &&
        moment.isMoment(configurationProps[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME])
      ) {
        configurationProps[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME] = configurationProps[
          NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME
        ].format(DEFAULT_TIME_FORMAT);
      }
      if (
        configurationProps.hasOwnProperty(NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME) &&
        moment.isMoment(configurationProps[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME])
      ) {
        configurationProps[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME] = configurationProps[
          NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME
        ].format(DEFAULT_TIME_FORMAT);
      }
      if (
        configurationProps.hasOwnProperty(BEST_CONTACT_TIME_PROPERTY_NAME) &&
        moment.isMoment(configurationProps[BEST_CONTACT_TIME_PROPERTY_NAME])
      ) {
        configurationProps[BEST_CONTACT_TIME_PROPERTY_NAME] = configurationProps[BEST_CONTACT_TIME_PROPERTY_NAME].format(
          DEFAULT_TIME_FORMAT
        );
      }
      settingValue[ZERO][name] = configurationProps;
    });
    const settingValueJson = JSON.stringify(settingValue);
    if (setting && setting.uuid) {
      setting.value = settingValueJson;
      this.props.updateSetting(setting);
    } else {
      this.props.createSetting(COUNTRY_SETTINGS_MAP_SETTING_KEY, settingValueJson);
    }
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  closeModal = () => this.setState({ isConfirmationModalOpen: false });

  confirmationModal = () => (
    <ConfirmationModal
      header={{ id: 'countrySettingsMap.confirmationModal.body' }}
      body={{ id: 'countrySettingsMap.confirmationModal.body' }}
      onYes={() => {
        this.save();
        this.closeModal();
      }}
      onNo={this.closeModal}
      isOpen={this.state.isConfirmationModalOpen}
    />
  );

  onChange = (configurationIdx, propertyName, isSelect = false) => event => {
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    const value = isSelect ? event.value : extractEventValue(event);
    if (!configuration) {
      countrySettingsMap.push({ [CONFIGURATION_NAME_PROPERTY_NAME]: configuration[CONFIGURATION_NAME_PROPERTY_NAME] });
    }
    configuration[propertyName] = value;
    this.setState({ countrySettingsMap });
  };

  selectTextOption = value => ({ label: value, value });

  smsSettings = configurationIdx => {
    const { intl, smsProviders } = this.props;
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    const smsProviderOptions = smsProviders.map(provider => ({ label: provider.name, value: provider.name }));
    const smsProvider =
      !!configuration && !!configuration[SMS_PROPERTY_NAME] ? this.selectTextOption(configuration[SMS_PROPERTY_NAME]) : null;
    const shouldSendSmsUponRegistration =
      !!configuration && configuration[SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME] !== null
        ? configuration[SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME]
        : false;
    const shouldSendSmsReminder =
      !!configuration && configuration[SEND_SMS_REMINDER_PROPERTY_NAME] !== null ? configuration[SEND_SMS_REMINDER_PROPERTY_NAME] : false;
    return (
      <>
        <div className="py-3">
          <Label>
            <FormattedMessage id="countrySettingsMap.smsSettings" />
          </Label>
          <div className="inline-fields">
            <div className="col-6 pl-0">
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: 'countrySettingsMap.provider' })}
                showPlaceholder={!!smsProvider}
                value={smsProvider}
                onChange={this.onChange(configurationIdx, SMS_PROPERTY_NAME, true)}
                options={smsProviderOptions}
                wrapperClassName="flex-1"
                classNamePrefix="default-select"
                theme={selectDefaultTheme}
              />
            </div>
            <div className="col-6 px-5">
              <Switch
                intl={intl}
                labelTranslationId="countrySettingsMap.uponRegistration"
                checked={shouldSendSmsUponRegistration}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME)}
              />
              <Switch
                intl={intl}
                labelTranslationId="countrySettingsMap.visitReminder.switch"
                checked={shouldSendSmsReminder}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, SEND_SMS_REMINDER_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  callSettings = configurationIdx => {
    const { intl, callflowsProviders } = this.props;
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    const callflowsProviderOptions = callflowsProviders.map(provider => ({ label: provider.name, value: provider.name }));
    const callflowsProvider =
      !!configuration && !!configuration[CALL_PROPERTY_NAME] ? this.selectTextOption(configuration[CALL_PROPERTY_NAME]) : null;
    const shouldPerformCallUponRegistration =
      !!configuration && configuration[PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME] !== null
        ? configuration[PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME]
        : false;
    const shouldSendCallReminder =
      !!configuration && configuration[SEND_CALL_REMINDER_PROPERTY_NAME] !== null ? configuration[SEND_CALL_REMINDER_PROPERTY_NAME] : false;
    return (
      <>
        <div className="py-3">
          <Label>
            <FormattedMessage id="countrySettingsMap.callSettings" />
          </Label>
          <div className="inline-fields">
            <div className="col-6 pl-0">
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: 'countrySettingsMap.provider' })}
                showPlaceholder={!!callflowsProvider}
                value={callflowsProvider}
                onChange={this.onChange(configurationIdx, CALL_PROPERTY_NAME, true)}
                options={callflowsProviderOptions}
                wrapperClassName="flex-1"
                classNamePrefix="default-select"
                theme={selectDefaultTheme}
              />
            </div>
            <div className="col-6 px-5">
              <Switch
                intl={intl}
                labelTranslationId="countrySettingsMap.uponRegistration"
                checked={shouldPerformCallUponRegistration}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME)}
              />
              <Switch
                intl={intl}
                labelTranslationId="countrySettingsMap.visitReminder.switch"
                checked={shouldSendCallReminder}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, SEND_CALL_REMINDER_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  notificationWindowAndBestContactTime = configurationIdx => {
    const { intl } = this.props;
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    const notificationTimeWindowFrom =
      !!configuration && !!configuration[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]
        ? configuration[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]
        : null;
    const notificationTimeWindowTo =
      !!configuration && !!configuration[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]
        ? configuration[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]
        : null;
    const bestContactTime =
      !!configuration && !!configuration[BEST_CONTACT_TIME_PROPERTY_NAME] ? configuration[BEST_CONTACT_TIME_PROPERTY_NAME] : null;
    return (
      <div className="inline-fields py-3">
        <div className="col-6 pl-0">
          <Label>
            <FormattedMessage id="countrySettingsMap.allowedNotificationWindow.label" />
          </Label>
          <div className="inline-fields">
            <TimePicker
              placeholder={intl.formatMessage({ id: 'countrySettingsMap.allowedNotificationWindow.from' })}
              showPlaceholder={!!notificationTimeWindowFrom}
              value={notificationTimeWindowFrom}
              onChange={this.onChange(configurationIdx, NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME)}
            />
            <TimePicker
              placeholder={intl.formatMessage({ id: 'countrySettingsMap.allowedNotificationWindow.to' })}
              showPlaceholder={!!notificationTimeWindowTo}
              value={notificationTimeWindowTo}
              onChange={this.onChange(configurationIdx, NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME)}
            />
          </div>
        </div>
        <div className="col-6 pl-5">
          <Label>
            <FormattedMessage id="countrySettingsMap.bestContactTime.label" />
          </Label>
          <TimePicker
            placeholder={intl.formatMessage({ id: 'countrySettingsMap.bestContactTime.placeholder' })}
            showPlaceholder={!!bestContactTime}
            value={bestContactTime}
            onChange={this.onChange(configurationIdx, BEST_CONTACT_TIME_PROPERTY_NAME)}
          />
        </div>
      </div>
    );
  };

  onVisitReminderChange = (configurationIdx, reminderIdx) => event => {
    const { countrySettingsMap } = this.state;
    const extractedEventValue = extractEventValue(event);
    const value = !!extractedEventValue ? Number.parseInt(extractedEventValue, TEN) : ZERO;
    if (Number.isInteger(value) && value >= ZERO) {
      countrySettingsMap[configurationIdx][VISIT_REMINDER_PROPERTY_NAME][reminderIdx] = value;
      this.setState({ countrySettingsMap });
    }
  };

  addVisitReminder = configurationIdx => {
    const { countrySettingsMap } = this.state;
    countrySettingsMap[configurationIdx][VISIT_REMINDER_PROPERTY_NAME].push(ZERO);
    this.setState({ countrySettingsMap });
  };

  removeVisitReminder = (configurationIdx, reminderIdx) => {
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    configuration[VISIT_REMINDER_PROPERTY_NAME].splice(reminderIdx, ONE);
    if (!configuration[VISIT_REMINDER_PROPERTY_NAME].length) {
      configuration[VISIT_REMINDER_PROPERTY_NAME].push(ZERO);
    }
    this.setState({ countrySettingsMap });
  };

  visitReminder = configurationIdx => {
    const { intl } = this.props;
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    const visitReminders =
      !!configuration && !!configuration[VISIT_REMINDER_PROPERTY_NAME] ? configuration[VISIT_REMINDER_PROPERTY_NAME] : [ZERO];
    return (
      <div className="pt-5">
        <Label>
          <FormattedMessage id="countrySettingsMap.visitReminder.label" />
        </Label>
        {visitReminders.map((reminder, i) => (
          <div className="inline-fields py-1" key={`${configuration}-${configurationIdx}-reminder-${i}`}>
            <InputWithPlaceholder
              placeholder={intl.formatMessage({ id: 'countrySettingsMap.visitReminder.placeholder' })}
              showPlaceholder
              value={reminder}
              onChange={this.onVisitReminderChange(configurationIdx, i)}
              type="number"
              pattern="[1-9]"
              min={ZERO}
            />
            <PlusMinusButtons
              intl={intl}
              onPlusClick={() => this.addVisitReminder(configurationIdx)}
              onMinusClick={() => this.removeVisitReminder(configurationIdx, i)}
              isPlusButtonVisible={i === visitReminders.length - 1}
            />
          </div>
        ))}
      </div>
    );
  };

  onCountryChange = configurationIdx => event => {
    const { countrySettingsMap } = this.state;
    const configuration = countrySettingsMap[configurationIdx];
    configuration[CONFIGURATION_NAME_PROPERTY_NAME] = event.value;
    this.setState({ countrySettingsMap });
  };

  addNewCountryConfiguration = () => {
    const { countrySettingsMap } = this.state;
    countrySettingsMap.push(_.cloneDeep(DEFAULT_COUNTRY_CONFIGURATION));
    this.setState({ countrySettingsMap });
  };

  removeCountryConfiguration = configurationIdx => {
    const { countrySettingsMap } = this.state;
    countrySettingsMap.splice(configurationIdx, ONE);
    this.setState({ countrySettingsMap });
  };

  countryConfiguration = (configuration, configurationIdx) => {
    const { intl } = this.props;
    const { isAllSectionsExpanded, countrySettingsMap } = this.state;
    const configurationName = configuration[CONFIGURATION_NAME_PROPERTY_NAME];
    const isDefaultCountryConfiguration = configurationName === DEFAULT_COUNTRY_CONFIGURATION_NAME;
    const countryOptions = COUNTRY_OPTIONS.filter(
      country => !countrySettingsMap.map(configuration => configuration.name).includes(country.value)
    );
    const headerComponent = isDefaultCountryConfiguration ? (
      <Label>
        <FormattedMessage id="countrySettingsMap.defaultCountry" />
      </Label>
    ) : (
      <SelectWithPlaceholder
        placeholder={intl.formatMessage({ id: 'countrySettingsMap.country' })}
        showPlaceholder={!!configurationName}
        value={!!configurationName && COUNTRY_OPTIONS.find(countryName => countryName.value === configurationName)}
        onChange={this.onCountryChange(configurationIdx)}
        options={countryOptions}
        wrapperClassName="flex-1"
        classNamePrefix="default-select"
        theme={selectDefaultTheme}
      />
    );
    const disabledHeaderComponent = isDefaultCountryConfiguration ? (
      headerComponent
    ) : (
      <InputWithPlaceholder
        placeholder={intl.formatMessage({ id: 'countrySettingsMap.country' })}
        showPlaceholder={!!configurationName}
        value={!!configurationName ? configurationName : ''}
        wrapperClassName="flex-1"
        disabled
      />
    );
    const bodyComponent = [
      this.smsSettings(configurationIdx),
      this.callSettings(configurationIdx),
      this.notificationWindowAndBestContactTime(configurationIdx),
      this.visitReminder(configurationIdx)
    ];
    return (
      <ExpandableSection
        innerKey={`configurationName-${configurationIdx}`}
        headerComponent={headerComponent}
        disabledHeaderComponent={disabledHeaderComponent}
        bodyComponent={bodyComponent}
        isDeletable={!isDefaultCountryConfiguration}
        onDelete={() => this.removeCountryConfiguration(configurationIdx)}
        isExpandTriggered={isAllSectionsExpanded}
      />
    );
  };

  expandOrCollapseAllButton = () => {
    const { isAllSectionsExpanded } = this.state;
    return (
      <Button onClick={() => this.setState(state => ({ isAllSectionsExpanded: !state.isAllSectionsExpanded }))} className="cancel">
        <FormattedMessage id={`countrySettingsMap.button.${isAllSectionsExpanded ? 'collapse' : 'expand'}`} />
      </Button>
    );
  };

  render() {
    const { appError, appLoading, loading } = this.props;
    const { countrySettingsMap } = this.state;
    return (
      <div className="country-settings-map">
        {this.confirmationModal()}
        <h2>
          <FormattedMessage id="countrySettingsMap.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || loading ? (
            <Spinner />
          ) : (
            <>
              <div className="section">
                <div className="title-section">
                  <h2>
                    <FormattedMessage id="countrySettingsMap.configureSettings" />
                  </h2>
                  {this.expandOrCollapseAllButton()}
                </div>
                {countrySettingsMap.map((configuration, idx) => this.countryConfiguration(configuration, idx))}
                <div className="d-flex justify-content-end mt-4 mb-2">
                  <Button className="btn btn-primary" onClick={this.addNewCountryConfiguration}>
                    <FormattedMessage id="countrySettingsMap.button.addNewCountry" />
                  </Button>
                </div>
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return}>
                    <FormattedMessage id="vmpConfig.return" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.onSave} disabled={loading}>
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

const mapStateToProps = ({ apps, settings, provider }) => ({
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  isSettingExist: settings.isSettingExist,
  smsProviders: provider.smsProviders,
  callflowsProviders: provider.callflowsProviders
});

const mapDispatchToProps = { getSettingByQuery, createSetting, updateSetting, getCallflowsProviders, getSmsProviders };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(CountrySettingsMap)));
