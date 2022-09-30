/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createSetting, getSettings, updateSetting, deleteSetting } from '../../redux/reducers/settings';
import { getCallflowsProviders, getSmsProviders } from '../../redux/reducers/provider';
import { getMessagesTemplatesGlobalProperties } from '../../redux/reducers/messages';
import { Button, Label, Spinner } from 'reactstrap';
import ExpandableSection from '../common/expandable-section/ExpandableSection';
import { InputWithPlaceholder } from '../common/form/withPlaceholder';
import { extractEventValue } from '../../shared/util/form-util';
import { successToast, errorToast } from '../toast-handler/toast-handler';
import _ from 'lodash';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import ValidationError from '../common/form/ValidationError';
import './NotificationTemplates.scss';
import '../Inputs.scss';
import { EMPTY_STRING, ONE, ZERO } from '../../shared/constants/input';
import { ROOT_URL } from '../../shared/constants/openmrs';
import {
  DEFAULT_INJECTED_SERVICE,
  INJECTED_SERVICES_DELIMITER,
  INJECTED_SERVICES_KEY,
  INJECTED_SERVICES_KEY_VALUE_DELIMITER,
  INJECTED_SERVICES_SETTING_KEY,
  INJECTED_SERVICES_SETTING_KEY_SUFFIX,
  INJECTED_SERVICES_VALUE,
  NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX,
  TEMPLATE_DESCRIPTION_PROPERTY_NAME,
  TEMPLATE_NAME_PROPERTY_NAME,
  TEMPLATE_NAME_REGEX,
  TEMPLATE_UUID_PROPERTY_NAME,
  TEMPLATE_VALUE_PROPERTY_NAME
} from '../../shared/constants/notification-templates';
import { TextareaWithPlaceholder } from '../common/textarea/Textarea';
import { VelocityCodeEditorWithPlaceholder } from '../common/code-editor/VelocityCodeEditor';

interface INotificationConfigurationProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

interface INotificationConfigurationState {
  notificationTemplates: any[];
  savedNotificationTemplates: any[];
  isAllSectionsExpanded: boolean;
  isConfirmationModalOpen: boolean;
  unremovableGlobalProperties: string[];
  confirmationModalHeader: {};
  confirmationModalBody: {};
  onConfirmationModalConfirm: () => void;
  onConfirmationModalCancel: () => void;
  dirtyNotificationTemplates: Set<string>;
  unifiedSuccessToastDisplayed: boolean;
  isAllRequestsSent: boolean;
}

class NotificationConfiguration extends React.Component<INotificationConfigurationProps, INotificationConfigurationState> {
  state = {
    notificationTemplates: [],
    savedNotificationTemplates: [],
    isAllSectionsExpanded: false,
    isConfirmationModalOpen: false,
    unremovableGlobalProperties: [],
    confirmationModalHeader: { id: EMPTY_STRING },
    confirmationModalBody: { id: EMPTY_STRING },
    onConfirmationModalConfirm: null,
    onConfirmationModalCancel: null,
    dirtyNotificationTemplates: new Set<string>(),
    unifiedSuccessToastDisplayed: false,
    isAllRequestsSent: false
  };

  componentDidMount() {
    this.props.getMessagesTemplatesGlobalProperties();
  }

  componentDidUpdate(prevProps: Readonly<INotificationConfigurationProps>) {
    const { intl, settings, loading, success, appError, unremovableGlobalProperties } = this.props;
    if (prevProps.unremovableGlobalProperties !== unremovableGlobalProperties) {
      this.setState({ unremovableGlobalProperties: unremovableGlobalProperties.map(globalProperty => globalProperty.toLowerCase()) }, () =>
        this.props.getSettings(NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX)
      );
    } else if (prevProps.settings !== settings) {
      const sortedSettings = [];
      const injectedServicesSetting = settings.find(setting => setting[TEMPLATE_NAME_PROPERTY_NAME] === INJECTED_SERVICES_SETTING_KEY);
      const injectedServices = injectedServicesSetting[TEMPLATE_VALUE_PROPERTY_NAME].split(INJECTED_SERVICES_DELIMITER).map(service => ({
        [INJECTED_SERVICES_KEY]: service.split(INJECTED_SERVICES_KEY_VALUE_DELIMITER)[ZERO],
        [INJECTED_SERVICES_VALUE]: service.split(INJECTED_SERVICES_KEY_VALUE_DELIMITER)[ONE]
      }));
      injectedServicesSetting[TEMPLATE_VALUE_PROPERTY_NAME] = injectedServices;
      sortedSettings.push(injectedServicesSetting);
      const otherSetttings = settings.filter(setting => setting !== injectedServicesSetting);
      sortedSettings.push(...otherSetttings);
      sortedSettings.forEach(
        setting =>
          (setting[TEMPLATE_NAME_PROPERTY_NAME] = setting[TEMPLATE_NAME_PROPERTY_NAME].replace(
            NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX,
            EMPTY_STRING
          ))
      );
      this.setState({
        notificationTemplates: sortedSettings,
        savedNotificationTemplates: _.clone(sortedSettings),
        unifiedSuccessToastDisplayed: false
      });
    } else {
      // Do nothing
    }
    if (!prevProps.success && success && this.state.isAllRequestsSent && !this.state.unifiedSuccessToastDisplayed) {
      successToast(intl.formatMessage({ id: 'notificationTemplates.success' }));
      this.setState(
        {
          isAllSectionsExpanded: false,
          dirtyNotificationTemplates: new Set(),
          isAllRequestsSent: false,
          unifiedSuccessToastDisplayed: true
        },
        () => this.props.getSettings(NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX)
      );
    } else if (prevProps.appError !== this.props.appError && !loading) {
      errorToast(appError);
    } else {
      // Do nothing
    }
  }

  isSaveDisabled = () =>
    this.props.loading ||
    this.state.notificationTemplates
      .filter(template => template[TEMPLATE_NAME_PROPERTY_NAME] !== INJECTED_SERVICES_SETTING_KEY_SUFFIX)
      .some(template => {
        const templateNameRegex = new RegExp(TEMPLATE_NAME_REGEX);
        const templateName = template[TEMPLATE_NAME_PROPERTY_NAME];
        return !templateName || !templateNameRegex.test(templateName);
      });

  onSave = () =>
    this.setState({
      isConfirmationModalOpen: true,
      confirmationModalHeader: { id: 'notificationTemplates.saveModal.header' },
      confirmationModalBody: { id: 'notificationTemplates.saveModal.body' },
      onConfirmationModalConfirm: () => {
        this.save();
        this.closeModal();
      },
      onConfirmationModalCancel: this.closeModal
    });

  save = () => {
    const notificationTemplates = _.cloneDeep(this.state.notificationTemplates);
    notificationTemplates.forEach(
      template => (template[TEMPLATE_NAME_PROPERTY_NAME] = NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX + template[TEMPLATE_NAME_PROPERTY_NAME])
    );
    const savedNotificationTemplates = _.cloneDeep(this.state.savedNotificationTemplates);
    savedNotificationTemplates.forEach(
      template => (template[TEMPLATE_NAME_PROPERTY_NAME] = NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX + template[TEMPLATE_NAME_PROPERTY_NAME])
    );
    const injectedServices = notificationTemplates.find(
      template => template[TEMPLATE_NAME_PROPERTY_NAME] === INJECTED_SERVICES_SETTING_KEY
    );
    injectedServices[TEMPLATE_VALUE_PROPERTY_NAME] = injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].reduce(
      (accumulator, currentService, counter) =>
        accumulator +
        currentService[INJECTED_SERVICES_KEY] +
        INJECTED_SERVICES_KEY_VALUE_DELIMITER +
        currentService[INJECTED_SERVICES_VALUE] +
        (counter === injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].length - ONE ? EMPTY_STRING : INJECTED_SERVICES_DELIMITER),
      EMPTY_STRING
    );
    const deletedTemplates = savedNotificationTemplates.filter(
      savedTemplate =>
        !notificationTemplates.find(template => template[TEMPLATE_UUID_PROPERTY_NAME] === savedTemplate[TEMPLATE_UUID_PROPERTY_NAME])
    );
    deletedTemplates.forEach(template => this.props.deleteSetting(template));
    notificationTemplates.forEach(template => {
      if (template && template.uuid && this.state.dirtyNotificationTemplates.has(template[TEMPLATE_UUID_PROPERTY_NAME])) {
        this.props.updateSetting(template);
      } else if (template && !template.uuid) {
        this.props.createSetting(
          template[TEMPLATE_NAME_PROPERTY_NAME],
          template[TEMPLATE_VALUE_PROPERTY_NAME],
          template[TEMPLATE_DESCRIPTION_PROPERTY_NAME]
        );
      } else {
        // Do nothing
      }
    });
    this.setState({ isAllRequestsSent: true });
  };

  isRemovable = templateIdx => {
    const { notificationTemplates, unremovableGlobalProperties } = this.state;
    const globalPropertyName = notificationTemplates[templateIdx][TEMPLATE_NAME_PROPERTY_NAME];
    const globalPropertyFullName = NOTIFICATION_TEMPLATE_SETTING_KEY_PREFIX + globalPropertyName;
    return !globalPropertyName || (globalPropertyName && !unremovableGlobalProperties.includes(globalPropertyFullName.toLowerCase()));
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  closeModal = () => this.setState({ isConfirmationModalOpen: false });

  confirmationModal = () => (
    <ConfirmationModal
      header={this.state.confirmationModalHeader}
      body={this.state.confirmationModalBody}
      onYes={this.state.onConfirmationModalConfirm}
      onNo={this.state.onConfirmationModalCancel}
      isOpen={this.state.isConfirmationModalOpen}
    />
  );

  onChange = (templateIdx, propertyName) => event => {
    const { notificationTemplates, dirtyNotificationTemplates } = this.state;
    const template = notificationTemplates[templateIdx];
    const value = extractEventValue(event);
    template[propertyName] = value;
    const templateUuid = notificationTemplates?.[templateIdx]?.[TEMPLATE_UUID_PROPERTY_NAME];
    dirtyNotificationTemplates.add(templateUuid);
    this.setState({ notificationTemplates, dirtyNotificationTemplates });
  };

  description = (template, templateIdx) => (
    <div className="py-2">
      <TextareaWithPlaceholder
        value={template[TEMPLATE_DESCRIPTION_PROPERTY_NAME]}
        onChange={this.onChange(templateIdx, TEMPLATE_DESCRIPTION_PROPERTY_NAME)}
        placeholder={this.props.intl.formatMessage({ id: 'notificationTemplates.template.description' })}
        showPlaceholder={template[TEMPLATE_DESCRIPTION_PROPERTY_NAME]}
      />
    </div>
  );

  text = (template, templateIdx) => (
    <div className="py-2">
      <VelocityCodeEditorWithPlaceholder
        value={template[TEMPLATE_VALUE_PROPERTY_NAME]}
        lineNumbers
        placeholder={this.props.intl.formatMessage({ id: 'notificationTemplates.template.text' })}
        showPlaceholder={!!template[TEMPLATE_VALUE_PROPERTY_NAME]}
        onChange={this.onChange(templateIdx, TEMPLATE_VALUE_PROPERTY_NAME)}
      />
    </div>
  );

  addNewTemplate = () => {
    const { notificationTemplates } = this.state;
    notificationTemplates.push({});
    this.setState({ notificationTemplates });
  };

  onRemoveTemplate = templateIdx => {
    this.setState({
      isConfirmationModalOpen: true,
      confirmationModalHeader: { id: 'notificationTemplates.removeTemplateModal.header' },
      confirmationModalBody: {
        id: 'notificationTemplates.removeTemplateModal.body',
        values: { templateName: this.state.notificationTemplates[templateIdx][TEMPLATE_NAME_PROPERTY_NAME] }
      },
      onConfirmationModalConfirm: () => {
        this.removeTemplate(templateIdx);
        this.closeModal();
      },
      onConfirmationModalCancel: this.closeModal
    });
  };

  removeTemplate = templateIdx => {
    const { notificationTemplates } = this.state;
    notificationTemplates.splice(templateIdx, ONE);
    this.setState({ notificationTemplates });
  };

  customTemplateHeader = (template, templateIdx, disabled = false) => {
    const { intl } = this.props;
    const templateName = template[TEMPLATE_NAME_PROPERTY_NAME];
    const isTemplateNameEmpty = !templateName;
    const templateNameRegex = new RegExp(TEMPLATE_NAME_REGEX);
    const isTemplateNameInvalid = !templateNameRegex.test(templateName);
    return (
      <>
        <div className="flex-1">
          <InputWithPlaceholder
            placeholder={intl.formatMessage({ id: 'notificationTemplates.template.customTemplateName.label' })}
            showPlaceholder={!isTemplateNameEmpty}
            value={!!templateName ? templateName : ''}
            onChange={this.onChange(templateIdx, TEMPLATE_NAME_PROPERTY_NAME)}
            className={!disabled && (isTemplateNameEmpty || isTemplateNameInvalid) ? 'invalid' : ''}
            disabled={disabled}
          />
          {!disabled &&
            (isTemplateNameEmpty ? (
              <ValidationError message="common.error.required" />
            ) : (
              isTemplateNameInvalid && <ValidationError message="notificationTemplates.template.customTemplateName.invalid" />
            ))}
        </div>
        <Label className="custom-template-name-tooltip">
          <span
            className="glyphicon glyphicon-info-sign ml-2"
            aria-hidden="true"
            title={intl.formatMessage({ id: 'notificationTemplates.template.customTemplateName.tooltip' })}
          />
        </Label>
      </>
    );
  };

  addInjectedService = () => {
    const { notificationTemplates } = this.state;
    const injectedServices = notificationTemplates.find(
      template => template[TEMPLATE_NAME_PROPERTY_NAME] === INJECTED_SERVICES_SETTING_KEY_SUFFIX
    );
    injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].push(_.clone(DEFAULT_INJECTED_SERVICE));
    this.setState({ notificationTemplates });
  };

  removeInjectedService = injectedServiceIdx => {
    const { notificationTemplates } = this.state;
    const injectedServices = notificationTemplates.find(
      template => template[TEMPLATE_NAME_PROPERTY_NAME] === INJECTED_SERVICES_SETTING_KEY_SUFFIX
    );
    injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].splice(injectedServiceIdx, ONE);
    if (!injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].length) {
      injectedServices[TEMPLATE_VALUE_PROPERTY_NAME].push(_.clone(DEFAULT_INJECTED_SERVICE));
    }
    this.setState({ notificationTemplates });
  };

  onInjectedServicePropertyChange = (injectedServiceIdx, propertyName) => event => {
    const { notificationTemplates, dirtyNotificationTemplates } = this.state;
    const injectedServices = notificationTemplates.find(
      template => template[TEMPLATE_NAME_PROPERTY_NAME] === INJECTED_SERVICES_SETTING_KEY_SUFFIX
    );
    injectedServices[TEMPLATE_VALUE_PROPERTY_NAME][injectedServiceIdx][propertyName] = extractEventValue(event);
    const templateUuid = injectedServices?.[TEMPLATE_UUID_PROPERTY_NAME];
    dirtyNotificationTemplates.add(templateUuid);
    this.setState({ notificationTemplates, dirtyNotificationTemplates });
  };

  injectedServicesBody = template => {
    const { intl } = this.props;
    const injectedServices = template[TEMPLATE_VALUE_PROPERTY_NAME];
    return (
      <div className="py-2">
        {injectedServices?.map((service, serviceIdx) => {
          const key = service[INJECTED_SERVICES_KEY];
          const value = service[INJECTED_SERVICES_VALUE];
          return (
            <div className="inline-fields py-1" key={`injectedService-${serviceIdx}`}>
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'notificationTemplates.injectedServices.key' })}
                showPlaceholder={!!key}
                value={key}
                onChange={this.onInjectedServicePropertyChange(serviceIdx, INJECTED_SERVICES_KEY)}
                wrapperClassName="flex-1"
              />
              <InputWithPlaceholder
                placeholder={intl.formatMessage({ id: 'notificationTemplates.injectedServices.value' })}
                showPlaceholder={!!value}
                value={value}
                onChange={this.onInjectedServicePropertyChange(serviceIdx, INJECTED_SERVICES_VALUE)}
                wrapperClassName="flex-1"
              />
              <PlusMinusButtons
                intl={intl}
                onPlusClick={() => this.addInjectedService()}
                onMinusClick={() => this.removeInjectedService(serviceIdx)}
                isPlusButtonVisible={serviceIdx === injectedServices.length - 1}
              />
            </div>
          );
        })}
      </div>
    );
  };

  template = (template, templateIdx) => {
    const { intl } = this.props;
    const { isAllSectionsExpanded, savedNotificationTemplates } = this.state;
    const templateName = template[TEMPLATE_NAME_PROPERTY_NAME];
    const templateUuid = template[TEMPLATE_UUID_PROPERTY_NAME];
    const isInjectedServices = templateName === INJECTED_SERVICES_SETTING_KEY_SUFFIX;
    const isSavedTemplate = savedNotificationTemplates.includes(template);
    const headerComponent = isInjectedServices ? (
      <Label>
        <FormattedMessage id="notificationTemplates.injectedServices.label" />
        <span
          className="glyphicon glyphicon-info-sign ml-2"
          aria-hidden="true"
          title={intl.formatMessage({ id: 'notificationTemplates.injectedServices.tooltip' })}
        />
      </Label>
    ) : isSavedTemplate ? (
      <Label>{templateName}</Label>
    ) : (
      this.customTemplateHeader(template, templateIdx)
    );
    const disabledHeaderComponent =
      isInjectedServices || isSavedTemplate ? headerComponent : this.customTemplateHeader(template, templateIdx, true);
    const bodyComponent = isInjectedServices
      ? this.injectedServicesBody(template)
      : [this.description(template, templateIdx), this.text(template, templateIdx)];
    return (
      <ExpandableSection
        key={`template-${templateIdx}-${templateUuid}`}
        headerComponent={headerComponent}
        disabledHeaderComponent={disabledHeaderComponent}
        bodyComponent={bodyComponent}
        isRemovable={this.isRemovable(templateIdx) && !isInjectedServices}
        onRemove={() => this.onRemoveTemplate(templateIdx)}
        isExpandTriggered={isAllSectionsExpanded}
      />
    );
  };

  expandOrCollapseAllButton = () => {
    const { isAllSectionsExpanded } = this.state;
    return (
      <Button onClick={() => this.setState(state => ({ isAllSectionsExpanded: !state.isAllSectionsExpanded }))} className="cancel">
        <FormattedMessage id={`notificationTemplates.button.${isAllSectionsExpanded ? 'collapse' : 'expand'}`} />
      </Button>
    );
  };

  render() {
    const { appError, appLoading, loadingUnremovableGlobalProperties, loading } = this.props;
    const { notificationTemplates } = this.state;
    return (
      <div className="notification-templates">
        {this.confirmationModal()}
        <h2>
          <FormattedMessage id="notificationTemplates.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || loadingUnremovableGlobalProperties || loading ? (
            <Spinner />
          ) : (
            <>
              <div className="section">
                <div className="title-section">{this.expandOrCollapseAllButton()}</div>
                {notificationTemplates.map((template, idx) => this.template(template, idx))}
                <div className="d-flex justify-content-end mt-4 mb-2">
                  <Button className="btn btn-primary" onClick={this.addNewTemplate}>
                    <FormattedMessage id="notificationTemplates.button.addNewTemplate" />
                  </Button>
                </div>
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return}>
                    <FormattedMessage id="common.return" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.onSave} disabled={this.isSaveDisabled()}>
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

const mapStateToProps = ({ apps, settings, provider, messages }) => ({
  appError: apps.errorMessage,
  appLoading: apps.loading,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  settings: settings.settings,
  isSettingExist: settings.isSettingExist,
  smsProviders: provider.smsProviders,
  callflowsProviders: provider.callflowsProviders,
  loadingUnremovableGlobalProperties: messages.loading,
  unremovableGlobalProperties: messages.messagesTemplatesGlobalProperties
});

const mapDispatchToProps = {
  getSettings,
  createSetting,
  updateSetting,
  deleteSetting,
  getCallflowsProviders,
  getSmsProviders,
  getMessagesTemplatesGlobalProperties
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(NotificationConfiguration)));
