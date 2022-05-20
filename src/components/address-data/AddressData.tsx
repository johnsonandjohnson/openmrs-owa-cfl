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
import './AddressData.scss';
import { FormattedMessage, injectIntl } from 'react-intl';
import '../Inputs.scss';
import { Button, Spinner } from 'reactstrap';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ROOT_URL } from '../../shared/constants/openmrs';
import { ZERO } from '../../shared/constants/input';
import { ConfirmationModal } from '../common/form/ConfirmationModal';
import { successToast, errorToast } from '@bit/soldevelo-omrs.cfl-components.toast-handler';
import InfiniteTable from '../common/InfiniteTable';
import { getAddressDataPage, getAddressData, postAddressData } from '../../redux/reducers/address-data';
import {
  ACCEPTED_FILE_EXTENSIONS,
  ADDRESS_DATA_TABLE_COLUMNS,
  DEFAULT_DOWNLOAD_FILENAME,
  DEFAULT_INVALID_ADDRESS_DATA_FILENAME
} from '../../shared/constants/address-data';
import { STRING_FALSE, STRING_TRUE } from '../../shared/constants/input';
import downloadCsv from 'download-csv';
import Dropzone from '../common/dropzone/Dropzone';

export interface IAddressDataProps extends StateProps, DispatchProps, RouteComponentProps {
  intl: any;
}

export interface IAddressDataState {
  isModalOpen: boolean;
  modalHeader: {};
  modalBody: {};
  onModalConfirm: any;
  onModalCancel: any;
  isDragActive: boolean;
  acceptedFile: any;
  rejectedFile: any;
  isOverwriteAddressData: boolean;
  page: number;
  isDownloadableAddressDataValid: boolean;
}

class AddressData extends React.Component<IAddressDataProps, IAddressDataState> {
  state = {
    isModalOpen: false,
    modalHeader: { id: '', values: {} },
    modalBody: { id: '', values: {} },
    onModalConfirm: null,
    onModalCancel: null,
    isDragActive: false,
    acceptedFile: null,
    rejectedFile: null,
    isOverwriteAddressData: false,
    page: 0,
    isDownloadableAddressDataValid: false
  };

  componentDidMount() {
    this.props.getAddressDataPage(this.state.page);
  }

  componentDidUpdate(prevProps: Readonly<IAddressDataProps>, prevState: Readonly<IAddressDataState>, snapshot?: any) {
    const { intl, error, addressDataUploaded, downloadableAddressData } = this.props;
    if (!prevProps.addressDataUploaded && addressDataUploaded) {
      successToast(intl.formatMessage({ id: 'addressData.upload.success' }));
      this.setState({ page: ZERO, isDownloadableAddressDataValid: false }, () => this.props.getAddressDataPage(this.state.page));
    } else if (prevProps.downloadableAddressData !== downloadableAddressData) {
      this.setState({ isDownloadableAddressDataValid: true }, this.triggerAddressDataDownload);
    } else if (prevProps.error !== error) {
      errorToast(error);
    }
  }

  return = () => {
    window.location.href = ROOT_URL;
  };

  onUpload = () => {
    const { acceptedFile, isOverwriteAddressData } = this.state;
    this.setState({
      isModalOpen: true,
      modalHeader: { id: `addressData.upload.overwriteAddressData.${isOverwriteAddressData}.modalHeader` },
      modalBody: { id: `addressData.upload.overwriteAddressData.${isOverwriteAddressData}.modalBody` },
      onModalConfirm: () => {
        this.props.postAddressData(acceptedFile, isOverwriteAddressData);
        this.closeModal();
      },
      onModalCancel: this.closeModal
    });
  };

  closeModal = () => this.setState({ isModalOpen: false });

  onOverwriteAddressDataChange = event => this.setState({ isOverwriteAddressData: event.target.value === STRING_TRUE });

  switchPage = page => this.setState({ page }, () => this.props.getAddressDataPage(this.state.page));

  columnContent = (entity, column) => entity[ADDRESS_DATA_TABLE_COLUMNS.indexOf(column)];

  triggerAddressDataDownload = () => downloadCsv(this.props.downloadableAddressData, null, DEFAULT_DOWNLOAD_FILENAME);

  downloadAddressData = () => (this.state.isDownloadableAddressDataValid ? this.triggerAddressDataDownload() : this.props.getAddressData());

  triggerInvalidAddressDataDownload = () => downloadCsv(this.props.invalidAddressData, null, DEFAULT_INVALID_ADDRESS_DATA_FILENAME);

  confirmationModal = () => (
    <ConfirmationModal
      header={this.state.modalHeader}
      body={this.state.modalBody}
      onYes={this.state.onModalConfirm}
      onNo={this.state.onModalCancel}
      isOpen={this.state.isModalOpen}
    />
  );

  instructions = () => (
    <>
      <p>
        <FormattedMessage id="addressData.upload.instruction1" values={{ b: (...text) => <b>{text}</b> }} />
      </p>
      <p className="d-inline">
        <FormattedMessage id="addressData.upload.instruction2" />
      </p>
      <a href={`${ROOT_URL}owa/cfl-ui/address-data/address-data-sample-file.csv`} download className="ml-2">
        <FormattedMessage id="addressData.download.csvFileSample" />
      </a>
      <a href={`${ROOT_URL}owa/cfl-ui/address-data/address-data-sample-file.txt`} download className="ml-2">
        <FormattedMessage id="addressData.download.txtFileSample" />
      </a>
    </>
  );

  overwriteAddressDataRadioButtons = () => (
    <div onChange={this.onOverwriteAddressDataChange} className="my-2">
      <div className="radio-button-wrapper">
        <input type="radio" id="overwrite-false" value={STRING_FALSE} name="overwriteAddressData" className="radio-button" defaultChecked />
        <label htmlFor="overwrite-false">
          <FormattedMessage id="addressData.upload.overwriteAddressData.false.radioLabel" />
        </label>
      </div>
      <div className="radio-button-wrapper">
        <input type="radio" id="overwrite-true" value={STRING_TRUE} name="overwriteAddressData" className="radio-button" />
        <label htmlFor="overwrite-true">
          <FormattedMessage id="addressData.upload.overwriteAddressData.true.radioLabel" />
        </label>
      </div>
    </div>
  );

  uploadButton = () => {
    const { numberOfInvalidRecords, numberOfTotalRecords, intl, addressDataUploading, uploadFailure } = this.props;

    return (
      <div className="upload-button-wrapper">
        <div className="upload-button">
          {addressDataUploading && (
            <div className="spinner">
              <Spinner />
            </div>
          )}
          <Button onClick={this.onUpload} disabled={addressDataUploading || !this.state.acceptedFile} className="pull-right">
            <FormattedMessage id="addressData.upload.button" />
          </Button>
        </div>
        <p className="upload-failure pull-right">{uploadFailure}</p>
        {!!numberOfInvalidRecords && (
          <div className="upload-error">
            <i className="bi bi-exclamation-circle"></i>
            <p className="upload-error-text">
              {intl.formatMessage({ id: 'addressData.upload.errorMessage1' }, { numberOfInvalidRecords, numberOfTotalRecords })}
              <FormattedMessage id="addressData.upload.errorMessage2" tagName="span" />
              <a className="csvDownloadLink" onClick={this.triggerInvalidAddressDataDownload}>
                <FormattedMessage id="addressData.upload.csvDownloadLink" />
              </a>
              <FormattedMessage id="addressData.upload.dot" tagName="span" />
            </p>
          </div>
        )}
      </div>
    );
  };

  downloadButton = disabled => (
    <Button onClick={this.downloadAddressData} disabled={disabled || !this.props.totalCount} className="cancel">
      <FormattedMessage id="addressData.download.button" />
    </Button>
  );

  uploadedFileTable = () => {
    const { page } = this.state;
    const { totalCount, addressDataLoading, addressDataUploading, addressData, hasNextPage } = this.props;
    const isTotalCountMoreThanZero = totalCount > ZERO;
    const displaySpinner = addressDataLoading && (!isTotalCountMoreThanZero || addressDataUploading);

    return (
      <div className="section table-section">
        <div className="title-section">
          <h2>
            <FormattedMessage id="addressData.table.title" />
          </h2>
          {this.downloadButton(displaySpinner)}
        </div>
        {displaySpinner ? (
          <div className="spinner">
            <Spinner />
          </div>
        ) : isTotalCountMoreThanZero ? (
          <InfiniteTable
            columns={ADDRESS_DATA_TABLE_COLUMNS}
            entities={addressData}
            columnContent={this.columnContent}
            hasNext={hasNextPage}
            currentPage={page}
            switchPage={this.switchPage}
          />
        ) : (
          <p className="address-data-empty">
            <FormattedMessage id="addressData.upload.addressDataEmpty" />
          </p>
        )}
      </div>
    );
  };

  render() {
    const { appError, appLoading } = this.props;
    return (
      <div id="address-data">
        {this.confirmationModal()}
        <h2>
          <FormattedMessage id="addressData.title" />
        </h2>
        <div className="error">{appError}</div>
        <div className="inner-content">
          {appLoading ? (
            <div className="spinner">
              <Spinner />
            </div>
          ) : (
            <div className="section">
              <h2>
                <FormattedMessage id="addressData.upload.title" />
              </h2>
              {this.instructions()}
              <Dropzone
                acceptedFileExt={ACCEPTED_FILE_EXTENSIONS}
                instructionMessageId="addressData.dropzone.instruction"
                onFileAccepted={acceptedFile => this.setState({ acceptedFile })}
              />
              {this.overwriteAddressDataRadioButtons()}
              {this.uploadButton()}
              {this.uploadedFileTable()}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ apps, addressData }) => ({
  appError: apps.errorMessage,
  appLoading: apps.loading,
  error: apps.errorMessage,
  addressDataLoading: addressData.loadingAddressData,
  addressDataUploading: addressData.addressDataUploading,
  addressDataUploaded: addressData.addressDataUploaded,
  addressData: addressData.addressData,
  hasNextPage: addressData.hasNextPage,
  totalCount: addressData.totalCount,
  uploadFailure: addressData.errorMessage,
  downloadableAddressData: addressData.downloadableAddressData,
  invalidAddressData: addressData.invalidAddressData,
  numberOfInvalidRecords: addressData.numberOfInvalidRecords,
  numberOfTotalRecords: addressData.numberOfTotalRecords
});

const mapDispatchToProps = { getAddressDataPage, getAddressData, postAddressData };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(AddressData)));
