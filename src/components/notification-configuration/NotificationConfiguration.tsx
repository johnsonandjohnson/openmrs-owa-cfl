/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ICountryProperty, ICountryPropertyValue } from "../../shared/models/country-property";
import { getCountryProperties, setCountryPropertyValues } from "../../redux/reducers/countryProperty";
import { getCallflowsProviders, getSmsProviders } from "../../redux/reducers/provider";
import { Button, Label, Spinner } from "reactstrap";
import ExpandableSection from "../common/expandable-section/ExpandableSection";
import { InputWithPlaceholder, SelectWithPlaceholder } from "../common/form/withPlaceholder";
import { extractEventValue, selectDefaultTheme } from "../../shared/util/form-util";
import { errorToast, successToast } from "../toast-handler/toast-handler";
import _ from "lodash";
import { Switch } from "../common/switch/Switch";
import Divider from "../common/divider/Divider";
import { TimePicker } from "../common/time-picker/TimePicker";
import { PlusMinusButtons } from "../common/form/PlusMinusButtons";
import { ConfirmationModal } from "../common/form/ConfirmationModal";
import ValidationError from "../common/form/ValidationError";
import "./NotificationConfiguration.scss";
import "../Inputs.scss";
import {
  BEST_CONTACT_TIME_PROPERTY_NAME,
  CALL_PROPERTY_NAME,
  CONFIGURATION_NAME_PROPERTY_NAME,
  COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER,
  COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER_DEFAULT,
  COUNTRY_CONFIGURATION_TO_PROPERTY_MAPPING,
  DEFAULT_COUNTRY_CONFIGURATION,
  DEFAULT_COUNTRY_CONFIGURATION_NAME,
  NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME,
  NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME,
  PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME,
  PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER,
  PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER_DEFAULT,
  PROPERTY_TO_COUNTRY_CONFIGURATION_MAPPING,
  SEND_CALL_REMINDER_PROPERTY_NAME,
  SEND_SMS_REMINDER_PROPERTY_NAME,
  SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME,
  SEND_WHATSAPP_REMINDER_PROPERTY_NAME,
  SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME,
  SHOULD_CREATE_FIRST_VISIT,
  SHOULD_CREATE_FUTURE_VISITS,
  SMS_PROPERTY_NAME,
  VISIT_REMINDER_PROPERTY_NAME,
  WHATSAPP_PROPERTY_NAME,
} from "../../shared/constants/notification-configuration";
import { ONE, TEN, ZERO } from "../../shared/constants/input";
import { ROOT_URL } from "../../shared/constants/openmrs";
import { COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION } from "../../shared/constants/concept";
import { getConcept } from "../../redux/reducers/concept";
import { addBreadcrumbs } from "src/redux/reducers/breadcrumbs";
import {
  CONFIGURE_METADATA_BREADCRUMB_ELEMENT,
  SYSTEM_ADMINISTRATION_BREADCRUMB_ELEMENT,
} from "src/shared/constants/breadcrumbs";

interface IStore {
  appError: string;
  appLoading: boolean;
  error: string;
  loading: boolean;
  success: boolean;
  smsProviders: { name: string }[];
  callflowsProviders: { name: string }[];
  messageCountryProperties: ICountryProperty[];
  isSetValuesSuccessful: boolean;
  conceptCountryOptions: { label: string; value: string }[];
  loadingConcept: boolean;
}

interface INotificationConfigurationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

interface INotificationConfigurationState {
  notificationConfiguration: any[];
  isAllSectionsExpanded: boolean;
  isConfirmationModalOpen: boolean;
}

class NotificationConfiguration extends React.Component<
  INotificationConfigurationProps,
  INotificationConfigurationState
> {
  state = {
    notificationConfiguration: [],
    isAllSectionsExpanded: false,
    isConfirmationModalOpen: false,
  };

  componentDidMount() {
    this.props.getCountryProperties();
    this.props.getCallflowsProviders();
    this.props.getSmsProviders();
    this.props.getConcept(COUNTRY_CONCEPT_UUID, COUNTRY_CONCEPT_REPRESENTATION);
    this.props.addBreadcrumbs([SYSTEM_ADMINISTRATION_BREADCRUMB_ELEMENT, CONFIGURE_METADATA_BREADCRUMB_ELEMENT]);
  }

  componentDidUpdate(prevProps: Readonly<INotificationConfigurationProps>) {
    const { intl, messageCountryProperties, loading, isSetValuesSuccessful, error } = this.props;

    if (prevProps.messageCountryProperties !== messageCountryProperties) {
      this.extractCountryProperties();
    }

    if (!prevProps.isSetValuesSuccessful && isSetValuesSuccessful) {
      successToast(intl.formatMessage({ id: "notificationConfiguration.success" }));
      this.setState({ isAllSectionsExpanded: false });
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    } else {
      // Do nothing
    }
  }

  extractCountryProperties = () => {
    const messageCountryPropertiesMap = this.getMessageCountryPropertiesByCountry();
    this.setState({ notificationConfiguration: this.buildNotificationConfiguration(messageCountryPropertiesMap) });
  };

  getMessageCountryPropertiesByCountry = () =>
    this.props.messageCountryProperties.reduce((map: Map<string, ICountryProperty[]>, property: ICountryProperty) => {
      const countryConfigurationName = this.getCountryConfigurationName(property);

      if (map.get(countryConfigurationName)) {
        map.get(countryConfigurationName).push(property);
      } else {
        map.set(countryConfigurationName, [property]);
      }
      return map;
    }, new Map<string, ICountryProperty[]>());

  getCountryConfigurationName = ({ country }) => (country ? country.display : DEFAULT_COUNTRY_CONFIGURATION_NAME);

  buildNotificationConfiguration = (messageCountryPropertiesMap: Map<string, ICountryProperty[]>) => {
    const notificationConfiguration = [];

    messageCountryPropertiesMap.forEach((singleCountryProperties: ICountryProperty[], configurationName: string) => {
      const configurationForCountry = _.cloneDeep(DEFAULT_COUNTRY_CONFIGURATION);
      configurationForCountry[CONFIGURATION_NAME_PROPERTY_NAME] = configurationName;

      singleCountryProperties.forEach((singleCountryProperty: ICountryProperty) => {
        const singleCountryPropertyName = singleCountryProperty[CONFIGURATION_NAME_PROPERTY_NAME];
        const configurationPropertyName = COUNTRY_CONFIGURATION_TO_PROPERTY_MAPPING[singleCountryPropertyName];

        const valueGetter =
          COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER[singleCountryPropertyName] ??
          COUNTRY_CONFIGURATION_TO_PROPERTY_GETTER_DEFAULT;
        configurationForCountry[configurationPropertyName] = valueGetter(singleCountryProperty?.value);
      });

      notificationConfiguration.push(configurationForCountry);
    });

    return notificationConfiguration;
  };

  isSaveDisabled = () =>
    this.props.loading || this.state.notificationConfiguration.some((configuration) => !configuration.name);

  onSave = () => this.setState({ isConfirmationModalOpen: true });

  save = () => {
    const newMessageCountryPropertiesMap = this.extractCountryPropertyValuesMapFromState();
    const toDeleteMessageCountryPropertiesMap = this.getCountryPropertyValuesToDelete(newMessageCountryPropertiesMap);

    const allMessageCountryPropertiesMap = new Map([
      ...Array.from(newMessageCountryPropertiesMap.entries()),
      ...Array.from(toDeleteMessageCountryPropertiesMap.entries()),
    ]);
    const allMessageCountryPropertyValues = this.flattenAllCountryPropertyValuesMap(allMessageCountryPropertiesMap);

    this.props.setCountryPropertyValues(allMessageCountryPropertyValues);
  };

  extractCountryPropertyValuesMapFromState = () => {
    const { notificationConfiguration } = this.state;
    const newMessageCountryPropertiesMap = new Map<String, ICountryPropertyValue[]>();

    notificationConfiguration.forEach((configuration) => {
      const { name, ...configurationProps } = configuration;

      newMessageCountryPropertiesMap.set(name, [] as ICountryPropertyValue[]);

      Object.keys(configurationProps).forEach((notificationConfigurationPropertyName) => {
        if (notificationConfigurationPropertyName !== "undefined") {
          const valueGetter =
            PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER[notificationConfigurationPropertyName] ??
            PROPERTY_TO_COUNTRY_CONFIGURATION_GETTER_DEFAULT;

          const countryPropertyValue = {
            country: this.getCountryNameFromConfigurationName(configuration[CONFIGURATION_NAME_PROPERTY_NAME]),
            name: PROPERTY_TO_COUNTRY_CONFIGURATION_MAPPING[notificationConfigurationPropertyName],
            value: valueGetter(configuration[notificationConfigurationPropertyName]),
          } as ICountryPropertyValue;

          newMessageCountryPropertiesMap.get(name).push(countryPropertyValue);
        }
      });
    });

    return newMessageCountryPropertiesMap;
  };

  getCountryPropertyValuesToDelete = (newMessageCountryPropertiesMap: Map<String, ICountryPropertyValue[]>) => {
    const toDeleteMessageCountryPropertiesMap = new Map<String, ICountryPropertyValue[]>();
    this.props.messageCountryProperties.forEach((countryProperty) => {
      const configurationName = this.getCountryConfigurationName(countryProperty);

      if (!newMessageCountryPropertiesMap.has(configurationName)) {
        const nullCountryPropertyValue = this.getNullCountryValue(
          this.getCountryNameFromConfigurationName(configurationName),
          countryProperty.name,
        );

        if (!toDeleteMessageCountryPropertiesMap.has(configurationName)) {
          toDeleteMessageCountryPropertiesMap.set(configurationName, [] as ICountryPropertyValue[]);
        }

        toDeleteMessageCountryPropertiesMap.get(configurationName).push(nullCountryPropertyValue);
      }
    });

    return toDeleteMessageCountryPropertiesMap;
  };

  getCountryNameFromConfigurationName = (configurationName: string) =>
    configurationName === DEFAULT_COUNTRY_CONFIGURATION_NAME ? null : configurationName;

  flattenAllCountryPropertyValuesMap = (allMessageCountryPropertiesMap: Map<String, ICountryPropertyValue[]>) => {
    const allMessageCountryPropertyValues = [] as ICountryPropertyValue[];
    allMessageCountryPropertiesMap.forEach((countryPropertyValues: ICountryPropertyValue[], countryName: string) => {
      countryPropertyValues.forEach((countryPropertyValue: ICountryPropertyValue) =>
        allMessageCountryPropertyValues.push(countryPropertyValue),
      );
    });

    return allMessageCountryPropertyValues;
  };

  // Gets Country Property Value with null - used to inform BE that this property has to be retired.
  getNullCountryValue = (country, name) => ({ country, name } as ICountryPropertyValue);

  return = () => {
    window.location.href = ROOT_URL;
  };

  closeModal = () => this.setState({ isConfirmationModalOpen: false });

  confirmationModal = () => (
    <ConfirmationModal
      header={{ id: "notificationConfiguration.confirmationModal.header" }}
      body={{ id: "notificationConfiguration.confirmationModal.body" }}
      onYes={() => {
        this.save();
        this.closeModal();
      }}
      onNo={this.closeModal}
      isOpen={this.state.isConfirmationModalOpen}
    />
  );

  onChange = (configurationIdx, propertyName, isSelect = false) => (event) => {
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const value = isSelect ? event.value : extractEventValue(event);
    if (!configuration) {
      notificationConfiguration.push({
        [CONFIGURATION_NAME_PROPERTY_NAME]: configuration[CONFIGURATION_NAME_PROPERTY_NAME],
      });
    }
    configuration[propertyName] = value;
    this.setState({ notificationConfiguration });
  };

  getBooleanValue = (value) => {
    return value === "true" || value === true ? true : false;
  };

  smsSettings = (configurationIdx) => {
    const { intl, smsProviders } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const smsProviderOptions = smsProviders.map((provider) => ({ label: provider.name, value: provider.name }));
    const smsProvider = smsProviderOptions.find((provider) => provider.value === configuration?.[SMS_PROPERTY_NAME]);
    const shouldSendSmsUponRegistration = this.getBooleanValue(
      configuration?.[SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME],
    );
    const shouldSendSmsReminder = this.getBooleanValue(configuration?.[SEND_SMS_REMINDER_PROPERTY_NAME]);

    return (
      <>
        <div className="py-3">
          <Label>
            <FormattedMessage id="notificationConfiguration.smsSettings" />
          </Label>
          <div className="inline-fields">
            <div className="col-6 pl-0">
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: "notificationConfiguration.provider" })}
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
                id={`sms-upon-registration-switch-${configurationIdx}`}
                intl={intl}
                labelTranslationId="notificationConfiguration.uponRegistration"
                checked={shouldSendSmsUponRegistration}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, SEND_SMS_UPON_REGISTRATION_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  whatsAppSettings = (configurationIdx) => {
    const { intl, smsProviders } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const whatsAppProviderOptions = smsProviders.map((provider) => ({ label: provider.name, value: provider.name }));
    const whatsAppProvider = whatsAppProviderOptions.find(
      (provider) => provider.value === configuration?.[WHATSAPP_PROPERTY_NAME],
    );
    const shouldSendWhatsAppUponRegistration = this.getBooleanValue(
      configuration?.[SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME],
    );
    const shouldSendWhatsAppReminder = this.getBooleanValue(configuration?.[SEND_WHATSAPP_REMINDER_PROPERTY_NAME]);
    return (
      <>
        <div className="py-3">
          <Label>
            <FormattedMessage id="notificationConfiguration.whatsAppSettings" />
          </Label>
          <div className="inline-fields">
            <div className="col-6 pl-0">
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: "notificationConfiguration.provider" })}
                showPlaceholder={!!whatsAppProvider}
                value={whatsAppProvider}
                onChange={this.onChange(configurationIdx, WHATSAPP_PROPERTY_NAME, true)}
                options={whatsAppProviderOptions}
                wrapperClassName="flex-1"
                classNamePrefix="default-select"
                theme={selectDefaultTheme}
              />
            </div>
            <div className="col-6 px-5">
              <Switch
                id={`whatsApp-upon-registration-switch-${configurationIdx}`}
                intl={intl}
                labelTranslationId="notificationConfiguration.uponRegistration"
                checked={shouldSendWhatsAppUponRegistration}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, SEND_WHATSAPP_UPON_REGISTRATION_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  callSettings = (configurationIdx) => {
    const { intl, callflowsProviders } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const callflowsProviderOptions = callflowsProviders.map((provider) => ({
      label: provider.name,
      value: provider.name,
    }));
    const callflowsProvider = callflowsProviderOptions.find(
      (provider) => provider.value === configuration?.[CALL_PROPERTY_NAME],
    );
    const shouldPerformCallUponRegistration = this.getBooleanValue(
      configuration?.[PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME],
    );
    const shouldSendCallReminder = this.getBooleanValue(configuration?.[SEND_CALL_REMINDER_PROPERTY_NAME]);

    return (
      <>
        <div className="py-3">
          <Label>
            <FormattedMessage id="notificationConfiguration.callSettings" />
          </Label>
          <div className="inline-fields">
            <div className="col-6 pl-0">
              <SelectWithPlaceholder
                placeholder={intl.formatMessage({ id: "notificationConfiguration.provider" })}
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
                id={`call-upon-registration-switch-${configurationIdx}`}
                intl={intl}
                labelTranslationId="notificationConfiguration.uponRegistration"
                checked={shouldPerformCallUponRegistration}
                checkedTranslationId="common.switch.on"
                uncheckedTranslationId="common.switch.off"
                onChange={this.onChange(configurationIdx, PERFORM_CALL_UPON_REGISTRATION_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  notificationWindowAndBestContactTime = (configurationIdx) => {
    const { intl } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const notificationTimeWindowFrom = !!configuration?.[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]
      ? configuration[NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME]
      : null;
    const notificationTimeWindowTo = !!configuration?.[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]
      ? configuration[NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME]
      : null;
    const bestContactTime = !!configuration?.[BEST_CONTACT_TIME_PROPERTY_NAME]
      ? configuration[BEST_CONTACT_TIME_PROPERTY_NAME]
      : null;

    return (
      <>
        <div className="inline-fields py-3">
          <div className="col-6 pl-0">
            <Label>
              <FormattedMessage id="notificationConfiguration.allowedNotificationWindow.label" />
            </Label>
            <div className="inline-fields">
              <TimePicker
                placeholder={intl.formatMessage({ id: "notificationConfiguration.allowedNotificationWindow.from" })}
                showPlaceholder={!!notificationTimeWindowFrom}
                value={notificationTimeWindowFrom}
                onChange={this.onChange(configurationIdx, NOTIFICATION_TIME_WINDOW_FROM_PROPERTY_NAME)}
              />
              <TimePicker
                placeholder={intl.formatMessage({ id: "notificationConfiguration.allowedNotificationWindow.to" })}
                showPlaceholder={!!notificationTimeWindowTo}
                value={notificationTimeWindowTo}
                onChange={this.onChange(configurationIdx, NOTIFICATION_TIME_WINDOW_TO_PROPERTY_NAME)}
              />
            </div>
          </div>
          <div className="col-6 pl-5">
            <Label>
              <FormattedMessage id="notificationConfiguration.bestContactTime.label" />
            </Label>
            <div className="inline-fields">
              <TimePicker
                placeholder={intl.formatMessage({ id: "notificationConfiguration.bestContactTime.placeholder" })}
                showPlaceholder={!!bestContactTime}
                value={bestContactTime}
                onChange={this.onChange(configurationIdx, BEST_CONTACT_TIME_PROPERTY_NAME)}
              />
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  onVisitReminderChange = (configurationIdx, reminderIdx) => (event) => {
    const { notificationConfiguration } = this.state;
    const extractedEventValue = extractEventValue(event);
    const value = !!extractedEventValue ? Number.parseInt(extractedEventValue, TEN) : ZERO;
    if (Number.isInteger(value) && value >= ZERO) {
      notificationConfiguration[configurationIdx][VISIT_REMINDER_PROPERTY_NAME][reminderIdx] = value;
      this.setState({ notificationConfiguration });
    }
  };

  addVisitReminder = (configurationIdx) => {
    const { notificationConfiguration } = this.state;
    notificationConfiguration[configurationIdx][VISIT_REMINDER_PROPERTY_NAME].push(ZERO);
    this.setState({ notificationConfiguration });
  };

  removeVisitReminder = (configurationIdx, reminderIdx) => {
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    configuration[VISIT_REMINDER_PROPERTY_NAME].splice(reminderIdx, ONE);
    if (!configuration[VISIT_REMINDER_PROPERTY_NAME].length) {
      configuration[VISIT_REMINDER_PROPERTY_NAME].push(ZERO);
    }
    this.setState({ notificationConfiguration });
  };

  visitReminder = (configurationIdx) => {
    const { intl } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const visitReminders = !!configuration?.[VISIT_REMINDER_PROPERTY_NAME]
      ? configuration[VISIT_REMINDER_PROPERTY_NAME]
      : [ZERO];

    return (
      <>
        <div className="pt-3 py-3">
          <Label>
            <FormattedMessage id="notificationConfiguration.visitReminder.label" />
          </Label>
          {visitReminders.map((reminder, i) => (
            <div className="inline-fields py-1" key={`${configuration}-${configurationIdx}-reminder-${i}`}>
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: "notificationConfiguration.visitReminder.placeholder" })}
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
        <Divider />
      </>
    );
  };

  firstAndFutureVisitsSettings = (configurationIdx) => {
    const { intl } = this.props;
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    const shouldCreateFirstVisit = this.getBooleanValue(configuration?.[SHOULD_CREATE_FIRST_VISIT]);
    const shouldCreateFutureVisits = this.getBooleanValue(configuration?.[SHOULD_CREATE_FUTURE_VISITS]);

    return (
      <div className="col-6 px-0 py-1">
        <Switch
          id={`creating-first-visit-switch-${configurationIdx}`}
          intl={intl}
          labelTranslationId="notificationConfiguration.createFirstVisit"
          checked={shouldCreateFirstVisit}
          checkedTranslationId="common.switch.on"
          uncheckedTranslationId="common.switch.off"
          onChange={this.onChange(configurationIdx, SHOULD_CREATE_FIRST_VISIT)}
        />
        <Switch
          id={`creating-future-visits-switch-${configurationIdx}`}
          intl={intl}
          labelTranslationId="notificationConfiguration.createFutureVisits"
          checked={shouldCreateFutureVisits}
          checkedTranslationId="common.switch.on"
          uncheckedTranslationId="common.switch.off"
          onChange={this.onChange(configurationIdx, SHOULD_CREATE_FUTURE_VISITS)}
        />
      </div>
    );
  };

  onCountryChange = (configurationIdx) => (event) => {
    const { notificationConfiguration } = this.state;
    const configuration = notificationConfiguration[configurationIdx];
    configuration[CONFIGURATION_NAME_PROPERTY_NAME] = event.value;
    this.setState({ notificationConfiguration });
  };

  addNewCountryConfiguration = () => {
    const { notificationConfiguration } = this.state;
    notificationConfiguration.push(_.cloneDeep(DEFAULT_COUNTRY_CONFIGURATION));
    this.setState({ notificationConfiguration });
  };

  removeCountryConfiguration = (configurationIdx) => {
    const { notificationConfiguration } = this.state;
    notificationConfiguration.splice(configurationIdx, ONE);
    this.setState({ notificationConfiguration });
  };

  countryConfiguration = (configuration, configurationIdx) => {
    const { intl, conceptCountryOptions } = this.props;
    const { isAllSectionsExpanded, notificationConfiguration } = this.state;
    const configurationName = configuration[CONFIGURATION_NAME_PROPERTY_NAME];
    const isDefaultCountryConfiguration = configurationName === DEFAULT_COUNTRY_CONFIGURATION_NAME;
    const countryOptions = conceptCountryOptions.filter(
      (country) =>
        !notificationConfiguration.map((configurationToMap) => configurationToMap.name).includes(country.value),
    );
    const headerComponent = isDefaultCountryConfiguration ? (
      <Label>
        <FormattedMessage id="notificationConfiguration.defaultCountry" />
      </Label>
    ) : (
      <div className="flex-1">
        <SelectWithPlaceholder
          placeholder={intl.formatMessage({ id: "notificationConfiguration.country" })}
          showPlaceholder={!!configurationName}
          value={
            !!configurationName && conceptCountryOptions.find((countryName) => countryName.value === configurationName)
          }
          onChange={this.onCountryChange(configurationIdx)}
          options={countryOptions}
          wrapperClassName={!configurationName ? "invalid" : ""}
          classNamePrefix="default-select"
          theme={selectDefaultTheme}
        />
        {!configurationName && <ValidationError message="common.error.required" />}
      </div>
    );
    const disabledHeaderComponent = isDefaultCountryConfiguration ? (
      headerComponent
    ) : (
      <InputWithPlaceholder
        placeholder={intl.formatMessage({ id: "notificationConfiguration.country" })}
        showPlaceholder={!!configurationName}
        value={!!configurationName ? configurationName : ""}
        wrapperClassName="flex-1"
        readOnly
      />
    );
    const bodyComponent = [
      this.smsSettings(configurationIdx),
      this.whatsAppSettings(configurationIdx),
      this.callSettings(configurationIdx),
      this.notificationWindowAndBestContactTime(configurationIdx),
    ];
    return (
      <ExpandableSection
        key={`configuration-${configurationIdx}`}
        headerComponent={headerComponent}
        disabledHeaderComponent={disabledHeaderComponent}
        bodyComponent={bodyComponent}
        isRemovable={!isDefaultCountryConfiguration}
        onRemove={() => this.removeCountryConfiguration(configurationIdx)}
        isExpandTriggered={isAllSectionsExpanded}
      />
    );
  };

  expandOrCollapseAllButton = () => {
    const { isAllSectionsExpanded } = this.state;
    return (
      <Button
        onClick={() => this.setState((state) => ({ isAllSectionsExpanded: !state.isAllSectionsExpanded }))}
        className="cancel"
      >
        <FormattedMessage id={`notificationConfiguration.button.${isAllSectionsExpanded ? "collapse" : "expand"}`} />
      </Button>
    );
  };

  render() {
    const { appError, appLoading, loading, loadingConcept } = this.props;
    const { notificationConfiguration } = this.state;
    const isLoading = appLoading || loading || loadingConcept;
    return (
      <div className="notification-configuration">
        {this.confirmationModal()}
        <h2>
          <FormattedMessage id="notificationConfiguration.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="section">
                <div className="title-section">
                  <h2>
                    <FormattedMessage id="notificationConfiguration.configureSettings" />
                  </h2>
                  {this.expandOrCollapseAllButton()}
                </div>
                {notificationConfiguration.map((configuration, idx) => this.countryConfiguration(configuration, idx))}
                <div className="d-flex justify-content-end mt-4 mb-2">
                  <Button className="btn btn-primary" onClick={this.addNewCountryConfiguration}>
                    <FormattedMessage id="notificationConfiguration.button.addNewCountry" />
                  </Button>
                </div>
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return}>
                    <FormattedMessage id="common.cancel" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.onSave} disabled={this.isSaveDisabled()}>
                    <FormattedMessage id="common.confirm" />
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

const mapStateToProps = ({
  apps,
  provider,
  countryProperty,
  concept: {
    concept: { setMembers: countries },
    loading: { concept: loadingConcept },
  },
}) =>
  ({
    appError: apps.errorMessage,
    appLoading: apps.loading,
    error: apps.errorMessage,
    loading: countryProperty.loading,
    success: countryProperty.success,
    smsProviders: provider.smsProviders,
    callflowsProviders: provider.callflowsProviders,
    messageCountryProperties: countryProperty.countryProperties,
    isSetValuesSuccessful: countryProperty.isSetValuesSuccessful,
    conceptCountryOptions: countries
      .sort((countryA, countryB) => countryA.display.localeCompare(countryB.display))
      .map(({ display }) => ({ label: display, value: display })),
    countryNames: countries.map(({ display: fullySpecified, names }) => ({
      fullySpecified,
      short: names.find(({ display }) => display !== fullySpecified)?.display,
    })),
    loadingConcept,
  } as IStore);

const mapDispatchToProps = {
  getCountryProperties,
  setCountryPropertyValues,
  getCallflowsProviders,
  getSmsProviders,
  getConcept,
  addBreadcrumbs,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(NotificationConfiguration)));
