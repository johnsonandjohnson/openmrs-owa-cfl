import React from 'react';
import { connect } from 'react-redux';
import Papa from 'papaparse';
import _ from 'lodash';
import downloadCsv from 'download-csv';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Spinner, Table } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import { getAddressData } from '../../redux/reducers/addressData';
import Dropzone from '../common/dropzone/Dropzone';
import { createSetting, getSettingByQuery, updateSetting } from '../../redux/reducers/setttings';
import { IVmpConfig } from 'src/shared/models/vmp-config';
import TextareaAutosize from 'react-textarea-autosize';
import { AddLanguageModal } from './add-language-modal/AddLanguageModal';
import { FilterInput } from '../common/filter-input/FilterInput';
import { FilterSelect } from '../common/filter-select/FilterSelect';
import { searchLocations } from '../../redux/reducers/location';
import { parseJson } from '../../shared/util/json-util';
import { extractEventValue } from '../../shared/util/form-util';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { SETTING_KEY as VMP_CONFIG_SETTING_KEY } from '../../shared/constants/vmp-config';
import {
  DEFAULT_VMP_TRANSLATIONS_SETTING,
  LANGUAGES_ALLOWED_SETTING_KEY,
  LANGUAGE_OPTIONS,
  VMP_TRANSLATIONS_SETTING_KEY,
  DEFAULT_DOWNLOAD_FILENAME,
  DEFAULT_DELIMITER,
  ACCEPTED_FILE_EXTENSIONS
} from '../../shared/constants/vmp-translations';
import { EMPTY_STRING, ZERO } from '../../shared/constants/input';
import './VmpTranslations.scss';
import '../Inputs.scss';

const LANGUAGES_ALLOWED_LIST_DELIMITER = ',';
const LANGUAGE_FILTER_EMPTY_VALUE = { label: EMPTY_STRING, value: null };
const CSV_FILE_DEFAULT_COLUMN_LABEL = 'default';

export interface IVmpAddressDataProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IVmpAddressDataState {
  isConfirmationModalOpen: boolean;
  confirmationModalHeader: {};
  confirmationModalBody: {};
  onConfirmationModalConfirm: any;
  onConfirmationModalCancel: any;
  isDragActive: boolean;
  acceptedFile: any;
  rejectedFile: any;
  translations: {};
  downloadableTranslations: {};
  translationsTableLanguages: any[];
  vmpTranslationsSetting: any;
  languagesAllowed: any[];
  isAddLanguageModalOpen: boolean;
  phraseFilterValue: any;
  languageFilterValue: any;
  isDirty: boolean;
}

export class VmpTranslations extends React.Component<IVmpAddressDataProps, IVmpAddressDataState> {
  state = {
    isConfirmationModalOpen: false,
    confirmationModalHeader: { id: EMPTY_STRING, values: {} },
    confirmationModalBody: { id: EMPTY_STRING, values: {} },
    onConfirmationModalConfirm: null,
    onConfirmationModalCancel: null,
    isDragActive: false,
    acceptedFile: null,
    rejectedFile: null,
    translations: {},
    downloadableTranslations: {},
    translationsTableLanguages: [],
    vmpTranslationsSetting: null,
    languagesAllowed: [],
    isAddLanguageModalOpen: false,
    phraseFilterValue: EMPTY_STRING,
    languageFilterValue: null,
    isDirty: false
  };

  componentDidMount() {
    this.loadTranslations();
  }

  componentDidUpdate(prevProps: Readonly<IVmpAddressDataProps>, prevState: Readonly<IVmpAddressDataState>, snapshot?: any) {
    const { intl, config, addressData, locations, loading, success, error } = this.props;
    if (prevProps.config !== config) {
      this.extractTranslations();
    } else if (prevProps.addressData !== addressData) {
      this.extractAddressDataTranslations();
    } else if (prevProps.locations !== locations) {
      this.extractLocationsTranslations();
    }
    if (!prevProps.success && success) {
      successToast(intl.formatMessage({ id: 'vmpTranslations.save.success' }));
      this.loadTranslations();
    } else if (prevProps.error !== this.props.error && !loading) {
      errorToast(error);
    }
  }

  loadTranslations = () => {
    this.props.getSettingByQuery(VMP_TRANSLATIONS_SETTING_KEY);
    this.props.getAddressData();
    this.props.searchLocations(EMPTY_STRING);
  };

  extractTranslations = () => {
    if (this.props.setting?.property === VMP_TRANSLATIONS_SETTING_KEY) {
      let translations = parseJson(this.props.config);
      translations = !!translations && !!translations.localization ? translations.localization : [];
      const parsedConfig = {};
      Object.keys(translations).forEach(language => {
        Object.keys(translations[language]).forEach(key => {
          parsedConfig[key] = { ...parsedConfig[key], [language]: translations[language][key] };
        });
      });
      this.setState(
        {
          translations: parsedConfig,
          downloadableTranslations: _.cloneDeep(parsedConfig),
          translationsTableLanguages: Object.keys(translations).sort(),
          vmpTranslationsSetting: this.props.setting,
          isDirty: false
        },
        () => {
          this.props.getSettingByQuery(VMP_CONFIG_SETTING_KEY);
          this.props.getSettingByQuery(LANGUAGES_ALLOWED_SETTING_KEY);
        }
      );
    } else if (this.props.setting?.property === VMP_CONFIG_SETTING_KEY) {
      this.extractConfigTranslations();
    } else if (this.props.setting?.property === LANGUAGES_ALLOWED_SETTING_KEY) {
      this.setState(state => ({
        languagesAllowed: !!this.props.config
          ? this.props.config
              .split(LANGUAGES_ALLOWED_LIST_DELIMITER)
              .map(language => language.trim())
              .filter(language => !state.translationsTableLanguages.includes(language))
          : []
      }));
    }
  };

  extractAddressDataTranslations = () => {
    const { translations } = this.state;
    const distinctAddressFields = [];
    if (Array.isArray(this.props.addressData)) {
      this.props.addressData.forEach(address =>
        address.forEach(addressField => {
          if (!!addressField && !distinctAddressFields.includes(addressField) && isNaN(addressField)) {
            distinctAddressFields.push(addressField);
          }
        })
      );
      distinctAddressFields.filter(addressField => !translations[addressField]).forEach(addressField => (translations[addressField] = {}));
      this.setState({ translations, downloadableTranslations: _.cloneDeep(translations) });
    }
  };

  extractConfigTranslations = () => {
    const { translations } = this.state;
    const vmpConfigTranslations = [];
    const config = parseJson(this.props.config) as IVmpConfig;
    config.vaccine.forEach(
      regimen => !!regimen.name && !vmpConfigTranslations.includes(regimen.name) && vmpConfigTranslations.push(regimen.name)
    );
    config.manufacturers.forEach(
      manufacturer =>
        !!manufacturer.name && !vmpConfigTranslations.includes(manufacturer.name) && vmpConfigTranslations.push(manufacturer.name)
    );
    config.personLanguages.forEach(
      language => !!language.name && !vmpConfigTranslations.includes(language.name) && vmpConfigTranslations.push(language.name)
    );
    Object.keys(config.addressFields).forEach(key =>
      config.addressFields[key].forEach(
        addressField =>
          !!addressField.name && !vmpConfigTranslations.includes(addressField.name) && vmpConfigTranslations.push(addressField.name)
      )
    );
    vmpConfigTranslations.filter(translation => !translations[translation]).forEach(translation => (translations[translation] = {}));
    this.setState({ translations, downloadableTranslations: _.cloneDeep(translations) });
  };

  extractLocationsTranslations = () => {
    const { translations } = this.state;
    const { locations } = this.props;
    if (Array.isArray(locations)) {
      locations
        .filter(location => !!location.display && !translations[location.display])
        .forEach(location => (translations[location.display] = {}));
      this.setState({ translations, downloadableTranslations: _.cloneDeep(translations) });
    }
  };

  sortTranslationsAlphabetically = translations => {
    const orderedTranslations = Object.keys(translations)
      .sort()
      .reduce((obj, key) => {
        obj[key] = translations[key];
        return obj;
      }, {});
    return orderedTranslations;
  };

  onValueChange = (translation, language) => e => {
    const { translations } = this.state;
    translations[translation][language] = extractEventValue(e);
    this.setState({
      translations,
      isDirty: true
    });
  };

  save = () => {
    const { vmpTranslationsSetting, translations, translationsTableLanguages } = this.state;
    const settingValue = DEFAULT_VMP_TRANSLATIONS_SETTING;
    translationsTableLanguages.forEach(language => (settingValue.localization[language] = {}));
    Object.keys(translations).forEach(translation =>
      Object.keys(translations[translation]).forEach(
        language => (settingValue.localization[language][translation] = translations[translation][language])
      )
    );
    const settingValueJson = JSON.stringify(settingValue);
    if (vmpTranslationsSetting && vmpTranslationsSetting.uuid) {
      vmpTranslationsSetting.value = settingValueJson;
      this.props.updateSetting(vmpTranslationsSetting);
    } else {
      this.props.createSetting(VMP_TRANSLATIONS_SETTING_KEY, settingValueJson);
    }
  };

  onReturn = () => {
    this.setState({
      isConfirmationModalOpen: true,
      confirmationModalHeader: { id: `vmpTranslations.return.modalHeader` },
      confirmationModalBody: { id: `vmpTranslations.return.modalBody` },
      onConfirmationModalConfirm: this.return,
      onConfirmationModalCancel: this.closeConfirmationModal
    });
  };

  return = () => {
    window.location.href = ROOT_URL;
  };

  addLanguageModal = () => {
    const { languagesAllowed, translationsTableLanguages, isAddLanguageModalOpen } = this.state;
    return (
      <AddLanguageModal
        intl={this.props.intl}
        languages={languagesAllowed.filter(language => !translationsTableLanguages.includes(language))}
        isOpen={isAddLanguageModalOpen}
        onYes={language => this.addLanguage(language)}
        onNo={() => this.setState({ isAddLanguageModalOpen: false })}
      />
    );
  };

  confirmationModal = () => (
    <ConfirmationModal
      header={this.state.confirmationModalHeader}
      body={this.state.confirmationModalBody}
      onYes={this.state.onConfirmationModalConfirm}
      onNo={this.state.onConfirmationModalCancel}
      isOpen={this.state.isConfirmationModalOpen}
    />
  );

  closeConfirmationModal = () => this.setState({ isConfirmationModalOpen: false });

  instructions = () => (
    <p>
      <FormattedMessage id="vmpTranslations.upload.instruction1" values={{ b: (...text) => <b>{text}</b> }} />
    </p>
  );

  uploadButton = () => (
    <div className="upload-button-wrapper">
      <Button onClick={this.onUpload} disabled={!this.state.acceptedFile} className="pull-right">
        <FormattedMessage id="vmp.upload.button" />
      </Button>
    </div>
  );

  onUpload = () => {
    const { acceptedFile } = this.state;
    this.setState({
      isConfirmationModalOpen: true,
      confirmationModalHeader: { id: `vmpTranslations.upload.modalHeader` },
      confirmationModalBody: { id: `vmpTranslations.upload.modalBody` },
      onConfirmationModalConfirm: () => {
        this.uploadTranslationFile(acceptedFile);
        this.closeConfirmationModal();
      },
      onConfirmationModalCancel: this.closeConfirmationModal
    });
  };

  uploadTranslationFile = translationFile => {
    const { translations } = this.state;
    Papa.parse(translationFile, {
      delimiter: DEFAULT_DELIMITER,
      header: true,
      complete: parsedTranslationFile => {
        !!parsedTranslationFile &&
          !!parsedTranslationFile.data &&
          parsedTranslationFile.data.forEach(row => {
            const { default: defaultValue, ...translationValues } = row;
            translations[defaultValue] = translationValues;
          });
        const translationsTableLanguages = !!parsedTranslationFile.meta.fields
          ? parsedTranslationFile.meta.fields.filter(field => field !== CSV_FILE_DEFAULT_COLUMN_LABEL)
          : [];
        this.setState(state => ({
          translations,
          translationsTableLanguages: Array.from(new Set([...state.translationsTableLanguages, ...translationsTableLanguages]))
        }));
      }
    });
  };

  downloadButton = () => (
    <Button onClick={this.onDownloadTranslations} disabled={!this.props.config} className="cancel">
      <FormattedMessage id="vmp.download.button" />
    </Button>
  );

  onDownloadTranslations = () => {
    if (this.state.isDirty) {
      this.setState({
        isConfirmationModalOpen: true,
        confirmationModalHeader: { id: `vmpTranslations.download.modalHeader` },
        confirmationModalBody: { id: `vmpTranslations.download.modalBody` },
        onConfirmationModalConfirm: () => {
          this.downloadTranslations();
          this.closeConfirmationModal();
        },
        onConfirmationModalCancel: this.closeConfirmationModal
      });
    } else {
      this.downloadTranslations();
    }
  };

  downloadTranslations = () => {
    const { downloadableTranslations, translationsTableLanguages } = this.state;
    const csvData = [];
    Object.keys(this.sortTranslationsAlphabetically(downloadableTranslations)).forEach(translation =>
      csvData.push({
        default: translation,
        ...downloadableTranslations[translation]
      })
    );
    downloadCsv(csvData, [CSV_FILE_DEFAULT_COLUMN_LABEL, ...translationsTableLanguages], DEFAULT_DOWNLOAD_FILENAME);
  };

  filters = () => {
    const { intl } = this.props;
    const { translationsTableLanguages, phraseFilterValue, languageFilterValue } = this.state;
    return (
      <div className="pb-3 d-flex">
        <FilterInput
          intl={intl}
          value={phraseFilterValue}
          placeholderId="vmpTranslations.table.filter.phrase"
          wrapperClassName="col p-0"
          onChange={phrase => this.setState({ phraseFilterValue: extractEventValue(phrase) })}
        />
        <FilterSelect
          intl={intl}
          value={LANGUAGE_OPTIONS.find(opt => opt.value === languageFilterValue) || null}
          options={[LANGUAGE_FILTER_EMPTY_VALUE, ...LANGUAGE_OPTIONS.filter(lang => translationsTableLanguages.includes(lang.value))]}
          placeholderId="vmpTranslations.table.filter.language"
          wrapperClassName="col p-0"
          onChange={lang => this.setState({ languageFilterValue: lang.value })}
        />
      </div>
    );
  };

  addLanguageButton = () => (
    <Button onClick={this.onAddLanguage} disabled={Object.keys(this.state.translations).length === ZERO} className="cancel mb-3">
      <FormattedMessage id="vmpTranslations.addLanguage.title" />
    </Button>
  );

  languageColumnLabel = column => {
    const languageOption = LANGUAGE_OPTIONS.find(opt => opt.value === column);
    return !!languageOption && !!languageOption.label && languageOption.label;
  };

  onAddLanguage = () => this.setState({ isAddLanguageModalOpen: true });

  addLanguage = language => {
    const { translationsTableLanguages } = this.state;
    translationsTableLanguages.unshift(language);
    this.setState({ translationsTableLanguages, isAddLanguageModalOpen: false });
  };

  filteredTableColumns = () => {
    const { translationsTableLanguages, languageFilterValue } = this.state;
    return translationsTableLanguages.filter(language => (!!languageFilterValue ? language === languageFilterValue : true));
  };

  filteredTableRows = () => {
    const { translations, phraseFilterValue } = this.state;
    return Object.keys(this.sortTranslationsAlphabetically(translations)).filter(
      translation =>
        translation.toLowerCase().includes(phraseFilterValue.toLowerCase()) ||
        Object.keys(translations[translation]).some(language =>
          translations[translation][language].toLowerCase().includes(phraseFilterValue.toLowerCase())
        )
    );
  };

  uploadedFileTable = () => {
    const { intl, config } = this.props;
    const { translations } = this.state;
    return (
      <div className="section table-section">
        <div className="title-section">{this.downloadButton()}</div>
        {this.filters()}
        {this.addLanguageButton()}
        {config ? (
          <Table borderless striped responsive className="table">
            <thead>
              <tr>
                <th key="id">
                  <FormattedMessage id="vmpTranslations.table.defaultLanguage" />
                </th>
                {this.filteredTableColumns().map(column => (
                  <th key={column}>{this.languageColumnLabel(column)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.filteredTableRows().map((translation, i) => (
                <tr key={`${translation}${i}`}>
                  <td className="px-3">{translation}</td>
                  {this.filteredTableColumns().map((language, j) => (
                    <td key={`${language}${j}`}>
                      <TextareaAutosize
                        value={translations[translation][language]}
                        onChange={this.onValueChange(translation, language)}
                        className="translation-input"
                        placeholder={intl.formatMessage({ id: 'vmpTranslations.table.defaultValue' })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="address-data-empty">
            <FormattedMessage id="vmpAddressData.upload.addressDataEmpty" />
          </p>
        )}
      </div>
    );
  };

  render() {
    const { appError, appLoading, loading, loadingAddressData, loadingLocations } = this.props;
    return (
      <div className="vmp-translations">
        {this.confirmationModal()}
        {this.addLanguageModal()}
        <h2>
          <FormattedMessage id="vmpTranslations.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading || loading || loadingAddressData || loadingLocations ? (
            <Spinner />
          ) : (
            <>
              <div className="section">
                <h2>
                  <FormattedMessage id="vmpTranslations.upload.title" />
                </h2>
                {this.instructions()}
                <Dropzone
                  acceptedFileExt={ACCEPTED_FILE_EXTENSIONS}
                  instructionMessageId="vmpTranslations.dropzone.instruction"
                  onFileAccepted={acceptedFile => this.setState({ acceptedFile })}
                />
                {this.uploadButton()}
                {this.uploadedFileTable()}
              </div>
              <div className="mt-5 pb-5">
                <div className="d-inline">
                  <Button className="cancel" onClick={this.onReturn}>
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

const mapStateToProps = ({ apps, settings, addressData, location }) => ({
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  loading: settings.loading,
  success: settings.success,
  config: settings.setting?.value && settings.setting?.value,
  setting: settings.setting,
  loadingAddressData: addressData.loadingAddressData,
  addressData: addressData.downloadableAddressData,
  locations: location.locations,
  loadingLocations: location.loading
});

const mapDispatchToProps = { getSettingByQuery, getAddressData, createSetting, updateSetting, searchLocations };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(VmpTranslations)));
