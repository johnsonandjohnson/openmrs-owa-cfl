import React from 'react';
import { connect } from 'react-redux';
import './VmpVaccinationSchedule.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import { DEFAULT_REGIMEN_UPDATE_PERMITTED, SETTING_KEY as VMP_CONFIG_SETTING_KEY } from '../../shared/constants/vmp-config';
import {
  DEFAULT_DOSING_VISIT_TYPES,
  DEFAULT_VMP_VACCINATION_SCHEDULE,
  EMPTY_REGIMEN,
  EMPTY_VISIT,
  VMP_VACCINATION_SCHEDULE_SETTING_KEY
} from '../../shared/constants/vmp-vaccination-schedule';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { getVisitTypes } from '../../redux/reducers/visit';
import { parseJson } from '../../shared/util/json-util';
import '../Inputs.scss';
import { InputWithPlaceholder, SelectWithPlaceholder } from '../common/form/withPlaceholder';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { ZERO } from '../../shared/constants/input';
import { IVmpVaccinationSchedule } from '../../shared/models/vmp-vaccination-schedule';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { extractEventValue, ordinalIndicator, selectDefaultTheme } from '../../shared/util/form-util';
import _ from 'lodash';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import { IVmpConfig } from 'src/shared/models/vmp-config';
import { PlusMinusButtons } from '../common/form/PlusMinusButtons';

export interface IVmpVaccinationScheduleProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IVmpVaccinationScheduleState {
  vmpConfig: IVmpConfig;
  vmpVaccinationSchedule: IVmpVaccinationSchedule[];
  savedVmpVaccinationSchedule: IVmpVaccinationSchedule[];
  vmpVaccinationScheduleSetting: {};
  isModalOpen: boolean;
  modalHeader: {};
  modalBody: {};
  onModalConfirm: any;
  onModalCancel: any;
}

class VmpVaccinationSchedule extends React.Component<IVmpVaccinationScheduleProps, IVmpVaccinationScheduleState> {
  state = {
    vmpConfig: {} as IVmpConfig,
    vmpVaccinationSchedule: [],
    savedVmpVaccinationSchedule: [],
    vmpVaccinationScheduleSetting: { uuid: null, value: null },
    isModalOpen: false,
    modalHeader: { id: '', values: {} },
    modalBody: { id: '', values: {} },
    onModalConfirm: null,
    onModalCancel: null
  };

  componentDidMount() {
    this.props.getSettingByQuery(VMP_CONFIG_SETTING_KEY);
    this.props.getSettingByQuery(VMP_VACCINATION_SCHEDULE_SETTING_KEY);
    this.props.getVisitTypes();
    this.extractConfigData();
  }

  componentDidUpdate(prevProps: Readonly<IVmpVaccinationScheduleProps>, prevState: Readonly<IVmpVaccinationScheduleState>, snapshot?: any) {
    const { intl, config, loading, success, error } = this.props;
    if (prevProps.config !== config) {
      this.extractConfigData();
    }
    if (!prevProps.success && success) {
      successToast(intl.formatMessage({ id: 'vmpVaccinationSchedule.success' }));
      this.props.getSettingByQuery(VMP_VACCINATION_SCHEDULE_SETTING_KEY);
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    }
  }

  extractConfigData = () => {
    let config = parseJson(this.props.config);
    if (!config || config.length === 0) {
      config = _.cloneDeep(DEFAULT_VMP_VACCINATION_SCHEDULE);
    }
    if (this.props.setting?.property === VMP_VACCINATION_SCHEDULE_SETTING_KEY) {
      this.setState({
        vmpVaccinationSchedule: config,
        vmpVaccinationScheduleSetting: this.props.setting,
        savedVmpVaccinationSchedule: _.clone(config)
      });
    } else if (this.props.setting?.property === VMP_CONFIG_SETTING_KEY) {
      this.setState({ vmpConfig: config });
    }
  };

  generateConfig = () => {
    let config = _.cloneDeep(this.state.vmpVaccinationSchedule);
    // filter out empty rows
    if (!!config) {
      config = config.filter(regimen => !!regimen.name);
      config.forEach(regimen => {
        regimen.visits = !!regimen.visits ? regimen.visits.filter(visit => !!visit.nameOfDose) : [];
      });
    }
    return config;
  };

  onValueChange = event => {
    let config = _.cloneDeep(this.state.vmpVaccinationSchedule);
    config = extractEventValue(event);
    this.setState({ vmpVaccinationSchedule: config });
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  getVaccineByRegimenIndex = regimenIdx => {
    const { vmpConfig, vmpVaccinationSchedule } = this.state;
    return !!vmpConfig &&
      !!vmpConfig.vaccine &&
      !!vmpConfig.vaccine.find(vaccine => vaccine.name === vmpVaccinationSchedule[regimenIdx].name)
      ? vmpConfig.vaccine.find(vaccine => vaccine.name === vmpVaccinationSchedule[regimenIdx].name)
      : null;
  };

  save = () => {
    const { vmpVaccinationScheduleSetting } = this.state;
    const config = this.generateConfig();
    const configJson = JSON.stringify(config);
    if (vmpVaccinationScheduleSetting && vmpVaccinationScheduleSetting.uuid) {
      vmpVaccinationScheduleSetting.value = configJson;
      this.props.updateSetting(vmpVaccinationScheduleSetting);
    } else {
      this.props.createSetting(VMP_VACCINATION_SCHEDULE_SETTING_KEY, configJson);
    }
  };

  onSave = () => {
    const allRegimen = !!this.state.vmpConfig && !!this.state.vmpConfig.vaccine && this.state.vmpConfig.vaccine.length;
    const configuredRegimen = !!this.state.vmpVaccinationSchedule && this.state.vmpVaccinationSchedule.length;
    this.setState({
      isModalOpen: true,
      modalHeader: { id: 'vmpVaccinationSchedule.submit.header' },
      modalBody: this.isAllRegimenConfigured()
        ? { id: 'vmpVaccinationSchedule.submit.body.regimenAllConfigured' }
        : { id: 'vmpVaccinationSchedule.submit.body.regimenPartlyConfigured', values: { allRegimen, configuredRegimen } },
      onModalConfirm: () => {
        this.save();
        this.closeModal();
      },
      onModalCancel: this.closeModal
    });
  };

  deleteRegimenConfig = regimenIdx => {
    const { vmpVaccinationSchedule } = this.state;
    vmpVaccinationSchedule.splice(regimenIdx, 1);
    if (vmpVaccinationSchedule.length === 0) {
      this.addRegimenConfig();
    }
    this.onValueChange(vmpVaccinationSchedule);
  };

  onDeleteRegimenConfig = regimenIdx => {
    const { vmpVaccinationSchedule } = this.state;
    const regimenName = !!vmpVaccinationSchedule && !!vmpVaccinationSchedule[regimenIdx] ? vmpVaccinationSchedule[regimenIdx].name : null;
    if (!!regimenName) {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpVaccinationSchedule.deleteRegimenConfig.header' },
        modalBody: { id: 'vmpVaccinationSchedule.deleteRegimenConfig.body', values: { regimenName } },
        onModalConfirm: () => {
          this.deleteRegimenConfig(regimenIdx);
          this.closeModal();
        },
        onModalCancel: this.closeModal
      });
    } else {
      this.deleteRegimenConfig(regimenIdx);
    }
  };

  addRegimenConfig = () => {
    const { vmpVaccinationSchedule } = this.state;
    vmpVaccinationSchedule.push(_.cloneDeep(EMPTY_REGIMEN));
    this.onValueChange(vmpVaccinationSchedule);
  };

  recalculateNumberOfFutureVisit = visits => {
    let numberOfFutureVisit = 0;
    visits.reverse().forEach(visit => {
      if (this.props.dosingVisitTypes.includes(visit.nameOfDose)) {
        visit.numberOfFutureVisit = numberOfFutureVisit;
        numberOfFutureVisit = 0;
      } else {
        visit.numberOfFutureVisit = 0;
      }
      numberOfFutureVisit = numberOfFutureVisit + 1;
    });
    return visits.reverse();
  };

  regimenOptions = regimenIdx => {
    const { vmpConfig, vmpVaccinationSchedule } = this.state;
    const selectedRegimen = !!vmpVaccinationSchedule
      ? vmpVaccinationSchedule.filter((regimen, idx) => idx !== regimenIdx).map(regimen => regimen.name)
      : [];
    return !!vmpConfig && !!vmpConfig.vaccine
      ? vmpConfig.vaccine
          .filter(regimen => !selectedRegimen.includes(regimen.name))
          .map(regimen => ({ label: regimen.name, value: regimen.name }))
      : [];
  };

  onRegimenChange = regimenIdx => event => {
    const { vmpConfig, vmpVaccinationSchedule } = this.state;
    const regimenName = event.value;
    const vaccine = !!vmpConfig && !!vmpConfig.vaccine && vmpConfig.vaccine.find(vc => vc.name === regimenName);
    const regimen = {
      name: regimenName,
      numberOfDose: !!vaccine && !!vaccine.manufacturers ? vaccine.manufacturers.length : ZERO,
      visits: [EMPTY_VISIT]
    };
    if (
      !!vmpVaccinationSchedule &&
      !!vmpVaccinationSchedule[regimenIdx] &&
      !!vmpVaccinationSchedule[regimenIdx].visits &&
      vmpVaccinationSchedule[regimenIdx].visits.some(visit => !!visit.nameOfDose)
    ) {
      this.setState({
        isModalOpen: true,
        modalHeader: { id: 'vmpVaccinationSchedule.changeRegimen.header' },
        modalBody: { id: 'vmpVaccinationSchedule.changeRegimen.body' },
        onModalConfirm: () => {
          vmpVaccinationSchedule[regimenIdx] = regimen;
          this.onValueChange(vmpVaccinationSchedule);
          this.closeModal();
        },
        onModalCancel: this.closeModal
      });
    } else {
      vmpVaccinationSchedule[regimenIdx] = regimen;
      this.onValueChange(vmpVaccinationSchedule);
    }
  };

  addVisit = (regimenIdx, prevVisitIdx) => {
    const { vmpVaccinationSchedule } = this.state;
    vmpVaccinationSchedule[regimenIdx].visits.splice(prevVisitIdx + 1, 0, EMPTY_VISIT);
    this.onValueChange(vmpVaccinationSchedule);
  };

  removeVisit = (regimenIdx, visitIdx) => {
    const { vmpVaccinationSchedule } = this.state;
    let visits = vmpVaccinationSchedule[regimenIdx].visits;
    visits.splice(visitIdx, 1);
    if (visits.length === 0) {
      visits.push({});
    }
    visits = this.recalculateNumberOfFutureVisit(visits);
    this.onValueChange(vmpVaccinationSchedule);
  };

  visitTypeOptions = regimenIdx => {
    const { visitTypes, dosingVisitTypes } = this.props;
    if (this.isAllDosesConfigured(regimenIdx) && !!dosingVisitTypes) {
      return visitTypes
        .filter(visitType => !dosingVisitTypes.includes(visitType.display))
        .map(visitType => ({ label: visitType.display, value: visitType.display }));
    }
    return visitTypes.map(visitType => ({ label: visitType.display, value: visitType.display }));
  };

  onVisitTypeChange = (regimenIdx, visitIdx) => event => {
    const { vmpVaccinationSchedule } = this.state;
    const { dosingVisitTypes } = this.props;
    const nameOfDose = event.value;
    let doseNumber = 1;
    if (!!dosingVisitTypes && dosingVisitTypes.includes(nameOfDose)) {
      vmpVaccinationSchedule[regimenIdx].visits.forEach((visit, idx) => {
        if (dosingVisitTypes.includes(visit.nameOfDose) && idx < visitIdx) {
          doseNumber = doseNumber + 1;
        }
      });
    }
    vmpVaccinationSchedule[regimenIdx].visits[visitIdx] = {
      ...vmpVaccinationSchedule[regimenIdx].visits[visitIdx],
      nameOfDose,
      doseNumber
    };
    vmpVaccinationSchedule[regimenIdx].visits = this.recalculateNumberOfFutureVisit(vmpVaccinationSchedule[regimenIdx].visits);
    this.onValueChange(vmpVaccinationSchedule);
  };

  onWindowChange = (regimenIdx, visitIdx, name) => e => {
    const { vmpVaccinationSchedule } = this.state;
    vmpVaccinationSchedule[regimenIdx].visits[visitIdx][name] = parseInt(e.target.value, 10);
    this.onValueChange(vmpVaccinationSchedule);
  };

  doseManufacturer = (regimenIdx, doseNumber) => {
    const vaccine = this.getVaccineByRegimenIndex(regimenIdx);
    return !!vaccine && !!vaccine.manufacturers && !!vaccine.manufacturers[doseNumber - 1] ? vaccine.manufacturers[doseNumber - 1] : '';
  };

  vaccineManufacturers = regimenIdx => {
    const { vmpVaccinationSchedule } = this.state;
    const { intl, dosingVisitTypes } = this.props;
    const vaccine = this.getVaccineByRegimenIndex(regimenIdx);
    const configuredDoses =
      !!vmpVaccinationSchedule &&
      !!vmpVaccinationSchedule[regimenIdx] &&
      !!vmpVaccinationSchedule[regimenIdx].visits &&
      !!dosingVisitTypes &&
      vmpVaccinationSchedule[regimenIdx].visits.filter(visit => dosingVisitTypes.includes(visit.nameOfDose)).length;
    return (
      !!vaccine &&
      !!vaccine.manufacturers &&
      vaccine.manufacturers.map((manufacturer, i) => (
        <span
          key={`manufacturer-${regimenIdx}-${i}`}
          className={i < configuredDoses ? 'vaccine-manufacturer-configured' : 'vaccine-manufacturer'}
          title={intl.formatMessage({ id: 'vmpVaccinationSchedule.dosesTooltip' })}
        >
          {manufacturer}
        </span>
      ))
    );
  };

  isAllRegimenConfigured = () => {
    const { vmpConfig, vmpVaccinationSchedule } = this.state;
    return !!vmpVaccinationSchedule && !!vmpConfig && !!vmpConfig.vaccine && vmpVaccinationSchedule.length === vmpConfig.vaccine.length;
  };

  isAllDosesConfigured = regimenIdx => {
    const { vmpVaccinationSchedule } = this.state;
    const { dosingVisitTypes } = this.props;
    return !!vmpVaccinationSchedule &&
      !!vmpVaccinationSchedule[regimenIdx] &&
      !!vmpVaccinationSchedule[regimenIdx].visits &&
      !!vmpVaccinationSchedule[regimenIdx].numberOfDose &&
      !!dosingVisitTypes
      ? vmpVaccinationSchedule[regimenIdx].numberOfDose ===
          vmpVaccinationSchedule[regimenIdx].visits.filter(visit => dosingVisitTypes.includes(visit.nameOfDose)).length
      : true;
  };

  canSave = () => this.state.vmpVaccinationSchedule.every((regimen, idx) => this.isAllDosesConfigured(idx));

  closeModal = () => this.setState({ isModalOpen: false });

  regimenConfig = () => {
    const { intl, dosingVisitTypes, regimenUpdatePermitted } = this.props;
    const regimenConfig = this.state.vmpVaccinationSchedule || [];
    return (
      <>
        {regimenConfig.map((regimen, i) => {
          const visits = regimen.visits || [];
          const isReadOnly = this.state.savedVmpVaccinationSchedule.includes(regimen) && !regimenUpdatePermitted;
          return (
            <div key={`regimen-${i}`} className="regimen">
              <div className="delete-button-container d-flex justify-content-end">
                <button className="btn btn-primary" onClick={() => this.onDeleteRegimenConfig(i)}>
                  <FormattedMessage id="vmpVaccinationSchedule.delete" />
                </button>
              </div>
              <div className="d-flex">
                <div className="inline-fields">
                  <div className="col-lg-3 col-xs-12 regimen-visit">
                    <SelectWithPlaceholder
                      placeholder={intl.formatMessage({ id: 'vmpVaccinationSchedule.regimen' })}
                      showPlaceholder={!!regimen.name}
                      value={regimen.name && { value: regimen.name, label: regimen.name }}
                      onChange={this.onRegimenChange(i)}
                      options={this.regimenOptions(i)}
                      wrapperClassName="flex-1"
                      classNamePrefix="default-select"
                      theme={selectDefaultTheme}
                      isDisabled={isReadOnly}
                    />
                  </div>
                  <div className="col-lg-9 col-xs-12 regimen-visit justify-content-start">
                    {this.vaccineManufacturers(i)}
                    {!this.isAllDosesConfigured(i) && (
                      <span className="validation-error">
                        <FormattedMessage id="vmpVaccinationSchedule.dosesCountValidationError" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="action-icons" />
              </div>
              {visits.map((visit, j) => {
                const { doseNumber, nameOfDose, lowWindow, midPointWindow, upWindow } = visit;
                return (
                  <div key={`addressField-${i}-${j}`} className="d-flex">
                    <div className="inline-fields">
                      <div className="col-lg-6 col-sm-12 regimen-visit">
                        <SelectWithPlaceholder
                          placeholder={intl.formatMessage({ id: 'vmpVaccinationSchedule.visitType' })}
                          showPlaceholder={!!nameOfDose}
                          value={nameOfDose ? { value: nameOfDose, label: nameOfDose } : null}
                          onChange={this.onVisitTypeChange(i, j)}
                          options={this.visitTypeOptions(i)}
                          wrapperClassName="flex-1"
                          classNamePrefix="default-select"
                          theme={selectDefaultTheme}
                          isDisabled={isReadOnly}
                        />
                        <InputWithPlaceholder
                          type="number"
                          placeholder={intl.formatMessage({ id: 'vmpVaccinationSchedule.midPointWindow' })}
                          showPlaceholder
                          value={midPointWindow || 0}
                          onChange={this.onWindowChange(i, j, 'midPointWindow')}
                          wrapperClassName="flex-1"
                          min={ZERO}
                          readOnly={isReadOnly}
                        />
                      </div>
                      {!!dosingVisitTypes && dosingVisitTypes.includes(nameOfDose) && (
                        <div className="col-lg-6 col-sm-12 regimen-visit">
                          <InputWithPlaceholder
                            placeholder={`${doseNumber}${intl.formatMessage({
                              id: ordinalIndicator(doseNumber)
                            })} ${intl.formatMessage({ id: 'vmpVaccinationSchedule.doseNumber' })}`}
                            showPlaceholder
                            value={this.doseManufacturer(i, doseNumber)}
                            wrapperClassName="flex-1"
                            disabled
                          />
                          <InputWithPlaceholder
                            type="number"
                            placeholder={intl.formatMessage({ id: 'vmpVaccinationSchedule.lowWindow' })}
                            showPlaceholder
                            value={lowWindow || 0}
                            onChange={this.onWindowChange(i, j, 'lowWindow')}
                            wrapperClassName="flex-1"
                            min={ZERO}
                            readOnly={isReadOnly}
                          />
                          <InputWithPlaceholder
                            type="number"
                            placeholder={intl.formatMessage({ id: 'vmpVaccinationSchedule.upWindow' })}
                            showPlaceholder
                            value={upWindow || 0}
                            onChange={this.onWindowChange(i, j, 'upWindow')}
                            wrapperClassName="flex-1"
                            min={ZERO}
                            readOnly={isReadOnly}
                          />
                        </div>
                      )}
                    </div>
                    {!isReadOnly && (
                      <PlusMinusButtons intl={intl} onPlusClick={() => this.addVisit(i, j)} onMinusClick={() => this.removeVisit(i, j)} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className="d-flex justify-content-end mt-2 mb-2">
          <button className="btn btn-primary" onClick={this.addRegimenConfig} disabled={this.isAllRegimenConfigured()}>
            <FormattedMessage id="vmpVaccinationSchedule.addRegimenConfig" />
          </button>
        </div>
      </>
    );
  };

  renderConfirmationModal = () => (
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
      <div className="vmp-vaccination-schedule">
        {this.renderConfirmationModal()}
        <h2>
          <FormattedMessage id="vmpVaccinationSchedule.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || (loading && !config) ? (
            <Spinner />
          ) : (
            <>
              <div className="section">{this.regimenConfig()}</div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.return}>
                    <FormattedMessage id="common.return" />
                  </Button>
                </div>
                <div className="d-inline pull-right confirm-button-container">
                  <Button className="save" onClick={this.onSave} disabled={loading || !this.canSave()}>
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

const mapStateToProps = ({ apps, settings, visit }) => ({
  dosingVisitTypes: apps?.vmpConfig?.dosingVisitTypes ?? DEFAULT_DOSING_VISIT_TYPES,
  regimenUpdatePermitted: apps?.vmpConfig?.regimenUpdatePermitted ?? DEFAULT_REGIMEN_UPDATE_PERMITTED,
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  visitTypes: visit.visitTypes
});

const mapDispatchToProps = { getSettingByQuery, updateSetting, createSetting, getVisitTypes };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(VmpVaccinationSchedule)));
